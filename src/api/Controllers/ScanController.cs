using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VnMurlSafeWeb.Api.Data;
using VnMurlSafeWeb.Api.DTOs;
using VnMurlSafeWeb.Api.Models;
using VnMurlSafeWeb.Api.Security;
using VnMurlSafeWeb.Api.Services;

namespace VnMurlSafeWeb.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScanController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAiClient _aiClient;
        private readonly IPolicyService _policyService;

        public ScanController(AppDbContext context, IAiClient aiClient, IPolicyService policyService)
        {
            _context = context;
            _aiClient = aiClient;
            _policyService = policyService;
        }

        [HttpPost]
        public async Task<ActionResult<ScanResponseDto>> ScanUrl([FromBody] ScanRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request?.Url))
            {
                return BadRequest(new { error = "URL is required." });
            }

            string rawUrl = request.Url.Trim();

            // 1. SSRF & Private Network Validation
            if (PrivateNetworkValidator.IsPrivateOrLocalUrl(rawUrl, out var errorMsg))
            {
                return BadRequest(new { error = errorMsg });
            }

            // 2. Policy Evaluation (Allowlist / Blocklist)
            var policyMatch = await _policyService.CheckPolicyAsync(rawUrl);
            string? currentUserId = User?.Identity?.IsAuthenticated == true ? User.Identity.Name : null;

            ScanLog scanLog;
            XaiExplanationDto? xai = null;

            if (policyMatch != null)
            {
                scanLog = new ScanLog
                {
                    Url = rawUrl,
                    Label = policyMatch.Label,
                    Action = policyMatch.Action,
                    Confidence = policyMatch.Confidence,
                    Reason = policyMatch.Reason,
                    PhishingScore = policyMatch.Label == "PHISHING" ? 1.0m : 0.0m,
                    AdultScore = policyMatch.Label == "ADULT" ? 1.0m : 0.0m,
                    UserId = currentUserId,
                    CreatedAt = DateTime.UtcNow
                };

                xai = new XaiExplanationDto
                {
                    Verdict = policyMatch.Action == "ALLOW"
                        ? "Xác Nhận: Tên miền nằm trong Danh Sách Cho Phép (Allowlist)"
                        : "Cảnh Báo: Tên miền nằm trong Danh Sách Chặn (Blocklist)",
                    Summary = $"URL này khớp với quy tắc kiểm soát chính sách của quản trị viên: {policyMatch.Reason}.",
                    Factors = new List<XaiFactorDto>
                    {
                        new XaiFactorDto
                        {
                            Title = policyMatch.Action == "ALLOW" ? "Chính sách Danh Sách Trắng (Allowlist)" : "Chính sách Danh Sách Đen (Blocklist)",
                            Type = policyMatch.Action == "ALLOW" ? "TRUST" : "RISK",
                            Severity = policyMatch.Action == "ALLOW" ? "SAFE" : "CRITICAL",
                            Evidence = $"Quy tắc chính sách: {policyMatch.Reason}",
                            Description = "Hệ thống áp dụng chính sách kiểm soát danh sách ưu tiên cao nhất trước khi chạy qua các mô hình AI."
                        }
                    },
                    Recommendations = policyMatch.Action == "ALLOW"
                        ? new List<string> { "Tên miền đã được quản trị viên thẩm định và đưa vào danh sách tin cậy." }
                        : new List<string> { "Tên miền bị quản trị viên chủ động đưa vào danh sách đen ngăn chặn truy cập." }
                };
            }
            else
            {
                // 3. AI Service Inference
                var aiResult = await _aiClient.PredictAsync(rawUrl);

                scanLog = new ScanLog
                {
                    Url = rawUrl,
                    Label = aiResult.Label,
                    Action = aiResult.Action,
                    Confidence = aiResult.Confidence,
                    Reason = aiResult.Reason,
                    PhishingScore = aiResult.PhishingScore,
                    AdultScore = aiResult.AdultScore,
                    SecondaryRisk = aiResult.SecondaryRisk,
                    UserId = currentUserId,
                    CreatedAt = DateTime.UtcNow
                };

                xai = aiResult.Xai;
            }

            _context.ScanLogs.Add(scanLog);
            await _context.SaveChangesAsync();

            return Ok(new ScanResponseDto
            {
                Id = scanLog.Id,
                Url = scanLog.Url,
                Label = scanLog.Label,
                Action = scanLog.Action,
                Confidence = scanLog.Confidence,
                Reason = scanLog.Reason,
                PhishingScore = scanLog.PhishingScore,
                AdultScore = scanLog.AdultScore,
                PhishingThreshold = 0.4250m,
                AdultThreshold = 0.1400m,
                SecondaryRisk = scanLog.SecondaryRisk,
                UserId = scanLog.UserId,
                CreatedAt = scanLog.CreatedAt,
                Xai = xai
            });
        }

        [HttpGet("/api/scans")]
        public async Task<ActionResult<PagedResult<ScanResponseDto>>> GetScans([FromQuery] ScanLogQueryDto query)
        {
            var q = _context.ScanLogs.AsNoTracking();

            string? currentUsername = User?.Identity?.IsAuthenticated == true ? User.Identity.Name : null;
            if (query.OnlyMine == true && !string.IsNullOrEmpty(currentUsername))
            {
                q = q.Where(s => s.UserId == currentUsername);
            }

            if (!string.IsNullOrWhiteSpace(query.Label))
            {
                q = q.Where(s => s.Label == query.Label.ToUpper());
            }

            if (!string.IsNullOrWhiteSpace(query.Action))
            {
                q = q.Where(s => s.Action == query.Action.ToUpper());
            }

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                string search = query.Search.Trim().ToLower();
                q = q.Where(s => s.Url.ToLower().Contains(search) || s.Reason.ToLower().Contains(search) || (s.UserId != null && s.UserId.ToLower().Contains(search)));
            }

            int total = await q.CountAsync();
            int page = Math.Max(1, query.Page);
            int pageSize = Math.Clamp(query.PageSize, 1, 100);

            var items = await q.OrderByDescending(s => s.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new ScanResponseDto
                {
                    Id = s.Id,
                    Url = s.Url,
                    Label = s.Label,
                    Action = s.Action,
                    Confidence = s.Confidence,
                    Reason = s.Reason,
                    PhishingScore = s.PhishingScore,
                    AdultScore = s.AdultScore,
                    PhishingThreshold = 0.4250m,
                    AdultThreshold = 0.1400m,
                    SecondaryRisk = s.SecondaryRisk,
                    UserId = s.UserId,
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();

            return Ok(new PagedResult<ScanResponseDto>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpPost("/api/user/report")]
        public async Task<ActionResult> SubmitReport([FromBody] UserReportDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto?.Url))
                return BadRequest(new { error = "Vui lòng nhập đường link URL cần báo cáo." });

            string rawUrl = dto.Url.Trim();
            string reporter = User?.Identity?.Name ?? "user";

            var scanLog = new ScanLog
            {
                Url = rawUrl,
                Label = string.IsNullOrWhiteSpace(dto.ThreatType) ? "PHISHING" : dto.ThreatType.ToUpperInvariant(),
                Action = "BLOCK",
                Confidence = 1.0m,
                PhishingScore = dto.ThreatType?.ToUpperInvariant() == "PHISHING" ? 1.0m : 0.0m,
                AdultScore = dto.ThreatType?.ToUpperInvariant() == "ADULT" ? 1.0m : 0.0m,
                Reason = $"[Báo cáo từ {reporter}] {dto.Reason}",
                UserId = reporter,
                CreatedAt = DateTime.UtcNow
            };

            _context.ScanLogs.Add(scanLog);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Báo cáo liên kết nguy hại đã được gửi thành công đến Quản trị viên để phân tích!",
                id = scanLog.Id
            });
        }

        [HttpGet("/api/scans/{id}")]
        public async Task<ActionResult<ScanResponseDto>> GetScanById(long id)
        {
            var s = await _context.ScanLogs.FindAsync(id);
            if (s == null) return NotFound(new { error = "Scan log not found" });

            return Ok(new ScanResponseDto
            {
                Id = s.Id,
                Url = s.Url,
                Label = s.Label,
                Action = s.Action,
                Confidence = s.Confidence,
                Reason = s.Reason,
                PhishingScore = s.PhishingScore,
                AdultScore = s.AdultScore,
                PhishingThreshold = 0.4250m,
                AdultThreshold = 0.1400m,
                SecondaryRisk = s.SecondaryRisk,
                CreatedAt = s.CreatedAt
            });
        }
    }
}

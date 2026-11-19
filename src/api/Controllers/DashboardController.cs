using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VnMurlSafeWeb.Api.Data;
using VnMurlSafeWeb.Api.DTOs;
using VnMurlSafeWeb.Api.Services;

namespace VnMurlSafeWeb.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAiClient _aiClient;

        public DashboardController(AppDbContext context, IAiClient aiClient)
        {
            _context = context;
            _aiClient = aiClient;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            var total = await _context.ScanLogs.CountAsync();
            var allowed = await _context.ScanLogs.CountAsync(s => s.Action == "ALLOW");
            var blocked = await _context.ScanLogs.CountAsync(s => s.Action == "BLOCK");
            var phishing = await _context.ScanLogs.CountAsync(s => s.Label == "PHISHING");
            var adult = await _context.ScanLogs.CountAsync(s => s.Label == "ADULT");

            // Check AI service status
            var health = await _aiClient.GetHealthAsync();
            string modelStatus = health.ModelLoaded ? "Operational" : "Degraded / Offline";

            // Recent 10 scans
            var recent = await _context.ScanLogs.AsNoTracking()
                .OrderByDescending(s => s.CreatedAt)
                .Take(10)
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
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();

            // Daily trend for past 7 days
            var pastWeek = DateTime.UtcNow.Date.AddDays(-6);
            var logsPastWeek = await _context.ScanLogs.AsNoTracking()
                .Where(s => s.CreatedAt >= pastWeek)
                .ToListAsync();

            var trends = Enumerable.Range(0, 7)
                .Select(offset => pastWeek.AddDays(offset))
                .Select(d =>
                {
                    var dateStr = d.ToString("MM/dd");
                    var dayLogs = logsPastWeek.Where(l => l.CreatedAt.Date == d.Date).ToList();
                    return new DailyScanStatDto
                    {
                        Date = dateStr,
                        Allowed = dayLogs.Count(l => l.Action == "ALLOW"),
                        Phishing = dayLogs.Count(l => l.Label == "PHISHING"),
                        Adult = dayLogs.Count(l => l.Label == "ADULT")
                    };
                })
                .ToList();

            return Ok(new DashboardSummaryDto
            {
                TotalScans = total,
                AllowedCount = allowed,
                BlockedCount = blocked,
                PhishingDetected = phishing,
                AdultDetected = adult,
                ModelStatus = modelStatus,
                SecurityModelName = "Random Forest",
                AdultModelName = "Logistic Regression",
                SecurityThreshold = 0.4250m,
                AdultThreshold = 0.1400m,
                RecentScans = recent,
                DailyTrends = trends
            });
        }

        [HttpGet("recent-scans")]
        public async Task<ActionResult> GetRecentScans([FromQuery] int limit = 10)
        {
            int take = Math.Clamp(limit, 1, 50);
            var items = await _context.ScanLogs.AsNoTracking()
                .OrderByDescending(s => s.CreatedAt)
                .Take(take)
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
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();

            return Ok(items);
        }
    }
}

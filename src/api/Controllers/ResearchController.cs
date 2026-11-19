using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VnMurlSafeWeb.Api.Services;

namespace VnMurlSafeWeb.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResearchController : ControllerBase
    {
        private readonly IResearchService _researchService;

        public ResearchController(IResearchService researchService)
        {
            _researchService = researchService;
        }

        [HttpGet("summary")]
        public async Task<ActionResult> GetSummary()
        {
            var summary = await _researchService.GetSummaryAsync();
            return Ok(summary);
        }

        [HttpGet("models")]
        public async Task<ActionResult> GetModels()
        {
            var summary = await _researchService.GetSummaryAsync();
            return Ok(new
            {
                security_models = summary.SecurityModels,
                adult_models = summary.AdultModels
            });
        }

        [HttpGet("metrics/{filename}")]
        public async Task<ActionResult> GetMetrics(string filename)
        {
            var data = await _researchService.GetMetricsAsync(filename);
            return Ok(data);
        }

        [HttpGet("figures")]
        public async Task<ActionResult> GetFigures()
        {
            var figures = await _researchService.GetAvailableFiguresAsync();
            return Ok(figures);
        }

        [HttpGet("figures/{figureName}")]
        public async Task<IActionResult> GetFigureImage(string figureName)
        {
            string? path = await _researchService.GetFigurePathAsync(figureName);
            if (path == null || !System.IO.File.Exists(path))
            {
                return NotFound(new { error = "Figure not found" });
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(path);
            return File(bytes, "image/png");
        }

        [HttpGet("manifest")]
        public async Task<ActionResult> GetManifest()
        {
            var manifest = await _researchService.GetModelManifestAsync();
            if (manifest == null)
            {
                return NotFound(new { error = "Manifest not found" });
            }
            return Ok(manifest);
        }
    }
}

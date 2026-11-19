using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VnMurlSafeWeb.Api.DTOs;

namespace VnMurlSafeWeb.Api.Services
{
    public class AiPredictResult
    {
        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;

        [JsonPropertyName("label")]
        public string Label { get; set; } = "BENIGN";

        [JsonPropertyName("action")]
        public string Action { get; set; } = "ALLOW";

        [JsonPropertyName("confidence")]
        public decimal Confidence { get; set; }

        [JsonPropertyName("reason")]
        public string Reason { get; set; } = string.Empty;

        [JsonPropertyName("phishing_score")]
        public decimal PhishingScore { get; set; }

        [JsonPropertyName("adult_score")]
        public decimal AdultScore { get; set; }

        [JsonPropertyName("phishing_threshold")]
        public decimal PhishingThreshold { get; set; }

        [JsonPropertyName("adult_threshold")]
        public decimal AdultThreshold { get; set; }

        [JsonPropertyName("secondary_risk")]
        public string? SecondaryRisk { get; set; }

        [JsonPropertyName("xai")]
        public XaiExplanationDto? Xai { get; set; }
    }

    public class AiHealthResult
    {
        [JsonPropertyName("status")]
        public string Status { get; set; } = "unhealthy";

        [JsonPropertyName("model_loaded")]
        public bool ModelLoaded { get; set; }

        [JsonPropertyName("feature_count")]
        public int FeatureCount { get; set; }
    }

    public interface IAiClient
    {
        Task<AiPredictResult> PredictAsync(string url);
        Task<AiHealthResult> GetHealthAsync();
        Task<JsonElement?> GetModelInfoAsync();
    }

    public class AiClient : IAiClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AiClient> _logger;
        private readonly string _baseUrl;

        public AiClient(HttpClient httpClient, IConfiguration config, ILogger<AiClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _baseUrl = config["AiService:BaseUrl"] ?? "http://localhost:8000";
            _httpClient.BaseAddress = new Uri(_baseUrl);
            _httpClient.Timeout = TimeSpan.FromSeconds(15);
        }

        public async Task<AiPredictResult> PredictAsync(string url)
        {
            try
            {
                var payload = new { url = url.Trim() };
                var response = await _httpClient.PostAsJsonAsync("/predict", payload);
                response.EnsureSuccessStatusCode();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var result = await response.Content.ReadFromJsonAsync<AiPredictResult>(options);

                return result ?? new AiPredictResult
                {
                    Url = url,
                    Label = "BENIGN",
                    Action = "ALLOW",
                    Confidence = 0.5000m,
                    Reason = "Default fallback (empty response)"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to call AI Service for URL: {Url}", url);
                throw new ApplicationException($"AI Service prediction failed: {ex.Message}", ex);
            }
        }

        public async Task<AiHealthResult> GetHealthAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/health");
                if (response.IsSuccessStatusCode)
                {
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    return await response.Content.ReadFromJsonAsync<AiHealthResult>(options)
                           ?? new AiHealthResult { Status = "unhealthy", ModelLoaded = false };
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Failed to reach AI Service health check: {Message}", ex.Message);
            }

            return new AiHealthResult { Status = "offline", ModelLoaded = false };
        }

        public async Task<JsonElement?> GetModelInfoAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/model/info");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    return JsonDocument.Parse(json).RootElement.Clone();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Failed to fetch model info from AI Service: {Message}", ex.Message);
            }

            return null;
        }
    }
}

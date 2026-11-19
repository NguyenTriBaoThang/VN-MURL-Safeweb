using System;
using System.Collections.Generic;

namespace VnMurlSafeWeb.Api.DTOs
{
    // Scan DTOs
    public class ScanRequestDto
    {
        public string Url { get; set; } = string.Empty;
    }

    public class ScanResponseDto
    {
        public long Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public string Label { get; set; } = "BENIGN";
        public string Action { get; set; } = "ALLOW";
        public decimal Confidence { get; set; }
        public string Reason { get; set; } = string.Empty;
        public decimal PhishingScore { get; set; }
        public decimal AdultScore { get; set; }
        public decimal PhishingThreshold { get; set; }
        public decimal AdultThreshold { get; set; }
        public string? SecondaryRisk { get; set; }
        public string? UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public XaiExplanationDto? Xai { get; set; }
    }

    public class XaiFactorDto
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = "RISK";
        public string Severity { get; set; } = "MEDIUM";
        public string Evidence { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class XaiFeatureDto
    {
        public string Name { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public object? Value { get; set; }
        public string Benchmark { get; set; } = string.Empty;
        public string Status { get; set; } = "SAFE";
        public string Explanation { get; set; } = string.Empty;
    }

    public class XaiExplanationDto
    {
        public string Verdict { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public List<XaiFactorDto> Factors { get; set; } = new();
        public List<XaiFeatureDto> Features { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
    }

    public class ScanLogQueryDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? Label { get; set; }
        public string? Action { get; set; }
        public string? Search { get; set; }
        public bool? OnlyMine { get; set; }
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }

    // Dashboard DTOs
    public class DashboardSummaryDto
    {
        public int TotalScans { get; set; }
        public int AllowedCount { get; set; }
        public int BlockedCount { get; set; }
        public int PhishingDetected { get; set; }
        public int AdultDetected { get; set; }
        public string ModelStatus { get; set; } = "Operational";
        public string SecurityModelName { get; set; } = "Random Forest";
        public string AdultModelName { get; set; } = "Logistic Regression";
        public decimal SecurityThreshold { get; set; } = 0.4250m;
        public decimal AdultThreshold { get; set; } = 0.1400m;
        public List<DailyScanStatDto> DailyTrends { get; set; } = new();
        public List<ScanResponseDto> RecentScans { get; set; } = new();
    }

    public class DailyScanStatDto
    {
        public string Date { get; set; } = string.Empty;
        public int Allowed { get; set; }
        public int Phishing { get; set; }
        public int Adult { get; set; }
    }

    // Research DTOs
    public class ResearchSummaryDto
    {
        public string Title { get; set; } = "VN-MURL SafeWeb ML Research";
        public int TotalFeatureCount { get; set; } = 48;
        public int GoldDatasetSamples { get; set; } = 125000;
        public int ChildSafetyDatasetSamples { get; set; } = 105180;
        public List<ModelMetricRowDto> SecurityModels { get; set; } = new();
        public List<ModelMetricRowDto> AdultModels { get; set; } = new();
        public List<string> AvailableFigures { get; set; } = new();
    }

    public class ModelMetricRowDto
    {
        public string Model { get; set; } = string.Empty;
        public decimal Accuracy { get; set; }
        public decimal BalancedAccuracy { get; set; }
        public decimal Precision { get; set; }
        public decimal Recall { get; set; }
        public decimal Specificity { get; set; }
        public decimal F1 { get; set; }
        public decimal RocAuc { get; set; }
        public decimal PrAuc { get; set; }
        public decimal Mcc { get; set; }
        public decimal? Threshold { get; set; }
        public bool IsBest { get; set; }
    }

    // Settings DTOs
    public class SystemSettingsDto
    {
        public decimal PhishingThreshold { get; set; } = 0.4250m;
        public decimal AdultThreshold { get; set; } = 0.1400m;
        public bool StrictMode { get; set; } = true;
        public bool EnableAuditLogging { get; set; } = true;
        public string AiServiceEndpoint { get; set; } = "http://localhost:8000";
    }

    public class AllowListCreateDto
    {
        public string Pattern { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class BlockListCreateDto
    {
        public string Pattern { get; set; } = string.Empty;
        public string ThreatType { get; set; } = "PHISHING"; // PHISHING | ADULT
        public string Reason { get; set; } = string.Empty;
    }

    // Auth DTOs
    public class LoginRequestDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequestDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public DateTime ExpiresAt { get; set; }
    }

    public class UserReportDto
    {
        public string Url { get; set; } = string.Empty;
        public string ThreatType { get; set; } = "PHISHING"; // PHISHING, ADULT, MALWARE
        public string Reason { get; set; } = string.Empty;
    }

    public class UserSummaryDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; }
        public int ScanCount { get; set; }
    }
}

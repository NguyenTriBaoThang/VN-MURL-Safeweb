using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using VnMurlSafeWeb.Api.DTOs;

namespace VnMurlSafeWeb.Api.Services
{
    public interface IResearchService
    {
        Task<ResearchSummaryDto> GetSummaryAsync();
        Task<List<Dictionary<string, object>>> GetMetricsAsync(string filename);
        Task<List<string>> GetAvailableFiguresAsync();
        Task<string?> GetFigurePathAsync(string figureName);
        Task<JsonElement?> GetModelManifestAsync();
    }

    public class ResearchService : IResearchService
    {
        private readonly string _metricsDir;
        private readonly string _figuresDir;
        private readonly string _researchDir;
        private readonly ILogger<ResearchService> _logger;

        public ResearchService(IHostEnvironment env, ILogger<ResearchService> logger)
        {
            _logger = logger;

            // Search root directory for metrics and figures
            string root = Directory.GetCurrentDirectory();
            while (!Directory.Exists(Path.Combine(root, "metrics")) && Directory.GetParent(root) != null)
            {
                root = Directory.GetParent(root)!.FullName;
            }

            _metricsDir = Path.Combine(root, "metrics");
            _figuresDir = Path.Combine(root, "figures");
            _researchDir = Path.Combine(root, "research");

            _logger.LogInformation("ResearchService resolved root paths: metrics={M}, figures={F}", _metricsDir, _figuresDir);
        }

        public async Task<ResearchSummaryDto> GetSummaryAsync()
        {
            var summary = new ResearchSummaryDto
            {
                Title = "VN-MURL SafeWeb — Multi-Task URL Security & Child Safety ML Benchmark",
                TotalFeatureCount = 48,
                GoldDatasetSamples = 125000,
                ChildSafetyDatasetSamples = 105180,
                SecurityModels = await ParseModelMetricsCsvAsync(Path.Combine(_metricsDir, "baseline_natural_test_results.csv"), "Random Forest", 0.425m),
                AdultModels = await ParseModelMetricsCsvAsync(Path.Combine(_metricsDir, "adult_natural_test_results.csv"), "Logistic Regression", 0.140m),
                AvailableFigures = await GetAvailableFiguresAsync()
            };

            return summary;
        }

        public async Task<List<Dictionary<string, object>>> GetMetricsAsync(string filename)
        {
            string safeName = Path.GetFileName(filename);
            if (!safeName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            {
                safeName += ".csv";
            }

            string filePath = Path.Combine(_metricsDir, safeName);
            if (!File.Exists(filePath))
            {
                filePath = Path.Combine(_researchDir, safeName);
            }

            if (!File.Exists(filePath))
            {
                _logger.LogWarning("Requested metrics file not found: {File}", safeName);
                return new List<Dictionary<string, object>>();
            }

            return await ParseCsvToDictListAsync(filePath);
        }

        public Task<List<string>> GetAvailableFiguresAsync()
        {
            if (!Directory.Exists(_figuresDir))
            {
                return Task.FromResult(new List<string>());
            }

            var files = Directory.GetFiles(_figuresDir, "*.png")
                .Select(Path.GetFileName)
                .Where(f => !string.IsNullOrEmpty(f))
                .Select(f => f!)
                .OrderBy(f => f)
                .ToList();

            return Task.FromResult(files);
        }

        public Task<string?> GetFigurePathAsync(string figureName)
        {
            string safeName = Path.GetFileName(figureName);
            string fullPath = Path.Combine(_figuresDir, safeName);
            if (File.Exists(fullPath))
            {
                return Task.FromResult<string?>(fullPath);
            }
            return Task.FromResult<string?>(null);
        }

        public async Task<JsonElement?> GetModelManifestAsync()
        {
            string path = Path.Combine(_researchDir, "VN_MURL_SafeWeb_Final_Model_Metadata.json");
            if (File.Exists(path))
            {
                string text = await File.ReadAllTextAsync(path);
                return JsonDocument.Parse(text).RootElement.Clone();
            }
            return null;
        }

        private static async Task<List<ModelMetricRowDto>> ParseModelMetricsCsvAsync(string filePath, string bestModelName, decimal threshold)
        {
            var list = new List<ModelMetricRowDto>();
            if (!File.Exists(filePath)) return list;

            var rows = await ParseCsvToDictListAsync(filePath);
            foreach (var r in rows)
            {
                string model = r.GetValueOrDefault("model")?.ToString() ?? "";
                list.Add(new ModelMetricRowDto
                {
                    Model = model,
                    Accuracy = ToDecimal(r.GetValueOrDefault("accuracy")),
                    BalancedAccuracy = ToDecimal(r.GetValueOrDefault("balanced_accuracy")),
                    Precision = ToDecimal(r.GetValueOrDefault("precision")),
                    Recall = ToDecimal(r.GetValueOrDefault("recall")),
                    Specificity = ToDecimal(r.GetValueOrDefault("specificity")),
                    F1 = ToDecimal(r.GetValueOrDefault("f1")),
                    RocAuc = ToDecimal(r.GetValueOrDefault("roc_auc")),
                    PrAuc = ToDecimal(r.GetValueOrDefault("pr_auc")),
                    Mcc = ToDecimal(r.GetValueOrDefault("mcc")),
                    Threshold = threshold,
                    IsBest = string.Equals(model, bestModelName, StringComparison.OrdinalIgnoreCase)
                });
            }

            return list;
        }

        private static async Task<List<Dictionary<string, object>>> ParseCsvToDictListAsync(string filePath)
        {
            var result = new List<Dictionary<string, object>>();
            using var reader = new StreamReader(filePath);

            string? headerLine = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(headerLine)) return result;

            string[] headers = headerLine.Split(',').Select(h => h.Trim().Trim('"')).ToArray();

            string? line;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                if (string.IsNullOrWhiteSpace(line)) continue;
                string[] parts = SplitCsvLine(line);
                var row = new Dictionary<string, object>();

                for (int i = 0; i < headers.Length && i < parts.Length; i++)
                {
                    string val = parts[i].Trim().Trim('"');
                    if (decimal.TryParse(val, NumberStyles.Any, CultureInfo.InvariantCulture, out var d))
                    {
                        row[headers[i]] = d;
                    }
                    else
                    {
                        row[headers[i]] = val;
                    }
                }
                result.Add(row);
            }

            return result;
        }

        private static string[] SplitCsvLine(string line)
        {
            var parts = new List<string>();
            bool inQuotes = false;
            int start = 0;

            for (int i = 0; i < line.Length; i++)
            {
                if (line[i] == '"') inQuotes = !inQuotes;
                else if (line[i] == ',' && !inQuotes)
                {
                    parts.Add(line.Substring(start, i - start));
                    start = i + 1;
                }
            }
            parts.Add(line.Substring(start));
            return parts.ToArray();
        }

        private static decimal ToDecimal(object? obj)
        {
            if (obj is decimal d) return d;
            if (obj == null) return 0.0m;
            if (decimal.TryParse(obj.ToString(), NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed))
            {
                return parsed;
            }
            return 0.0m;
        }
    }
}

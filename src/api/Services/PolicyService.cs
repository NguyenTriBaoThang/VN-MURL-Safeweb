using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VnMurlSafeWeb.Api.Data;
using VnMurlSafeWeb.Api.Models;

namespace VnMurlSafeWeb.Api.Services
{
    public class PolicyMatchResult
    {
        public bool IsMatched { get; set; }
        public string Label { get; set; } = "BENIGN";
        public string Action { get; set; } = "ALLOW";
        public string Reason { get; set; } = string.Empty;
        public decimal Confidence { get; set; } = 1.0m;
    }

    public interface IPolicyService
    {
        Task<PolicyMatchResult?> CheckPolicyAsync(string url);
    }

    public class PolicyService : IPolicyService
    {
        private readonly AppDbContext _context;

        public PolicyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PolicyMatchResult?> CheckPolicyAsync(string url)
        {
            string host = ExtractHost(url);

            // 1. Check AllowList first
            var allowItems = await _context.AllowList.AsNoTracking().ToListAsync();
            foreach (var item in allowItems)
            {
                if (MatchesPattern(host, url, item.Pattern))
                {
                    return new PolicyMatchResult
                    {
                        IsMatched = true,
                        Label = "BENIGN",
                        Action = "ALLOW",
                        Reason = $"Allowed by policy rule: '{item.Pattern}' ({item.Description})",
                        Confidence = 1.0m
                    };
                }
            }

            // 2. Check BlockList
            var blockItems = await _context.BlockList.AsNoTracking().ToListAsync();
            foreach (var item in blockItems)
            {
                if (MatchesPattern(host, url, item.Pattern))
                {
                    return new PolicyMatchResult
                    {
                        IsMatched = true,
                        Label = item.ThreatType.ToUpperInvariant(), // PHISHING or ADULT
                        Action = "BLOCK",
                        Reason = $"Blocked by policy rule: '{item.Pattern}' ({item.Reason})",
                        Confidence = 1.0m
                    };
                }
            }

            return null; // No static policy matched, proceed to AI prediction
        }

        private static string ExtractHost(string url)
        {
            try
            {
                string target = url.Contains("://") ? url : "http://" + url;
                return new Uri(target).Host.ToLowerInvariant().Trim();
            }
            catch
            {
                return url.ToLowerInvariant().Trim();
            }
        }

        private static bool MatchesPattern(string host, string fullUrl, string pattern)
        {
            string p = pattern.Trim().ToLowerInvariant();
            if (string.IsNullOrEmpty(p)) return false;

            if (p.StartsWith("*."))
            {
                string root = p.Substring(2);
                return host == root || host.EndsWith("." + root);
            }

            if (p.EndsWith("*"))
            {
                string prefix = p.Substring(0, p.Length - 1);
                return host.StartsWith(prefix) || fullUrl.ToLowerInvariant().StartsWith(prefix);
            }

            return host == p || fullUrl.ToLowerInvariant().Contains(p);
        }
    }
}

using System;
using System.Linq;
using VnMurlSafeWeb.Api.Models;

namespace VnMurlSafeWeb.Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            // Seed Admin & User Accounts
            var adminUser = context.Users.FirstOrDefault(u => u.Username.ToLower() == "admin");
            if (adminUser == null)
            {
                adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };
                context.Users.Add(adminUser);
            }
            else
            {
                adminUser.Role = "Admin";
                adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
            }

            var standardUser = context.Users.FirstOrDefault(u => u.Username.ToLower() == "user");
            if (standardUser == null)
            {
                standardUser = new User
                {
                    Id = Guid.NewGuid(),
                    Username = "user",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
                    Role = "User",
                    CreatedAt = DateTime.UtcNow
                };
                context.Users.Add(standardUser);
            }
            else
            {
                standardUser.Role = "User";
                standardUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123");
            }

            // Seed Settings
            if (!context.Settings.Any())
            {
                context.Settings.AddRange(
                    new Setting
                    {
                        Key = "PhishingThreshold",
                        Value = "0.4250",
                        Description = "Validation-optimized threshold for phishing detection",
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Setting
                    {
                        Key = "AdultThreshold",
                        Value = "0.1400",
                        Description = "Validation-optimized threshold for adult content detection",
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Setting
                    {
                        Key = "StrictMode",
                        Value = "true",
                        Description = "Enforce strict priority blocking for child safety",
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Setting
                    {
                        Key = "AiServiceEndpoint",
                        Value = "http://localhost:8000",
                        Description = "Internal URL of the Python FastAPI prediction engine",
                        UpdatedAt = DateTime.UtcNow
                    }
                );
            }

            // Seed default Allowlist
            if (!context.AllowList.Any())
            {
                context.AllowList.AddRange(
                    new AllowList { Pattern = "*.chinhphu.vn", Description = "Cổng thông tin điện tử Chính phủ", CreatedBy = "System" },
                    new AllowList { Pattern = "*.gov.vn", Description = "Hệ thống cơ quan nhà nước Việt Nam", CreatedBy = "System" },
                    new AllowList { Pattern = "*.edu.vn", Description = "Hệ thống giáo dục và đào tạo", CreatedBy = "System" },
                    new AllowList { Pattern = "vnexpress.net", Description = "Báo điện tử VnExpress", CreatedBy = "System" },
                    new AllowList { Pattern = "tuoitre.vn", Description = "Báo Tuổi Trẻ", CreatedBy = "System" }
                );
            }

            // Seed default Blocklist
            if (!context.BlockList.Any())
            {
                context.BlockList.AddRange(
                    new BlockList { Pattern = "*.reerenn8.top", ThreatType = "PHISHING", Reason = "Phishing domain campaign", CreatedBy = "System" },
                    new BlockList { Pattern = "*khuyenmai.space", ThreatType = "PHISHING", Reason = "Phishing lottery scam", CreatedBy = "System" }
                );
            }

            // Seed sample scan logs if empty
            if (!context.ScanLogs.Any())
            {
                var now = DateTime.UtcNow;
                context.ScanLogs.AddRange(
                    new ScanLog
                    {
                        Url = "https://chinhphu.vn",
                        Label = "BENIGN",
                        Action = "ALLOW",
                        Confidence = 0.9850m,
                        PhishingScore = 0.0150m,
                        AdultScore = 0.0005m,
                        Reason = "No phishing or adult risk detected",
                        CreatedAt = now.AddHours(-1)
                    },
                    new ScanLog
                    {
                        Url = "http://secure-login-vietcombank-update-otp.top/bank/verify",
                        Label = "PHISHING",
                        Action = "BLOCK",
                        Confidence = 0.9740m,
                        PhishingScore = 0.9740m,
                        AdultScore = 0.0020m,
                        Reason = "Phishing URL detected",
                        CreatedAt = now.AddMinutes(-35)
                    },
                    new ScanLog
                    {
                        Url = "http://pornhub.com",
                        Label = "ADULT",
                        Action = "BLOCK",
                        Confidence = 0.9995m,
                        PhishingScore = 0.0210m,
                        AdultScore = 0.9995m,
                        Reason = "Adult content detected",
                        CreatedAt = now.AddMinutes(-12)
                    },
                    new ScanLog
                    {
                        Url = "https://vnexpress.net/thoi-su",
                        Label = "BENIGN",
                        Action = "ALLOW",
                        Confidence = 0.9920m,
                        PhishingScore = 0.0080m,
                        AdultScore = 0.0001m,
                        Reason = "No phishing or adult risk detected",
                        CreatedAt = now.AddMinutes(-2)
                    }
                );
            }

            context.SaveChanges();
        }
    }
}

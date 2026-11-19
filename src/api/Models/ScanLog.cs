using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VnMurlSafeWeb.Api.Models
{
    public class ScanLog
    {
        [Key]
        public long Id { get; set; }

        public string? UserId { get; set; }

        [Required]
        [MaxLength(2048)]
        public string Url { get; set; } = string.Empty;

        [Required]
        [MaxLength(32)]
        public string Label { get; set; } = "BENIGN"; // BENIGN, PHISHING, ADULT

        [Required]
        [MaxLength(16)]
        public string Action { get; set; } = "ALLOW"; // ALLOW, BLOCK

        [Column(TypeName = "decimal(6,4)")]
        public decimal Confidence { get; set; }

        [Column(TypeName = "decimal(6,4)")]
        public decimal PhishingScore { get; set; }

        [Column(TypeName = "decimal(6,4)")]
        public decimal AdultScore { get; set; }

        [MaxLength(512)]
        public string Reason { get; set; } = string.Empty;

        [MaxLength(32)]
        public string? SecondaryRisk { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

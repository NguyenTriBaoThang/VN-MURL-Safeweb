using System;
using System.ComponentModel.DataAnnotations;

namespace VnMurlSafeWeb.Api.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(64)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(32)]
        public string Role { get; set; } = "User"; // Admin, User

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Setting
    {
        [Key]
        [MaxLength(64)]
        public string Key { get; set; } = string.Empty;

        [Required]
        [MaxLength(2048)]
        public string Value { get; set; } = string.Empty;

        [MaxLength(512)]
        public string Description { get; set; } = string.Empty;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class AllowList
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(512)]
        public string Pattern { get; set; } = string.Empty;

        [MaxLength(256)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(64)]
        public string CreatedBy { get; set; } = "System";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class BlockList
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(512)]
        public string Pattern { get; set; } = string.Empty;

        [Required]
        [MaxLength(32)]
        public string ThreatType { get; set; } = "PHISHING"; // PHISHING, ADULT

        [MaxLength(256)]
        public string Reason { get; set; } = string.Empty;

        [MaxLength(64)]
        public string CreatedBy { get; set; } = "System";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

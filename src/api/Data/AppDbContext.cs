using Microsoft.EntityFrameworkCore;
using VnMurlSafeWeb.Api.Models;

namespace VnMurlSafeWeb.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ScanLog> ScanLogs => Set<ScanLog>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Setting> Settings => Set<Setting>();
        public DbSet<AllowList> AllowList => Set<AllowList>();
        public DbSet<BlockList> BlockList => Set<BlockList>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ScanLog>(entity =>
            {
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.Label);
                entity.HasIndex(e => e.Action);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
            });

            modelBuilder.Entity<AllowList>(entity =>
            {
                entity.HasIndex(e => e.Pattern);
            });

            modelBuilder.Entity<BlockList>(entity =>
            {
                entity.HasIndex(e => e.Pattern);
            });
        }
    }
}

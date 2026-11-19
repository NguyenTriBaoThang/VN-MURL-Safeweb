using System;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using VnMurlSafeWeb.Api.Data;
using VnMurlSafeWeb.Api.Middlewares;
using VnMurlSafeWeb.Api.Security;
using VnMurlSafeWeb.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers & JSON Options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// 2. Database Context (SQL Server with SQLite fallback for local development)
var sqlServerConn = builder.Configuration.GetConnectionString("DefaultConnection");
var sqliteConn = builder.Configuration.GetConnectionString("SqliteConnection") ?? "Data Source=vnmurl_safeweb.db";

// Use SQLite if SQL Server connection fails or environment prefers SQLite
bool useSqlite = builder.Configuration.GetValue<bool>("UseSqlite") || string.IsNullOrEmpty(sqlServerConn);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (useSqlite)
    {
        options.UseSqlite(sqliteConn);
    }
    else
    {
        try
        {
            options.UseSqlServer(sqlServerConn, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorNumbersToAdd: null);
            });
        }
        catch
        {
            options.UseSqlite(sqliteConn);
        }
    }
});

// 3. JWT Authentication
var jwtSecret = builder.Configuration["Jwt:SecretKey"] ?? "VN_MURL_SafeWeb_Super_Secret_Key_For_JWT_2026_Minimum_32_Chars";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "VN_MURL_SafeWeb";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "VN_MURL_SafeWeb_Clients";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// 4. Rate Limiting (Fixed Window: 100 requests per minute per IP)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var clientIp = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 120,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            });
    });
});

// 5. CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebAndExtension", policy =>
    {
        policy.SetIsOriginAllowed(_ => true) // Allow Chrome extension and local dev
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 6. Application Services
builder.Services.AddHttpClient<IAiClient, AiClient>();
builder.Services.AddScoped<IPolicyService, PolicyService>();
builder.Services.AddSingleton<IResearchService, ResearchService>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

// 7. Swagger / OpenAPI Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 8. Database Migration & Seed
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        DbInitializer.Initialize(context);
        logger.LogInformation("Database initialized and seeded successfully.");
    }
    catch (Exception ex)
    {
        logger.LogWarning("SQL Server not available ({Msg}). Switching to SQLite fallback.", ex.Message);
        // Fallback to SQLite
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlite(sqliteConn);
        using var fallbackContext = new AppDbContext(optionsBuilder.Options);
        DbInitializer.Initialize(fallbackContext);
        logger.LogInformation("SQLite fallback database initialized successfully.");
    }
}

// 9. Middleware Pipeline
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "VN-MURL SafeWeb API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowWebAndExtension");
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

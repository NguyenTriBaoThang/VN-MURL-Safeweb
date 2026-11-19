using System;
using System.Net;
using System.Text.RegularExpressions;

namespace VnMurlSafeWeb.Api.Security
{
    public static class PrivateNetworkValidator
    {
        public static bool IsPrivateOrLocalUrl(string url, out string? errorMessage)
        {
            errorMessage = null;

            if (string.IsNullOrWhiteSpace(url))
            {
                errorMessage = "URL cannot be empty.";
                return true;
            }

            string clean = url.Trim();
            if (!clean.Contains("://"))
            {
                clean = "http://" + clean;
            }

            if (!Uri.TryCreate(clean, UriKind.Absolute, out var uri))
            {
                errorMessage = "Invalid URL format.";
                return true;
            }

            string host = uri.Host.ToLowerInvariant().Trim();

            // Localhost and loopback
            if (host == "localhost" || host == "127.0.0.1" || host == "::1" || host.EndsWith(".local"))
            {
                errorMessage = "Scanning internal/localhost domains is strictly prohibited.";
                return true;
            }

            // IP Address validation
            if (IPAddress.TryParse(host, out var ip))
            {
                if (IPAddress.IsLoopback(ip))
                {
                    errorMessage = "Scanning loopback addresses (127.0.0.0/8, ::1) is prohibited.";
                    return true;
                }

                byte[] bytes = ip.GetAddressBytes();

                if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    // 10.0.0.0/8
                    if (bytes[0] == 10)
                    {
                        errorMessage = "Scanning private IP range 10.0.0.0/8 is prohibited.";
                        return true;
                    }
                    // 172.16.0.0/12 (172.16 - 172.31)
                    if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31)
                    {
                        errorMessage = "Scanning private IP range 172.16.0.0/12 is prohibited.";
                        return true;
                    }
                    // 192.168.0.0/16
                    if (bytes[0] == 192 && bytes[1] == 168)
                    {
                        errorMessage = "Scanning private IP range 192.168.0.0/16 is prohibited.";
                        return true;
                    }
                    // 169.254.0.0/16 (link local)
                    if (bytes[0] == 169 && bytes[1] == 254)
                    {
                        errorMessage = "Scanning link-local IP range 169.254.0.0/16 is prohibited.";
                        return true;
                    }
                }
            }

            return false;
        }
    }
}

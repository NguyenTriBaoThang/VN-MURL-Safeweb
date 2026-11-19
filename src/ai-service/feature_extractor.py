"""
VN-MURL SafeWeb — Feature Extractor
Extracts 48 lexical features strictly from URL string without requesting the website.
Exact match to VN_MURL_ML_Research_Colab_FINAL_3_LABELS notebook.
"""

import re
import math
import ipaddress
from collections import Counter
from typing import Dict, Any, Tuple
from urllib.parse import urlsplit, parse_qsl, unquote
import tldextract

# 35 Suspicious keywords from training notebook
SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "verification", "secure", "account", "update", "confirm",
    "password", "otp", "bank", "payment", "wallet", "bonus", "gift", "claim", "unlock",
    "support", "customer", "service", "transaction", "withdraw", "deposit", "refund",
    "prize", "voucher", "khuyenmai", "dangnhap", "xacminh", "taikhoan", "matkhau",
    "nganhang", "uudai", "napthe", "thanhtoan"
]

# URL Shorteners
SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "cutt.ly", "rebrand.ly",
    "is.gd", "ow.ly", "buff.ly", "shorturl.at"
}

# Suspicious TLD heuristics
SUSPICIOUS_TLDS = {
    "top", "xyz", "click", "link", "work", "support", "live", "shop", "online", "site",
    "info", "vip", "cc", "tk", "ml", "ga", "cf", "gq", "buzz", "rest", "fit"
}

# Offline PSL snapshot (no network call)
_TLD_EXTRACTOR = tldextract.TLDExtract(suffix_list_urls=None)


def shannon_entropy(text: str) -> float:
    """Calculates Shannon entropy of input string."""
    if not text:
        return 0.0
    counts = Counter(text)
    n = len(text)
    return -sum((c / n) * math.log2(c / n) for c in counts.values())


def longest_run(text: str, pattern: str) -> int:
    """Finds longest consecutive run matching regex pattern."""
    matches = re.findall(pattern, text)
    return max((len(x) for x in matches), default=0)


def safe_parse_url(url: str) -> Tuple[str, Any, str, bool]:
    """Safely normalizes and splits URL into components."""
    s = str(url).strip()
    has_scheme = bool(re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", s))
    parse_target = s if has_scheme else "http://" + s.lstrip("/")
    parsed = urlsplit(parse_target)
    host = (parsed.hostname or "").lower().strip(".")
    return s, parsed, host, has_scheme


def public_suffix_parts(host: str) -> Tuple[str, str, str]:
    """Extracts subdomain, registrable domain, and public suffix."""
    host_clean = (host or "").replace("*.", "").lower().strip(".")
    ext = _TLD_EXTRACTOR(host_clean)
    suffix = (ext.suffix or "").lower()
    registered = ".".join([x for x in [ext.domain, ext.suffix] if x]).lower()
    subdomain = (ext.subdomain or "").lower()
    return subdomain, registered, suffix


def extract_url_features(url: str) -> Dict[str, Any]:
    """
    Extracts exactly 48 lexical features from URL string.
    No network requests, no HTML fetching, no SSRF vulnerability.
    """
    s, parsed, host, has_scheme = safe_parse_url(url)

    path = parsed.path or ""
    query = parsed.query or ""
    fragment = parsed.fragment or ""
    decoded = unquote(s.lower())
    host_clean = host.replace("*.", "")

    try:
        ipaddress.ip_address(host_clean)
        has_ip = 1
    except Exception:
        has_ip = 0

    labels = [x for x in host_clean.split(".") if x]
    subdomain, registered_domain, public_suffix = public_suffix_parts(host_clean)

    if has_ip:
        num_subdomains = 0
        tld_value = ""
    else:
        num_subdomains = len([x for x in subdomain.split(".") if x])
        tld_value = public_suffix

    n = len(s)
    num_digits = sum(ch.isdigit() for ch in s)
    num_letters = sum(ch.isalpha() for ch in s)
    num_special = sum(not ch.isalnum() for ch in s)
    host_digits = sum(ch.isdigit() for ch in host_clean)

    tokens = [token for token in re.split(r"[^a-zA-Z0-9]+", decoded) if token]

    suspicious_count = sum(decoded.count(keyword) for keyword in SUSPICIOUS_KEYWORDS)

    try:
        explicit_port = int(parsed.port is not None)
    except ValueError:
        explicit_port = 1

    rest_after_scheme = s.split("://", 1)[1] if "://" in s else s
    has_double_slash_path = int("//" in rest_after_scheme)

    suffix_last = tld_value.split(".")[-1] if tld_value else ""

    features: Dict[str, Any] = {
        # Length features (5)
        "url_length": float(n),
        "hostname_length": float(len(host)),
        "path_length": float(len(path)),
        "query_length": float(len(query)),
        "fragment_length": float(len(fragment)),

        # Character features (15)
        "num_dots": float(s.count(".")),
        "num_hyphens": float(s.count("-")),
        "num_underscores": float(s.count("_")),
        "num_slashes": float(s.count("/")),
        "num_question_marks": float(s.count("?")),
        "num_equals": float(s.count("=")),
        "num_at": float(s.count("@")),
        "num_ampersand": float(s.count("&")),
        "num_percent": float(s.count("%")),
        "num_digits": float(num_digits),
        "num_letters": float(num_letters),
        "num_special_chars": float(num_special),
        "digit_ratio": float(num_digits / max(n, 1)),
        "letter_ratio": float(num_letters / max(n, 1)),
        "special_char_ratio": float(num_special / max(n, 1)),

        # Host structure features (15)
        "num_subdomains": float(num_subdomains),
        "host_label_count": float(len(labels)),
        "has_ip_address": float(has_ip),
        "has_https": float(int(parsed.scheme.lower() == "https")),
        "scheme_missing": float(int(not has_scheme)),
        "has_explicit_port": float(explicit_port),
        "num_query_params": float(len(parse_qsl(query, keep_blank_values=True))),
        "has_punycode": float(int("xn--" in host)),
        "has_www": float(int(host.startswith("www."))),
        "has_wildcard_host": float(int(host.startswith("*."))),
        "has_double_slash_path": float(has_double_slash_path),
        "tld_length": float(len(tld_value)),
        "domain_digit_ratio": float(host_digits / max(len(host_clean), 1)),
        "domain_hyphen_count": float(host_clean.count("-")),
        "path_depth": float(len([x for x in path.split("/") if x])),

        # Statistical features (9)
        "url_entropy": float(shannon_entropy(s.lower())),
        "hostname_entropy": float(shannon_entropy(host_clean)),
        "path_entropy": float(shannon_entropy(path.lower())),
        "num_tokens": float(len(tokens)),
        "max_token_length": float(max((len(x) for x in tokens), default=0)),
        "avg_token_length": float(sum(len(x) for x in tokens) / len(tokens) if tokens else 0.0),
        "longest_digit_run": float(longest_run(s, r"\d+")),
        "longest_alpha_run": float(longest_run(s.lower(), r"[a-z]+")),
        "non_ascii_count": float(sum(ord(ch) > 127 for ch in s)),

        # Heuristic features (4)
        "suspicious_keyword_count": float(suspicious_count),
        "has_suspicious_keyword": float(int(suspicious_count > 0)),
        "is_url_shortener": float(int(host_clean in SHORTENER_DOMAINS or registered_domain in SHORTENER_DOMAINS)),
        "is_suspicious_tld": float(int(suffix_last in SUSPICIOUS_TLDS)),
    }

    return features

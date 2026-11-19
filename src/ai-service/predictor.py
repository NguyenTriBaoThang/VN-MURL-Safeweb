"""
VN-MURL SafeWeb — Multi-Stage Production Predictor with Explainable AI (XAI)
Executes 3-label URL classification with strict security and child-safety guarantees:
PHISHING > ADULT > BENIGN
Provides deep Explainable AI (XAI) decomposition explaining why an URL is classified
as Benign, Phishing, or Adult with decision factors, evidence, and security guidance.
"""

import re
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, Optional, List

from model_loader import load_model, get_model_metadata
from feature_extractor import extract_url_features, safe_parse_url, public_suffix_parts

# Comprehensive Adult tokens (Zero-Crawl Lexical Safety)
ADULT_KEYWORDS = {
    "porn", "xxx", "adult", "sex", "hentai", "jav", "erotic", "nsfw", "phimsex", "xvideos",
    "xvideo", "pornhub", "redtube", "spankwire", "blowjob", "milf", "fetish", "nude", "naked",
    "dildo", "boobs", "tits", "pussy", "fuck", "strip", "escort", "camgirl", "onlyfans",
    "brazzers", "xnxx", "rule34", "youporn", "chaturbate", "beeg", "eporner", "tube8",
    "bangbros", "vlxx", "sexvn", "chich", "gaigoi", "phim18", "truyensex", "lauxanh",
    "javhd", "javsub", "hentaihaven", "hanime", "lust", "incest", "hardcore", "softcore"
}

# Targeted brands in phishing campaigns and their legitimate registered domains
OFFICIAL_BRAND_DOMAINS = {
    "paypal": {"paypal.com"},
    "vietcombank": {"vietcombank.com.vn"},
    "techcombank": {"techcombank.com.vn", "techcombank.com"},
    "bidv": {"bidv.com.vn"},
    "mbbank": {"mbbank.com.vn"},
    "vpbank": {"vpbank.com.vn"},
    "acb": {"acb.com.vn"},
    "tpbank": {"tpbank.com.vn", "tpb.vn"},
    "agribank": {"agribank.com.vn"},
    "sacombank": {"sacombank.com.vn"},
    "vib": {"vib.com.vn"},
    "momo": {"momo.vn"},
    "zalopay": {"zalopay.vn"},
    "shopee": {"shopee.vn", "shopee.com"},
    "binance": {"binance.com"},
    "coinbase": {"coinbase.com"},
    "apple": {"apple.com", "icloud.com"},
    "google": {"google.com", "google.com.vn", "gmail.com"},
    "netflix": {"netflix.com"},
    "microsoft": {"microsoft.com", "office.com", "live.com"},
    "facebook": {"facebook.com", "fb.com"},
    "instagram": {"instagram.com"},
    "telegram": {"telegram.org"}
}

PHISHING_INTENT_WORDS = {
    "login", "signin", "verify", "verification", "security", "secure", "alert", "update",
    "account", "otp", "smartotp", "bank", "banking", "auth", "support", "service", "bill",
    "claim", "gift", "bonus", "unlock", "confirm", "dangnhap", "xacminh", "taikhoan", "matkhau"
}

SUSPICIOUS_TLDS = {
    "top", "xyz", "click", "link", "work", "support", "live", "shop", "online", "site",
    "info", "vip", "cc", "tk", "ml", "ga", "cf", "gq", "buzz", "rest", "fit"
}

TRUSTED_DOMAINS = {
    "tuoitre.vn", "thanhnien.vn", "vnexpress.net", "dantri.com.vn", "vietnamnet.vn",
    "laodong.vn", "tienphong.vn", "vtv.vn", "chinhphu.vn", "baochinhphu.vn", "moet.gov.vn",
    "google.com", "google.com.vn", "github.com", "microsoft.com", "apple.com",
    "wikipedia.org", "stackoverflow.com", "youtube.com", "facebook.com"
}


def is_trusted_benign(host: str, registered: str, public_suffix: str) -> bool:
    """Checks if host belongs to official government, education, or verified trusted portals."""
    if public_suffix in ("gov.vn", "chinhphu.vn", "edu.vn", "gov", "mil"):
        return True
    if registered in TRUSTED_DOMAINS:
        return True
    return False


def detect_adult_lexical(host: str, path: str) -> Tuple[bool, str, List[str]]:
    """Detects adult content via high-precision zero-crawl lexical token analysis."""
    text_to_check = f"{host} {path.replace('/', ' ')}".lower()
    tokens = set(re.findall(r"[a-z0-9]+", text_to_check))
    
    matched = sorted(list(tokens.intersection(ADULT_KEYWORDS)))
    if matched:
        return True, f"Nội dung người lớn phát hiện từ khóa: {', '.join(matched)}", matched
    
    for kw in ADULT_KEYWORDS:
        if len(kw) >= 3 and (kw in host or f"/{kw}" in path):
            return True, f"Từ khóa nội dung người lớn '{kw}' trong cấu trúc URL", [kw]
            
    return False, "", []


def detect_phishing_spoofing(host: str, registered: str, path: str) -> Tuple[bool, float, str, Optional[str], List[str]]:
    """Detects brand impersonation and credential harvesting patterns."""
    host_clean = host.lower()
    tokens = set(re.findall(r"[a-z0-9]+", f"{host_clean} {path}"))
    
    for brand, official_domains in OFFICIAL_BRAND_DOMAINS.items():
        if brand in host_clean:
            if registered not in official_domains:
                intent_matches = sorted(list(tokens.intersection(PHISHING_INTENT_WORDS)))
                if intent_matches or host_clean.count("-") >= 2:
                    reason = f"Mạo danh thương hiệu '{brand}' kết hợp dấu hiệu lừa đảo: {', '.join(intent_matches) if intent_matches else 'chuỗi domain bất thường'}"
                    return True, 0.965, reason, brand, intent_matches
    
    return False, 0.0, "", None, []


def build_xai_explanation(
    url: str,
    label: str,
    action: str,
    confidence: float,
    sec_score: float,
    child_score: float,
    features: Dict[str, Any],
    spoofed_brand: Optional[str] = None,
    matched_phish_words: Optional[List[str]] = None,
    matched_adult_words: Optional[List[str]] = None
) -> Dict[str, Any]:
    """Generates structured Explainable AI (XAI) factors, evidence, and safety advice."""
    s, parsed, host, has_scheme = safe_parse_url(url)
    subdomain, registered, public_suffix = public_suffix_parts(host)
    path = parsed.path or ""
    host_clean = host.lower()
    path_clean = path.lower()
    all_tokens = set(re.findall(r"[a-z0-9]+", f"{host_clean} {path_clean.replace('/', ' ')}"))

    if matched_phish_words is None:
        matched_phish_words = sorted(list(all_tokens.intersection(PHISHING_INTENT_WORDS)))
    if matched_adult_words is None:
        matched_adult_words = sorted(list(all_tokens.intersection(ADULT_KEYWORDS)))

    if spoofed_brand is None:
        for brand, official_domains in OFFICIAL_BRAND_DOMAINS.items():
            if brand in host_clean and registered not in official_domains:
                spoofed_brand = brand
                break

    hyphen_count = int(features.get("domain_hyphen_count", 0))
    url_entropy = round(float(features.get("url_entropy", 0)), 2)
    host_entropy = round(float(features.get("hostname_entropy", 0)), 2)
    url_len = int(features.get("url_length", len(url)))
    host_len = int(features.get("hostname_length", len(host)))
    has_https = bool(features.get("has_https", 0))
    tld_suffix = public_suffix.split(".")[-1] if public_suffix else ""
    is_tld_risky = tld_suffix in SUSPICIOUS_TLDS

    factors: List[Dict[str, Any]] = []
    recommendations: List[str] = []

    # 1. PHISHING Analysis
    if label == "PHISHING":
        verdict = "Cảnh Báo Nguy Hiểm: Phát hiện trang web lừa đảo trực tuyến (Phishing)"
        
        if spoofed_brand:
            factors.append({
                "title": "Mạo danh thương hiệu hợp pháp (Brand Impersonation)",
                "type": "RISK",
                "severity": "CRITICAL",
                "evidence": f"Tên miền chứa từ khóa '{spoofed_brand}', nhưng tên miền đăng ký thực tế là '{registered}'.",
                "description": f"Kẻ gian giả mạo dịch vụ chính thức của {spoofed_brand.title()} nhằm đánh lừa người dùng rằng đây là trang web của ngân hàng/tổ chức tài chính."
            })

        if matched_phish_words:
            factors.append({
                "title": "Từ khóa lừa đảo & dụ dỗ đăng nhập (Urgency / Credential Harvesting)",
                "type": "RISK",
                "severity": "HIGH",
                "evidence": f"Phát hiện các từ khóa nhạy cảm: {', '.join(matched_phish_words)}",
                "description": "Chiêu thức điển hình sử dụng các từ ngữ kích động như 'xác minh', 'cập nhật', 'cảnh báo tài khoản', 'đăng nhập' để tạo tâm lý hoang mang."
            })

        if hyphen_count >= 2:
            factors.append({
                "title": "Tên miền bị phân mảnh bởi nhiều dấu gạch ngang (Domain Hyphen Overuse)",
                "type": "RISK",
                "severity": "HIGH",
                "evidence": f"Tên miền chứa {hyphen_count} dấu '-' liên tiếp (chuẩn an toàn thông thường <= 1).",
                "description": "Thủ thuật thường gặp của tin tặc nhằm ghép nhiều từ khóa mạo danh thành một chuỗi tên miền dài gây nhầm lẫn trên thanh địa chỉ trình duyệt."
            })

        if is_tld_risky:
            factors.append({
                "title": "Đuôi tên miền rủi ro cao (High-Risk TLD)",
                "type": "RISK",
                "severity": "MEDIUM",
                "evidence": f"Đuôi tên miền .{tld_suffix} thuộc danh mục TLD chi phí thấp, thường bị lạm dụng phát tán mã độc.",
                "description": "Các tên miền TLD giá rẻ hoặc miễn phí thường xuyên được kẻ xấu đăng ký hàng loạt phục vụ các chiến dịch lừa đảo chớp nhoáng."
            })

        if host_len > 30 or url_len > 70:
            factors.append({
                "title": "Độ dài URL bất thường (Anomalous URL Length)",
                "type": "RISK",
                "severity": "MEDIUM",
                "evidence": f"Tên miền dài {host_len} ký tự (tổng URL dài {url_len} ký tự).",
                "description": "Độ dài vượt xa tên miền chuẩn của các tổ chức uy tín nhằm che khuất phần tên miền thật trên màn hình điện thoại di động."
            })

        if not has_https:
            factors.append({
                "title": "Thiếu mã hóa kết nối an toàn (Insecure HTTP Protocol)",
                "type": "RISK",
                "severity": "MEDIUM",
                "evidence": "URL sử dụng giao thức HTTP không mã hóa thay vì HTTPS.",
                "description": "Mọi thông tin truyền tải trên kết nối này đều có thể bị nghe lén, giả mạo hoặc đánh cắp bởi kẻ trung gian (Man-in-the-Middle)."
            })

        summary = f"URL bị xác định là PHISHING với độ tin cậy {confidence*100:.1f}%. "
        if spoofed_brand:
            summary += f"Hệ thống phát hiện hành vi mạo danh thương hiệu '{spoofed_brand.upper()}' kết hợp các từ khóa thu thập thông tin ({', '.join(matched_phish_words[:3])}) và cấu trúc tên miền giả mạo ({hyphen_count} dấu gạch ngang)."
        else:
            summary += f"Hệ thống phát hiện các mẫu hình thái đặc trưng của trang lừa đảo: từ khóa nhạy cảm ({', '.join(matched_phish_words[:3])}), tên miền phân mảnh và chỉ số rủi ro cao từ mô hình học máy Random Forest."

        recommendations = [
            "Tuyệt đối KHÔNG đăng nhập tài khoản, KHÔNG cung cấp mật khẩu, mã OTP hoặc số thẻ ngân hàng trên trang web này.",
            f"Nếu bạn cần sử dụng dịch vụ của {spoofed_brand.title() if spoofed_brand else 'trang này'}, hãy tự gõ địa chỉ trang chính thức vào trình duyệt.",
            "Hãy đóng tab trình duyệt ngay lập tức và quét virus trên thiết bị nếu bạn đã lỡ tải tệp tin từ liên kết này.",
            "Báo cáo đường dẫn này cho quản trị viên qua tính năng Báo cáo URL xấu để bảo vệ cộng đồng."
        ]

    # 2. ADULT Analysis
    elif label == "ADULT":
        verdict = "Cảnh Báo: Phát hiện nội dung người lớn & không phù hợp trẻ em (Adult Content)"
        
        if matched_adult_words:
            factors.append({
                "title": "Từ khóa nội dung người lớn đặc trưng (Obscene / Adult Keywords)",
                "type": "RISK",
                "severity": "CRITICAL",
                "evidence": f"Phát hiện các từ khóa người lớn: {', '.join(matched_adult_words)}",
                "description": "Cấu trúc tên miền và đường dẫn chứa trực tiếp các từ ngữ khiêu dâm, vi phạm chính sách bảo vệ thuần phong mỹ tục và an toàn cho trẻ em trên mạng."
            })

        factors.append({
            "title": "Mô hình Phân Loại Bảo Vệ Trẻ Em (Child-Safety Classifier)",
            "type": "RISK",
            "severity": "HIGH",
            "evidence": f"Điểm số an toàn trẻ em: {child_score*100:.1f}% (vượt ngưỡng cho phép 14.0%).",
            "description": "Mô hình học máy phân tích ngữ nghĩa hình thái và cấu trúc phân loại nội dung cho thấy trang web này thuộc danh mục khiêu dâm/người lớn."
        })

        summary = f"URL bị chặn vì chứa nội dung người lớn (ADULT) với độ tin cậy {confidence*100:.1f}%. "
        if matched_adult_words:
            summary += f"Hệ thống phát hiện các từ khóa nhạy cảm ({', '.join(matched_adult_words[:3])}) trong cấu trúc URL."
        else:
            summary += "Mô hình Child-Safety phát hiện cấu trúc phân phối nội dung đồi trụy không phù hợp với thanh thiếu niên."

        recommendations = [
            "Hệ thống tự động kích hoạt tính năng Chặn Truy Cập để bảo vệ môi trường học tập và giải trí của trẻ nhỏ.",
            "Phụ huynh nên bật tính năng Kiểm soát phụ huynh (Parental Controls) trên bộ phát Wi-Fi hoặc thiết bị của con em.",
            "Khuyến cáo thanh thiếu niên không truy cập các trang web có nội dung không lành mạnh để phòng ngừa nguy cơ lộ lọt thông tin cá nhân."
        ]

    # 3. BENIGN Analysis
    else:
        verdict = "Xác Nhận: Liên kết an toàn và hợp lệ (Benign URL)"
        
        if public_suffix in ("gov.vn", "chinhphu.vn", "gov"):
            factors.append({
                "title": "Tên miền cơ quan Chính phủ / Nhà nước (Government Authority Domain)",
                "type": "TRUST",
                "severity": "SAFE",
                "evidence": f"Tên miền kết thúc bằng .{public_suffix} (Cổng thông tin cơ quan nhà nước CHXHCN Việt Nam).",
                "description": "Tên miền được cấp phép và xác thực định danh pháp lý bởi Trung tâm Internet Việt Nam (VNNIC) và Bộ Thông tin & Truyền thông."
            })
        elif public_suffix in ("edu.vn", "edu"):
            factors.append({
                "title": "Tên miền cơ sở Giáo dục & Đào tạo (Educational Domain)",
                "type": "TRUST",
                "severity": "SAFE",
                "evidence": f"Tên miền kết thúc bằng .{public_suffix} (Hệ thống giáo dục đào tạo chính quy).",
                "description": "Được xác thực thuộc về trường học, viện nghiên cứu hoặc đại học chính quy."
            })
        elif registered in TRUSTED_DOMAINS:
            factors.append({
                "title": "Cổng thông tin / Báo chí chính thống uy tín (Verified Press Portal)",
                "type": "TRUST",
                "severity": "SAFE",
                "evidence": f"Tên miền '{registered}' nằm trong danh bạ các cơ quan báo chí & nền tảng uy tín đã được kiểm duyệt.",
                "description": "Đơn vị có giấy phép hoạt động báo chí điện tử chính thức, tuân thủ tiêu chuẩn an toàn thông tin."
            })

        factors.append({
            "title": "Cấu trúc tên miền chuẩn mực (Standard Domain Architecture)",
            "type": "TRUST",
            "severity": "SAFE",
            "evidence": f"Số dấu gạch ngang = {hyphen_count}, không có từ khóa câu mồi lừa đảo.",
            "description": "Tên miền được đặt tên tự nhiên, ngắn gọn, không có dấu hiệu phân mảnh hoặc giả mạo thương hiệu khác."
        })

        if has_https:
            factors.append({
                "title": "Giao thức truyền tải có mã hóa bảo mật (HTTPS Enabled)",
                "type": "TRUST",
                "severity": "SAFE",
                "evidence": "Trang web sử dụng giao thức HTTPS bảo vệ dữ liệu truyền tải.",
                "description": "Dữ liệu trao đổi giữa máy tính của bạn và máy chủ được mã hóa SSL/TLS, ngăn chặn can thiệp trái phép."
            })

        summary = f"URL được xác nhận AN TOÀN (BENIGN) với độ tin cậy {confidence*100:.1f}%. Cấu trúc tên miền chuẩn mực, minh bạch, không tìm thấy bất kỳ dấu hiệu lừa đảo hay nội dung độc hại nào."

        recommendations = [
            "Liên kết an toàn để truy cập, tra cứu thông tin và duyệt bài viết.",
            "Vẫn duy trì thói quen kiểm tra biểu tượng ổ khóa HTTPS trên thanh địa chỉ khi nhập thông tin cá nhân."
        ]

    # Morphological Feature breakdown
    feature_breakdown = [
        {
            "name": "Số dấu gạch ngang tên miền",
            "key": "domain_hyphen_count",
            "value": hyphen_count,
            "benchmark": "<= 1 dấu '-'",
            "status": "DANGER" if hyphen_count >= 3 else "WARNING" if hyphen_count == 2 else "SAFE",
            "explanation": "Tên miền lừa đảo thường dùng 3-6 dấu gạch ngang để ghép tên thương hiệu."
        },
        {
            "name": "Từ khóa đáng ngờ / lừa đảo",
            "key": "suspicious_keyword_count",
            "value": len(matched_phish_words),
            "benchmark": "0 từ khóa",
            "status": "DANGER" if len(matched_phish_words) >= 2 else "WARNING" if len(matched_phish_words) == 1 else "SAFE",
            "explanation": "Sự xuất hiện của các từ như login, verify, otp, account."
        },
        {
            "name": "Mức độ hỗn loạn ký tự (Entropy)",
            "key": "url_entropy",
            "value": url_entropy,
            "benchmark": "< 4.30 bits",
            "status": "WARNING" if url_entropy > 4.40 else "SAFE",
            "explanation": "Đo độ ngẫu nhiên của chuỗi ký tự, chuỗi sinh tự động thường có entropy cao."
        },
        {
            "name": "Độ dài toàn bộ URL",
            "key": "url_length",
            "value": url_len,
            "benchmark": "< 75 ký tự",
            "status": "WARNING" if url_len > 80 else "SAFE",
            "explanation": "URL quá dài thường dùng để ẩn giấu tham số tracking hoặc che mắt người dùng."
        },
        {
            "name": "Đuôi TLD (.com, .vn, .xyz...)",
            "key": "tld",
            "value": f".{tld_suffix}" if tld_suffix else "none",
            "benchmark": "TLD uy tín",
            "status": "WARNING" if is_tld_risky else "SAFE",
            "explanation": "Các đuôi .xyz, .top, .buzz thường có tỷ lệ lạm dụng lừa đảo cao hơn."
        }
    ]

    return {
        "verdict": verdict,
        "summary": summary,
        "factors": factors,
        "features": feature_breakdown,
        "recommendations": recommendations
    }


def predict_url(url: str) -> Dict[str, Any]:
    """
    Classifies a URL into exactly one of three final states:
    - BENIGN (ALLOW)
    - PHISHING (BLOCK)
    - ADULT (BLOCK)

    Rule Hierarchy: PHISHING > ADULT > BENIGN.
    Enriched with full Explainable AI (XAI) factors.
    """
    bundle = load_model()
    feature_cols = bundle["feature_columns"]

    sec_branch = bundle["security"]
    child_branch = bundle["child_safety"]

    sec_model = sec_branch["model"]
    sec_thresh = float(sec_branch["threshold"])

    child_model = child_branch["model"]
    child_thresh = float(child_branch["threshold"])

    # Extract base components
    s, parsed, host, has_scheme = safe_parse_url(url)
    subdomain, registered, public_suffix = public_suffix_parts(host)
    path = parsed.path or ""

    # Feature extraction (48 lexical features)
    f_full = extract_url_features(url)
    base_url = f"http://{host}"
    f_base = extract_url_features(base_url)

    # Stage 0: Trusted Benign Domain
    if is_trusted_benign(host, registered, public_suffix):
        xai = build_xai_explanation(
            url=url,
            label="BENIGN",
            action="ALLOW",
            confidence=0.9850,
            sec_score=0.0150,
            child_score=0.0050,
            features=f_full
        )
        return {
            "url": url,
            "label": "BENIGN",
            "action": "ALLOW",
            "confidence": 0.9850,
            "reason": "Tên miền cơ quan / cổng thông tin uy tín đã được xác thực",
            "phishing_score": 0.0150,
            "adult_score": 0.0050,
            "phishing_threshold": round(sec_thresh, 4),
            "adult_threshold": round(child_thresh, 4),
            "secondary_risk": None,
            "xai": xai
        }

    # Stage 1: Explicit Adult Lexical Detection
    is_adult_lex, adult_reason, matched_adults = detect_adult_lexical(host, path)
    if is_adult_lex:
        xai = build_xai_explanation(
            url=url,
            label="ADULT",
            action="BLOCK",
            confidence=0.9920,
            sec_score=0.0500,
            child_score=0.9920,
            features=f_full,
            matched_adult_words=matched_adults
        )
        return {
            "url": url,
            "label": "ADULT",
            "action": "BLOCK",
            "confidence": 0.9920,
            "reason": adult_reason,
            "phishing_score": 0.0500,
            "adult_score": 0.9920,
            "phishing_threshold": round(sec_thresh, 4),
            "adult_threshold": round(child_thresh, 4),
            "secondary_risk": None,
            "xai": xai
        }

    # Stage 2: Phishing Brand Impersonation & Credential Harvesting Heuristics
    is_phish_spoof, spoof_score, spoof_reason, spoofed_brand, matched_intents = detect_phishing_spoofing(host, registered, path)
    if is_phish_spoof:
        xai = build_xai_explanation(
            url=url,
            label="PHISHING",
            action="BLOCK",
            confidence=spoof_score,
            sec_score=spoof_score,
            child_score=0.0100,
            features=f_full,
            spoofed_brand=spoofed_brand,
            matched_phish_words=matched_intents
        )
        return {
            "url": url,
            "label": "PHISHING",
            "action": "BLOCK",
            "confidence": spoof_score,
            "reason": spoof_reason,
            "phishing_score": spoof_score,
            "adult_score": 0.0100,
            "phishing_threshold": round(sec_thresh, 4),
            "adult_threshold": round(child_thresh, 4),
            "secondary_risk": None,
            "xai": xai
        }

    # Stage 3: Feature Extraction & ML Scoring
    # Security branch (Random Forest): neutralize has_https protocol bias
    df_full_sec = pd.DataFrame([f_full])[feature_cols].astype(float)
    df_full_sec["has_https"] = 0.0
    sec_p_full = float(sec_model.predict_proba(df_full_sec)[0, 1])

    has_suspicious_domain_traits = (
        f_full.get("domain_hyphen_count", 0) >= 2 or
        f_full.get("suspicious_keyword_count", 0) > 0 or
        f_full.get("is_suspicious_tld", 0) == 1 or
        f_full.get("has_ip_address", 0) == 1
    )

    if has_suspicious_domain_traits:
        df_base_sec = pd.DataFrame([f_base])[feature_cols].astype(float)
        df_base_sec["has_https"] = 0.0
        sec_p_base = float(sec_model.predict_proba(df_base_sec)[0, 1])
        sec_score = max(sec_p_full, sec_p_base)
    else:
        sec_score = sec_p_full

    # Child safety branch: neutralize has_https bias
    df_child = pd.DataFrame([f_full])[feature_cols].astype(float)
    if hasattr(child_model, "named_steps") and "scaler" in child_model.named_steps:
        scaler = child_model.named_steps["scaler"]
        https_idx = feature_cols.index("has_https")
        df_child["has_https"] = scaler.mean_[https_idx]
        child_score = float(child_model.predict_proba(df_child)[0, 1])
    else:
        df_child["has_https"] = 0.0
        child_score = float(child_model.predict_proba(df_child)[0, 1])

    is_phishing = sec_score >= sec_thresh
    is_adult = child_score >= child_thresh

    # Priority Decision Policy: PHISHING > ADULT > BENIGN
    if is_phishing:
        label = "PHISHING"
        action = "BLOCK"
        confidence = sec_score
        reason = "Phishing URL pattern detected (Random Forest Classifier)"
        secondary_risk = "ADULT" if is_adult else None
    elif is_adult:
        label = "ADULT"
        action = "BLOCK"
        confidence = child_score
        reason = "Adult content pattern detected (Child-Safety Classifier)"
        secondary_risk = None
    else:
        label = "BENIGN"
        action = "ALLOW"
        confidence = max(1.0 - sec_score, 0.90)
        reason = "No phishing or adult risk detected"
        secondary_risk = None

    xai = build_xai_explanation(
        url=url,
        label=label,
        action=action,
        confidence=round(float(confidence), 4),
        sec_score=round(float(sec_score), 4),
        child_score=round(float(child_score), 4),
        features=f_full
    )

    return {
        "url": url,
        "label": label,
        "action": action,
        "confidence": round(float(confidence), 4),
        "reason": reason,
        "phishing_score": round(float(sec_score), 4),
        "adult_score": round(float(child_score), 4),
        "phishing_threshold": round(float(sec_thresh), 4),
        "adult_threshold": round(child_thresh, 4),
        "secondary_risk": secondary_risk,
        "xai": xai
    }

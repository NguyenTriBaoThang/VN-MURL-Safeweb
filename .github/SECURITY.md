# Security Policy & Vulnerability Disclosure

The **VN-MURL SafeWeb** project treats cybersecurity and user safety with the utmost importance. As a system engineered for malicious URL detection and child-safe web browsing, maintaining high security standards is our core principle.

---

## 🔒 Supported Versions

We provide security updates and patches for the following versions:

| Version | Supported          | Status |
| :--- | :---: | :--- |
| **v1.x (Current)** | :white_check_mark: | Actively supported |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, security bypass, or potential exploit in VN-MURL SafeWeb (e.g., SSRF bypass, authentication flaws, model evasion, or remote code execution risks), **please do not create a public issue**.

### Reporting Channel:
- **Email:** [nguyentribaothang@gmail.com](mailto:nguyentribaothang@gmail.com)
- **Subject Line:** `[SECURITY] Vulnerability Report: VN-MURL SafeWeb`
- Alternatively, submit a **Private Security Advisory** via GitHub Security tab.

### Please Include:
1. Detailed description of the vulnerability and attack vector.
2. Step-by-step instructions or Proof of Concept (PoC) to reproduce the issue.
3. Affected components (`src/api`, `src/ai-service`, `src/web`, or `src/browser-extension`).
4. Potential impact on end users or infrastructure.
5. Any proposed mitigations or code patches.

---

## 🛡️ Core Security Architecture & Principles

1. **Zero-Crawl Lexical Evaluation:** The AI service strictly evaluates lexical morphology without establishing outbound HTTP connections to candidate URLs. This eliminates SSRF and protects child users from indirect content retrieval.
2. **SSRF & Private Network Defense:** The ASP.NET Core gateway validates all candidate URLs and aggressively drops loopback addresses (`127.0.0.1`, `::1`) and RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`).
3. **Role-Based Access Control (RBAC):** Strict separation between standard end-user functionality and administrative SOC capabilities.
4. **Defense-in-Depth Model Hierarchy:** $\text{PHISHING} > \text{ADULT} > \text{BENIGN}$ guarantees high-risk cyber threats take precedence in defensive actions.


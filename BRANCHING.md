# Git Branching Strategy & Workflow

This repository adheres to a disciplined Git workflow to ensure code stability, reproducible machine learning experiments, and smooth continuous integration.

---

## 🌿 Main Branches

| Branch | Purpose | Stability | Deployment Target |
| :--- | :--- | :---: | :--- |
| **`main`** | Production-ready, officially released code. Protected branch. | High | Production / Docker Hub |
| **`develop`** | Integration branch for verified feature branches. | Medium-High | Staging / Pre-release |

---

## 🚀 Supporting Branches

### 1. Feature Branches (`feature/*`)
- **Naming:** `feature/<kebab-case-name>` (e.g. `feature/ssrf-ipv6-filter`, `feature/dark-mode-charts`)
- **Origin:** Branched from `develop`
- **Destination:** Merged back into `develop` via Pull Request
- **Rules:** Must pass all unit tests and conventional commit requirements.

### 2. Bugfix Branches (`fix/*`)
- **Naming:** `fix/<kebab-case-name>` (e.g. `fix/tldextract-cache`, `fix/refresh-token-expiry`)
- **Origin:** Branched from `develop` (or `main` for critical hotfixes `hotfix/*`)
- **Destination:** Merged into `develop` and `main`

### 3. Research & Experiment Branches (`research/*`)
- **Naming:** `research/<experiment-name>` (e.g. `research/vietnamese-token-features`, `research/lightgbm-benchmark`)
- **Purpose:** Used for data science exploration, Colab training runs, and feature engineering benchmarks without disturbing production runtime code.

---

## 🛡️ Pull Request Rules
1. Every PR must use the [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).
2. All CI checks (`ai-service-check`, `api-backend-check`, `frontend-check`, `extension-check`) must be green.
3. Commit messages must adhere to Conventional Commits.


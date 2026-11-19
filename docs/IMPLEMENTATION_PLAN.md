# VN-MURL SafeWeb — Implementation Plan
**Machine Learning for URL Security & Child-Safe Web Access**

---

## 1. Executive Overview & Architecture
VN-MURL SafeWeb is an enterprise-grade AI cybersecurity and child safety platform designed to classify URLs into exactly three actionable states:
- `BENIGN` → `ALLOW`
- `PHISHING` → `BLOCK`
- `ADULT` → `BLOCK`

**Priority Decision Logic:** `PHISHING > ADULT > BENIGN`.

### System Topology
```
[ Browser / Extension / Client ]
            │
            ▼
    [ React Web Dashboard ] (Vite + TS + Tailwind + Recharts)
            │
            ▼
   [ ASP.NET Core 8 Web API ] (EF Core + SQL Server / SQLite fallback + JWT + Rate Limiting)
            │
            ▼
   [ FastAPI AI Service ] (Python 3.13 + scikit-learn 1.6.1 + tldextract)
            │
            ▼
[ VN_MURL_SafeWeb_Final_Model.joblib ] (Composite: Security RF [0.425] + Child-Safety LR [0.140])
            │
            ▼
   [ ScanLog Persisted to DB ]
```

---

## 2. Project Directory Structure
```
VN_MURL_SafeWeb/
├── src/
│   ├── api/                    # ASP.NET Core 8 Web API
│   │   ├── Controllers/        # Scan, Dashboard, Research, Settings, Allow/BlockList, Auth
│   │   ├── Services/           # AiClient, TokenService, PolicyService
│   │   ├── Models/             # ScanLog, User, Setting, AllowList, BlockList
│   │   ├── DTOs/               # ScanRequest, ScanResponse, DashboardSummary, ResearchDTOs
│   │   ├── Data/               # AppDbContext, SeedData
│   │   ├── Security/           # JwtOptions, PrivateNetworkValidator
│   │   ├── Middlewares/        # SecurityHeadersMiddleware, ErrorHandlerMiddleware
│   │   ├── appsettings.json
│   │   └── Program.cs
│   │
│   ├── web/                    # React 18 + Vite + TypeScript + Tailwind CSS
│   │   ├── src/
│   │   │   ├── api/            # axios client & endpoint functions
│   │   │   ├── components/     # UI primitives, ResultCard, StatusBadge, Navbar, Sidebar
│   │   │   ├── layouts/        # AppLayout, MinimalLayout
│   │   │   ├── pages/          # Dashboard, Scan, History, Research, Architecture, Settings, About, Admin, BlockPage
│   │   │   ├── charts/         # ConfusionMatrixChart, RocCurveChart, FeatureImportanceChart, etc.
│   │   │   ├── hooks/          # useScan, useMetrics, useAuth
│   │   │   ├── types/          # ScanLog, ResearchData, FilterOptions
│   │   │   └── utils/          # formatters, constants
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── ai-service/             # FastAPI AI Microservice
│   │   ├── app.py              # FastAPI endpoints (/health, /model/info, /predict)
│   │   ├── model_loader.py     # joblib composite model loader & metadata parser
│   │   ├── predictor.py        # 3-label priority predictor
│   │   ├── feature_extractor.py# 48-feature lexical URL extractor (tldextract snapshot)
│   │   ├── schemas.py          # Pydantic v2 schemas
│   │   ├── model/              # VN_MURL_SafeWeb_Final_Model.joblib & metadata
│   │   │   ├── VN_MURL_SafeWeb_Final_Model.joblib
│   │   │   └── VN_MURL_SafeWeb_Final_Model_Metadata.json
│   │   └── requirements.txt
│   │
│   └── browser-extension/      # Chrome/Edge Manifest V3
│       ├── manifest.json
│       ├── background.js       # WebNavigation / declarativeNetRequest / onBeforeNavigate
│       ├── popup.html / .js    # Quick scanner popup
│       ├── blocked.html / .js  # Dynamic block warning page
│       ├── icons/
│       └── options.html / .js  # API server settings
│
├── research/                   # Real research outputs, manifests, and notebook metrics
├── metrics/                    # All 19 CSV metrics from real experiment runs
├── figures/                    # All 40 PNG visualization figures
├── reports/                    # Generated research summaries
├── docs/                       # Implementation documentation
├── docker-compose.yml          # Multi-container orchestration
├── .env.example
└── README.md
```

---

## 3. Phased Implementation Roadmap

### Phase 1: Foundation & Model Verification (DONE)
- [x] Inspect reference repo (`ChildSafeNet`).
- [x] Inspect and verify single final artifact `VN_MURL_SafeWeb_Final_Model.joblib`.
- [x] Generate and verify `VN_MURL_SafeWeb_Final_Model_Metadata.json`.
- [x] Extract and verify exact 48 URL lexical features from original Colab training notebook (`VN_MURL_ML_Research_Colab_FINAL_3_LABELS.ipynb`).
- [x] Verify classification and priority logic (`PHISHING > ADULT > BENIGN`).
- [x] Collect and organize authentic research metric files (19 CSVs, 40 PNGs).

### Phase 2: FastAPI AI Service
- Implement `feature_extractor.py` with 48 lexical features using offline `tldextract`.
- Implement `model_loader.py` to load composite model and metadata.
- Implement `predictor.py` applying thresholds:
  - Security (Phishing): `threshold = 0.425`
  - Child-Safety (Adult): `threshold = 0.140`
  - Hierarchy: `PHISHING > ADULT > BENIGN`.
- Implement `app.py`:
  - `GET /health` → status, model loaded, feature count (48).
  - `GET /model/info` → complete model metadata, thresholds, feature list, policies.
  - `POST /predict` → single URL prediction with scores & reasons.
- Zero network requests to target URL (No scraping, no SSRF risk).

### Phase 3: ASP.NET Core 8 Web API
- Architecture:
  - Controllers: `ScanController`, `DashboardController`, `ResearchController`, `SettingsController`, `PolicyController` (Allowlist/Blocklist), `AuthController`.
  - Database: `AppDbContext` with SQL Server support and automatic SQLite fallback for local development.
  - Security: Private network IP blocking (RFC 1918 / Loopback validation), Security Headers, Rate Limiting, JWT Bearer authentication.
- Microservice Integration:
  - `AiClient`: HTTP client to call FastAPI `/predict` and `/model/info`.
  - Save every scan into `ScanLog` table (Id, UserId, Url, Label, Action, Confidence, PhishingScore, AdultScore, Reason, CreatedAt).
  - Provide endpoints to serve real research metrics (`/api/research/summary`, `/api/research/metrics/{category}`).

### Phase 4: React Modern Web Application
- Setup with Vite + React 18 + TypeScript + Tailwind CSS.
- Design: Modern Cybersecurity + AI Child Safety aesthetic (Dark mode primary, neon green for BENIGN, crimson red for PHISHING, amber orange for ADULT).
- Navigation:
  - **Dashboard**: KPI cards, recent scans list, live distribution chart, model status.
  - **Scan URL**: Instant URL scanner with dynamic Result Card.
  - **History**: Full scan logs with search, filter by label/action, pagination, export.
  - **Research**: Presentation-ready dashboard displaying real metrics, comparison charts, confusion matrices, ROC/PR curves, feature importance, bootstrap CI, McNemar tests.
  - **Architecture**: Interactive architectural diagram & system flow.
  - **Settings**: Threshold customization, allowlist & blocklist management, notification preferences.
  - **About**: Research methodology, dataset details, child protection principles.
  - **Admin**: System management and policy enforcement.

### Phase 5: Chrome / Edge Browser Extension (Manifest V3)
- Real-time tab URL scanning via `POST /api/scan`.
- Intercept navigation:
  - `BENIGN` → Allow tab to proceed.
  - `PHISHING` / `ADULT` → Redirect to high-impact Block Page (`blocked.html`).
- Popup UI for instant manual scan and status overview.
- Offline and connection fallback handling.

### Phase 6: Dockerization & Orchestration
- `docker-compose.yml` orchestrating:
  - `ai-service`: Python FastAPI container.
  - `api`: ASP.NET Core 8 container.
  - `web`: Nginx serving built React single-page app.
  - `sqlserver`: Microsoft SQL Server container.
- Complete environment variables in `.env.example`.

### Phase 7: Verification & Build Validation
- Run `dotnet build` on ASP.NET project.
- Run `npm run build` on React project.
- Run `python -m compileall src/ai-service`.
- Run automated end-to-end integration tests.
- Comprehensive `README.md` and user guide.

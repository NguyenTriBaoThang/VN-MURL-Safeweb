# Contributing to VN-MURL SafeWeb

Thank you for your interest in contributing to **VN-MURL SafeWeb**! This project is an open-source cybersecurity and child safety platform combining machine learning URL classification, high-performance ASP.NET Core APIs, real-time browser extension interception, and an interactive React web dashboard.

---

## 🧭 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please treat all contributors with respect and professionalism.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Git** (with [Git LFS](https://git-lfs.com/) installed)
- **.NET 10.0 / 8.0 SDK** (for `src/api`)
- **Python 3.12+** (for `src/ai-service`)
- **Node.js 20+** and **npm** (for `src/web`)
- **Docker & Docker Compose** (optional, recommended for integrated local testing)

### 2. Fork and Clone
```bash
git clone https://github.com/NguyenTriBaoThang/VN-MURL-Safeweb.git
cd VN-MURL-Safeweb
git lfs pull
```

---

## 🌿 Git Branching Strategy

We follow a disciplined branch workflow:
- `main`: Production-ready release branch. All commits here must pass full CI.
- `develop`: Main development integration branch.
- `feature/<feature-name>`: Dedicated branch for new features or capabilities.
- `fix/<bug-name>`: Dedicated branch for bug fixes.
- `docs/<doc-name>`: Dedicated branch for documentation updates.

---

## 📝 Commit Conventions

All commits must adhere to the **[Conventional Commits](https://www.conventionalcommits.org/)** specification:

```text
<type>(<scope>): <short summary>

[optional body]
```

### Allowed Types:
- `feat`: A new feature or capability.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect code meaning (white-space, formatting).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `perf`: Code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `build`: Changes affecting build system or external dependencies.
- `ci`: Changes to CI configuration files and scripts.
- `chore`: Other changes that don't modify `src` or test files.

### Examples:
- `feat(ai): add non-ascii entropy calculation to lexical extractor`
- `fix(api): handle loopback ip edge case in private network validator`
- `docs(readme): add docker compose quickstart instructions`

---

## 🧪 Local Testing & Verification

Before submitting a Pull Request, please ensure all component verification steps pass:

### 1. AI Microservice
```bash
cd src/ai-service
python -m compileall .
pytest tests/ -v
```

### 2. ASP.NET Core API
```bash
cd src/api
dotnet restore
dotnet build -c Release
```

### 3. Frontend Web Application
```bash
cd src/web
npm install
npm run build
```

---

## 🚀 Submitting a Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feature/my-feature-name
   ```
2. Open a Pull Request targeting the `main` or `develop` branch.
3. Fill out the [Pull Request Template](./PULL_REQUEST_TEMPLATE.md) completely.
4. Ensure all GitHub Actions CI checks pass.
5. Request review from project maintainers.


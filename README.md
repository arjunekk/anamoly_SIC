# anomaly.

Industrial Defect Detection & Maintenance Recommendation System — an end-to-end AI system that simulates automated visual inspection in a manufacturing environment. Detects product defects, localizes them via anomaly heatmaps, estimates severity, generates maintenance recommendations, stores inspection history, visualizes results on a dashboard, and generates downloadable PDF inspection reports.

Supports **all 15 MVTec AD categories**, with per-category calibrated detection models and severity thresholds. Backed by a full automated test suite, a rigorous evaluation pipeline (AUROC, confusion matrix, precision/recall/F1, pixel-level localization), and containerized deployment via Docker Compose.

---

## Tech Stack

- **AI/ML:** PyTorch, Torchvision, OpenCV, WideResNet50-2 (pretrained feature extractor), PatchCore (anomaly detection), scikit-learn (evaluation metrics)
- **Backend:** FastAPI, SQLAlchemy, Alembic, ReportLab
- **Frontend:** React (Vite), Tailwind CSS v4, React Router
- **Database:** PostgreSQL
- **Testing:** pytest, httpx
- **Deployment:** Docker, Docker Compose, nginx

---

## Project Status

✅ Complete:
- Image upload → category-specific AI inference → anomaly heatmap
- All 15 MVTec AD categories, each with its own PatchCore memory bank
- Severity estimation — bottle manually calibrated (Phase 8); all other categories automated (percentile-based, 95th-percentile ceiling)
- Rule-based maintenance recommendations
- Results persisted to PostgreSQL, category tracked per inspection
- Dashboard with aggregate statistics
- Inspection History (full table, all records)
- Downloadable PDF inspection reports
- Automated test suite — 26 pytest tests
- Full evaluation suite across all 15 categories (AUROC, precision/recall/F1, confusion matrices, pixel-level localization)
- **Redesigned frontend** — sidebar navigation, dark/light mode, custom typography (Helvetica-style titles, Garamond subtitle, Space Grotesk display, JetBrains Mono numerals)
- **Docker Compose deployment** — Postgres, FastAPI backend, and nginx-served frontend, fully containerized with persistent volumes

🚧 Not yet done:
- Basic security hardening (auth, upload limits, rate limiting) — required before any public-facing deployment
- Public cloud hosting (current deployment is local Docker Compose only)

---

## Dataset

[MVTec AD dataset](https://www.mvtec.com/company/research/datasets/mvtec-ad) (registration required). Place each category folder at `dataset/mvtec_ad/<category>/`.

Supported: `bottle`, `cable`, `capsule`, `carpet`, `grid`, `hazelnut`, `leather`, `metal_nut`, `pill`, `screw`, `tile`, `toothbrush`, `transistor`, `wood`, `zipper`.

---

## Running the App

### Option A — Docker Compose (recommended, one command)

Requires Docker Desktop installed and running.

1. Create a root `.env` file:
   ```
   POSTGRES_PASSWORD=your_chosen_password
   ```
2. Ensure `models/` (memory banks) and `dataset/mvtec_ad/<category>/` (at least for categories you want available) exist on disk.
3. Run:
   ```bash
   docker compose up
   ```
4. Frontend: `http://localhost:3000`. Backend: `http://localhost:8000` (docs at `/docs`).

First run downloads the pretrained WideResNet50-2 weights once (cached in a persistent volume afterward). Data persists across `docker compose down` / `up` cycles via named volumes.

### Option B — Local dev servers (no Docker)

**Backend:**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```
Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/defect_detection
```
```bash
psql -U postgres -h localhost -c "CREATE DATABASE defect_detection;"
cd backend && alembic upgrade head
PYTHONPATH=backend uvicorn main:app --reload --app-dir backend
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

**Build memory banks / calibrate / evaluate (needed once, or after adding categories):**
```bash
PYTHONPATH=backend python backend/scripts/build_all_memory_banks.py
PYTHONPATH=backend python backend/scripts/calibrate_all_categories.py
PYTHONPATH=backend python backend/scripts/evaluate_all_categories.py
```

**Tests:**
```bash
cd backend
pytest -v
```

---

## Application Pages

- **Inspect** (`/`) — large centered hero, category dropdown, upload, results with heatmap/score/severity/recommendations, PDF download
- **Dashboard** (`/dashboard`) — aggregate stats across all categories
- **History** (`/history`) — full table of every past inspection

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/categories` | Categories with a currently loaded model |
| POST | `/inspect` | Upload image + category, run inspection |
| GET | `/inspections` | List all past inspections |
| GET | `/dashboard` | Aggregate stats, recent inspections, score trend |
| GET | `/inspections/{id}/report` | PDF report for one inspection |

---

## Evaluation Results (Summary)

Full results in `docs/evaluation_report.md`. Headline findings:

- **Structural-defect categories perform near-perfectly**: bottle, leather, hazelnut, carpet, metal_nut, wood — AUROC ≥ 0.98, recall ≥ 0.90.
- **Subtle textural/print-defect categories are harder**: capsule, screw, toothbrush, grid — AUROC 0.76–0.93, consistent with published PatchCore benchmarks.
- **A real calibration bug was found and fixed during evaluation**: the initial automated threshold used the raw max good-image score, which was outlier-sensitive and caused severe recall collapse (e.g. capsule recall was 0.009). Switched to a 95th-percentile ceiling — recovered recall system-wide with no meaningful precision loss.
- **A targeted memory-bank-richness experiment produced mixed, documented results**: increasing subsample ratio (0.1→0.25) helped capsule substantially, was neutral for toothbrush, and made grid/screw's recall slightly worse — kept anyway, prioritizing capsule's larger gain. Evidence that "more reference data" isn't universally better.

---

## Project Structure

```
anamoly_detection/
├── backend/
│   ├── app/                  # api, core, preprocessing, feature_extraction,
│   │                          # anomaly_detection, severity, recommendation,
│   │                          # reports, evaluation, db
│   ├── scripts/              # build/calibrate/evaluate automation
│   ├── alembic/
│   ├── tests/                # 26 pytest tests
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── main.py
├── frontend/
│   ├── src/                  # api, components, pages, hooks
│   ├── Dockerfile
│   └── nginx.conf
├── models/                   # per-category memory banks (gitignored)
├── dataset/                  # MVTec AD, all categories (gitignored)
├── reports/                  # uploads, heatmaps, generated PDFs (gitignored)
├── docs/                     # architecture, calibration notes, evaluation report
├── docker-compose.yml
└── README.md
```

---

## Known Limitations

- Only `bottle`'s thresholds were manually reviewed in depth; all others use automated percentile calibration.
- Capsule, screw, toothbrush, grid have lower detection performance — a genuine, documented model limitation for subtle defects, not a bug.
- Grid and screw's recall was knowingly left slightly regressed after a memory-bank-richness experiment, in favor of capsule's larger gain.
- Pixel-level AUROC uses a per-image-averaged approximation, not the paper's exact pooled-pixel method.
- Integration tests run against the real database, not an isolated test database.
- No authentication, upload limits, or rate limiting — required before any public deployment.
- Docker deployment is local-only; no cloud hosting configured yet.
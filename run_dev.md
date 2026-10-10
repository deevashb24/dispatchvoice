# Running DispatchVoice AI Locally

### Backend Server (FastAPI)
```bash
cd /Users/deevash/.gemini/antigravity/scratch/dispatchvoice
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8014 --reload
```
- API Docs: http://localhost:8014/docs
- Health Check: http://localhost:8014/api/v1/health

### Frontend Console (Next.js 16)
```bash
cd /Users/deevash/.gemini/antigravity/scratch/dispatchvoice/frontend
npm run dev -- -p 3014
```
- Web Application: http://localhost:3014

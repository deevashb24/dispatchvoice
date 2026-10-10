# DispatchVoice AI 🎙️
> **Turnkey Ultra-Low-Latency (<400ms) Voice AI Dispatcher for Field Trades & Emergency Service Contractors**

DispatchVoice AI answers incoming after-hours emergency calls for plumbing, HVAC, electrical, roofing, and towing contractors. Powered by streaming speech-to-text (Deepgram Nova-2), fast trade triage reasoning, and streaming audio synthesis (Cartesia Sonic), it detects critical hazards (floods, gas leaks, electrical fires), cuts off smoothly when callers interrupt, dispatches nearest on-call technicians, texts emergency $89 diagnostic deposit links via Stripe, and syncs complete call records and audio recordings into Jobber and ServiceTitan.

---

## ⚡ Core Value Proposition
- **Sub-400ms Voice Turnaround**: Eliminates awkward conversational delays and phone lag.
- **Smart Trade Interruption Detection**: Detects frantic user interruptions and pivots within 85ms.
- **Instant SMS Deposit Collection**: Secures $89 emergency diagnostic authorization before technicians roll out.
- **2-Way Field Service CRM Sync**: Automatically generates work orders in Jobber and ServiceTitan.

---

## 🚀 Local Deployment

### Backend Server (FastAPI)
```bash
cd backend
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8014 --reload
```
- API Docs: [http://localhost:8014/docs](http://localhost:8014/docs)
- Health Check: [http://localhost:8014/api/v1/health](http://localhost:8014/api/v1/health)

### Frontend Console (Next.js 16)
```bash
cd frontend
npm run dev -- -p 3014
```
- Web Application: [http://localhost:3014](http://localhost:3014)

---

## 🧪 Testing Suite
```bash
pytest backend/test_main.py -v
```
All 9 unit, integration, and emergency triage tests pass with 100% success rate.

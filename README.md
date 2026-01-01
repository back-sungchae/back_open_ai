# back_open_ai

OpenAI 기반 위험 분석을 포함한 간단한 백엔드 템플릿입니다.  
Express + 이벤트 버스 + 모듈 구조로 구성되어 있으며, Task 생성 시 AI 분석 → 상태 결정 흐름을 제공합니다.

## 구조

```
src/
  core/                 공통(core) 유틸
  middleware/           공통 미들웨어
  modules/
    task/               Task 도메인 (model/service/controller/events/state)
    ai/                 AI 소비자
  routes/               라우터
  app.js                Express 앱
  server.js             서버 엔트리
```

## 실행

```bash
npm install
node src/server.js
```

## 환경 변수

`.env`

```
OPENAI_API_KEY=sk-...
PORT=3000
```

## API

Base URL: `http://localhost:3000`

- `GET /health`
- `GET /metrics`

Task
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PATCH /tasks/:id`
- `PATCH /tasks/:id/status`
- `DELETE /tasks/:id`

### 예시

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"analyze request","input":"possible fraud risk"}'
```

## 동작 흐름

1. `POST /tasks` → Task 생성
2. `task.created` 이벤트 발생
3. `risk_analyzer.consumer`가 AI 분석 실행
4. `task.risk_analyzed` 이벤트 발생
5. `state_decision.consumer`가 risk 점수로 상태 결정
6. Task 상태가 `success` 또는 `failed`로 변경

## 상태 전이 규칙

- `pending` → `running`
- `running` → `success` | `failed`

## 이벤트 (Phase 1)

Phase 1에서는 CRUD 중심 이벤트를 사용합니다.
Phase 2에서 도메인 이벤트(`TaskRequested`, `TaskApproved` 등)로 확장 예정입니다.

## Notes

- OpenAI API 사용을 위해 Billing 활성화가 필요합니다.
- `OPENAI_API_KEY`가 없으면 AI 분석이 실패합니다.

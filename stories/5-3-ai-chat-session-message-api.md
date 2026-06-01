---
story_key: 5-3-ai-chat-session-message-api
github_issue: 85
github_url: https://github.com/khovan123/philo-mind/issues/85
task_id: T-E03
status: ready-for-dev
priority: high
track: E
type: backend
---

# Story 5-3-ai-chat-session-message-api: AI Chat session + message API

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **AI Chat session + message API** theo issue GitHub [#85](https://github.com/khovan123/philo-mind/issues/85) để deliverable của task `T-E03` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [ ] Start/list/get sessions
- [ ] send message
- [ ] 20-msg context

## Tasks/Subtasks

### Implementation

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **AI Chat session + message API**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Start/list/get sessions, send message, 20-msg context.

### Verification

- [ ] Chạy lint/typecheck/test phù hợp với package bị thay đổi.
- [ ] Ghi rõ command đã chạy và kết quả trong PR.
- [ ] Kiểm tra không commit secret, file `.env` thật hoặc artifact local.
- [ ] Nếu thay đổi contract dùng chung, cập nhật consumer hoặc ghi rõ follow-up dependency.

### Definition of Done

- [ ] Code/config đã commit trên branch riêng và mở PR liên kết issue này.
- [ ] PR mô tả phạm vi thay đổi, cách kiểm chứng và rủi ro còn lại.
- [ ] CI xanh hoặc PR ghi rõ blocker có thể tái hiện.
- [ ] Không còn TODO thuộc trực tiếp scope issue này.

## Dev Notes

### Source Issue

- GitHub issue: [#85](https://github.com/khovan123/philo-mind/issues/85)
- Task ID: `T-E03`
- Track: E - AI & Chat System
- Group: E-Backend
- Milestone: Week 4
- Suggested owner: Backend+AI Dev
- Assigned GitHub user(s): VinhHoang03
- Estimate: 5h
- Labels: `track:E-ai`, `priority:high`, `type:backend`

### Dependencies

- Declared dependencies: `T-E02`
- Dependency rule: chỉ bắt đầu integration thật sau khi dependency đã merge hoặc có contract/mock được thống nhất.

### Implementation Guidance

- Backend follows Controller -> Service -> Repository-style boundaries where available.
- Use `/api/v1/` REST routes, standardized `{ success, data, error, meta }` response shape, and existing auth/validation middleware.
- Prefer Prisma schema relationships and typed DTOs from `@philo-mind/shared` over duplicated local shapes.
- Keep changes narrowly mapped to this story and do not absorb neighboring GitHub issues unless explicitly required by a dependency contract.
- If shared contracts change, update both producer and consumer or document the follow-up dependency clearly.

### Project Context Snapshot

- Backend stack: Express 5 + Prisma 7 + TypeScript, REST prefix `/api/v1/`.
- Frontend stack: Expo 56 + React Native + Expo Router + NativeWind + Zustand.
- Shared package: `libs/shared` for DTOs, enums, constants, and cross-package contracts.
- Current architecture docs: `docs/project-context.md`, `docs/architecture.md`, `_bmad-output/implementation-artifacts/implementation-spec.md`.

### Original Issue Body

## T-E03: AI Chat session + message API

### Mục tiêu

Hoàn thành **AI Chat session + message API** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị             |
| ----------------- | ------------------- |
| Track             | E: AI & Chat System |
| Nhóm              | E-Backend           |
| Owner gợi ý       | Backend+AI Dev      |
| Estimate          | 5h                  |
| Thời điểm dự kiến | Week 4              |
| Dependencies      | `T-E02`             |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **AI Chat session + message API**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Start/list/get sessions, send message, 20-msg context.

### Acceptance Criteria

- [ ] Start/list/get sessions
- [ ] send message
- [ ] 20-msg context

### Kiểm chứng bắt buộc

- [ ] Chạy lint/typecheck/test phù hợp với package bị thay đổi.
- [ ] Ghi rõ command đã chạy và kết quả trong PR.
- [ ] Kiểm tra không commit secret, file `.env` thật hoặc artifact local.
- [ ] Nếu thay đổi contract dùng chung, cập nhật consumer hoặc ghi rõ follow-up dependency.

### Definition of Done

- [ ] Code/config đã commit trên branch riêng và mở PR liên kết issue này.
- [ ] PR mô tả phạm vi thay đổi, cách kiểm chứng và rủi ro còn lại.
- [ ] CI xanh hoặc PR ghi rõ blocker có thể tái hiện.
- [ ] Không còn TODO thuộc trực tiếp scope issue này.

---

_Generated from `docs/task-breakdown.md`. Nếu scope thay đổi, cập nhật breakdown và issue cùng lúc._

## Dev Agent Record

### Debug Log

- Pending implementation.

### Completion Notes

- Pending implementation.

### File List

- Pending implementation.

## Change Log

| Date       | Version | Description                          | Author |
| ---------- | ------- | ------------------------------------ | ------ |
| 2026-05-31 | 0.1     | Story created from GitHub issue #85. | Codex  |

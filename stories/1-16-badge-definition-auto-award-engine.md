---
story_key: 1-16-badge-definition-auto-award-engine
github_issue: 32
github_url: https://github.com/khovan123/philo-mind/issues/32
task_id: T-A16
status: completed
priority: medium
track: A
type: backend
---

# Story 1-16-badge-definition-auto-award-engine: Badge definition + auto-award engine

## Status

completed

## Story

Là developer của PhiloMind, tôi cần hoàn thành **Badge definition + auto-award engine** theo issue GitHub [#32](https://github.com/khovan123/philo-mind/issues/32) để deliverable của task `T-A16` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [x] 10 badge conditions
- [x] triggered on activity

## Tasks/Subtasks

### Implementation

- [x] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [x] Triển khai đầy đủ scope **Badge definition + auto-award engine**; nối route hoặc middleware vào entrypoint thực tế.
- [x] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [x] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [x] Đối chiếu kết quả với yêu cầu cốt lõi: 10 badge conditions, triggered on activity.

### Verification

- [x] Chạy lint/typecheck/test phù hợp với package bị thay đổi.
- [x] Ghi rõ command đã chạy và kết quả trong PR.
- [x] Kiểm tra không commit secret, file `.env` thật hoặc artifact local.
- [x] Nếu thay đổi contract dùng chung, cập nhật consumer hoặc ghi rõ follow-up dependency.

### Definition of Done

- [x] Code/config đã commit trên branch riêng và mở PR liên kết issue này.
- [x] PR mô tả phạm vi thay đổi, cách kiểm chứng và rủi ro còn lại.
- [x] CI xanh hoặc PR ghi rõ blocker có thể tái hiện.
- [x] Không còn TODO thuộc trực tiếp scope issue này.

## Dev Notes

### Source Issue

- GitHub issue: [#32](https://github.com/khovan123/philo-mind/issues/32)
- Task ID: `T-A16`
- Track: A - Backend Core
- Group: A-Platform APIs
- Milestone: Week 4
- Suggested owner: Backend Dev
- Assigned GitHub user(s): NTA1210
- Estimate: 5h
- Labels: `track:A-backend`, `priority:medium`, `type:backend`

### Dependencies

- Declared dependencies: `T-A09`
- Dependency rule: chỉ bắt đầu integration thật sau khi dependency đã merge hoặc có contract/mock được thống nhất.

### Implementation Guidance

- Backend follows Controller -> Service -> Repository-style boundaries where available.
- Use `/api/v1/` REST routes, standardized `{ success, data, error, meta }` response shape, and existing auth/validation middleware.
- Prefer Prisma schema relationships and typed DTOs from `@philo-mind/shared` over duplicated local shapes.
- Keep changes narrowly mapped to this story and do not absorb neighboring GitHub issues unless explicitly required by a dependency contract.
- If shared contracts change, update both producer and consumer or document the follow-up dependency clearly.

### Project Context Snapshot

- Backend stack: Express 5 + Prisma 7 + TypeScript, REST prefix `/api/v1/`.
- Frontend stack: Expo 56 + React Native + Expo Router + NativeWind + Redux Toolkit + Redux Persist.
- Shared package: `libs/shared` for DTOs, enums, constants, and cross-package contracts.
- Current architecture docs: `docs/project-context.md`, `docs/architecture.md`, `_bmad-output/implementation-artifacts/implementation-spec.md`.

### Original Issue Body

## T-A16: Badge definition + auto-award engine

### Mục tiêu

Hoàn thành **Badge definition + auto-award engine** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị         |
| ----------------- | --------------- |
| Track             | A: Backend Core |
| Nhóm              | A-Platform APIs |
| Owner gợi ý       | Backend Dev     |
| Estimate          | 5h              |
| Thời điểm dự kiến | Week 4          |
| Dependencies      | `T-A09`         |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Badge definition + auto-award engine**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: 10 badge conditions, triggered on activity.

### Acceptance Criteria

- [ ] 10 badge conditions
- [ ] triggered on activity

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

- Verified activity router validates schemas correctly via `activity.test.ts`.
- Confirmed `BadgeService.evaluateUserBadges` behaves correctly under different metrics (daily streaks, target thresholds, and notification triggers) using `badge.test.ts`.
- Validated local database re-seeding and table truncation via the guarded manual reset command: `cd services && CONFIRM_SEED_RESET=RESET npx tsx src/seed/reset.ts && npm run seed`.

### Completion Notes

- Created `activity.validator.ts` containing the validation schemas for manual activity logs and retrieval endpoints.
- Integrated Zod schema validation in `activity.routes.ts`.
- Wired `ActivityLogService.logActivity` within `reflection.service.ts` to log activities and evaluate badges automatically upon reflection creation.
- Aligned `data/10-badges.csv` with backend definitions (`BADGE_DEFINITIONS`) to seed 10 standard badges cleanly.
- Added comprehensive unit tests in `badge.test.ts` and `activity.test.ts` with all 75 tests passing.

### File List

- [activity.validator.ts](file:///Users/nguyenanh/Documents/SUBJECTS/MLN111/philo-mind/services/src/validators/activity.validator.ts) [NEW]
- [activity.routes.ts](file:///Users/nguyenanh/Documents/SUBJECTS/MLN111/philo-mind/services/src/routes/activity.routes.ts) [MODIFY]
- [reflection.service.ts](file:///Users/nguyenanh/Documents/SUBJECTS/MLN111/philo-mind/services/src/services/reflection.service.ts) [MODIFY]
- [10-badges.csv](file:///Users/nguyenanh/Documents/SUBJECTS/MLN111/philo-mind/data/10-badges.csv) [MODIFY]
- [badge.test.ts](file:///Users/nguyenanh/Documents/SUBJECTS/MLN111/philo-mind/services/src/__tests__/badge.test.ts) [NEW]
- [activity.test.ts](file:///Users/nguyenanh/Documents/SUBJECTS/MLN111/philo-mind/services/src/__tests__/activity.test.ts) [NEW]

## Change Log

| Date       | Version | Description                          | Author |
| ---------- | ------- | ------------------------------------ | ------ |
| 2026-05-31 | 0.1     | Story created from GitHub issue #32. | Codex  |

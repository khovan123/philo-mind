---
story_key: 8-1-topicperspective-api-crud-5-perspectives-per-topic
github_issue: 107
github_url: https://github.com/khovan123/philo-mind/issues/107
task_id: T-H01
status: ready-for-dev
priority: medium
track: H
type: backend
---

# Story 8-1-topicperspective-api-crud-5-perspectives-per-topic: TopicPerspective API (CRUD 5 perspectives per topic)

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **TopicPerspective API (CRUD 5 perspectives per topic)** theo issue GitHub [#107](https://github.com/khovan123/philo-mind/issues/107) để deliverable của task `T-H01` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria
- [ ] tech
- [ ] ethical
- [ ] economic
- [ ] social
- [ ] philosophical views

## Tasks/Subtasks

### Implementation
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **TopicPerspective API (CRUD 5 perspectives per topic)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: tech, ethical, economic, social, philosophical views.

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
- GitHub issue: [#107](https://github.com/khovan123/philo-mind/issues/107)
- Task ID: `T-H01`
- Track: H - Missing Features
- Group: H-MultiPerspective
- Milestone: Week 5
- Suggested owner: Fullstack Dev
- Assigned GitHub user(s): Ngoclee123
- Estimate: 3h
- Labels: `track:H-missing`, `priority:medium`, `type:backend`

### Dependencies
- Declared dependencies: `T-A04`, `T-A06`
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

## T-H01: TopicPerspective API (CRUD 5 perspectives per topic)

### Mục tiêu
Hoàn thành **TopicPerspective API (CRUD 5 perspectives per topic)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | H: Missing Features |
| Nhóm | H-MultiPerspective |
| Owner gợi ý | Fullstack Dev |
| Estimate | 3h |
| Thời điểm dự kiến | Week 5 |
| Dependencies | `T-A04`, `T-A06` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **TopicPerspective API (CRUD 5 perspectives per topic)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: tech, ethical, economic, social, philosophical views.

### Acceptance Criteria
- [ ] tech
- [ ] ethical
- [ ] economic
- [ ] social
- [ ] philosophical views

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

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-31 | 0.1 | Story created from GitHub issue #107. | Codex |

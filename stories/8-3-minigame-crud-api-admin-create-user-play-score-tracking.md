---
story_key: 8-3-minigame-crud-api-admin-create-user-play-score-tracking
github_issue: 109
github_url: https://github.com/khovan123/philo-mind/issues/109
task_id: T-H03
status: ready-for-dev
priority: medium
track: H
type: backend
---

# Story 8-3-minigame-crud-api-admin-create-user-play-score-tracking: MiniGame CRUD API (admin create, user play, score tracking)

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **MiniGame CRUD API (admin create, user play, score tracking)** theo issue GitHub [#109](https://github.com/khovan123/philo-mind/issues/109) để deliverable của task `T-H03` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria
- [ ] 3 game types: matching
- [ ] guess-who
- [ ] logic puzzle

## Tasks/Subtasks

### Implementation
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **MiniGame CRUD API (admin create, user play, score tracking)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: 3 game types: matching, guess-who, logic puzzle.

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
- GitHub issue: [#109](https://github.com/khovan123/philo-mind/issues/109)
- Task ID: `T-H03`
- Track: H - Missing Features
- Group: H-MiniGame
- Milestone: Week 6
- Suggested owner: Fullstack Dev
- Assigned GitHub user(s): kangdev03
- Estimate: 4h
- Labels: `track:H-missing`, `priority:medium`, `type:backend`

### Dependencies
- Declared dependencies: `T-A04`
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

## T-H03: MiniGame CRUD API (admin create, user play, score tracking)

### Mục tiêu
Hoàn thành **MiniGame CRUD API (admin create, user play, score tracking)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | H: Missing Features |
| Nhóm | H-MiniGame |
| Owner gợi ý | Fullstack Dev |
| Estimate | 4h |
| Thời điểm dự kiến | Week 6 |
| Dependencies | `T-A04` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **MiniGame CRUD API (admin create, user play, score tracking)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: 3 game types: matching, guess-who, logic puzzle.

### Acceptance Criteria
- [ ] 3 game types: matching
- [ ] guess-who
- [ ] logic puzzle

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
| 2026-05-31 | 0.1 | Story created from GitHub issue #109. | Codex |

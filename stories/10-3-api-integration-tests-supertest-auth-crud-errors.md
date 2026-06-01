---
story_key: 10-3-api-integration-tests-supertest-auth-crud-errors
github_issue: 121
github_url: https://github.com/khovan123/philo-mind/issues/121
task_id: T-J03
status: ready-for-dev
priority: medium
track: J
type: testing
---

# Story 10-3-api-integration-tests-supertest-auth-crud-errors: API integration tests (Supertest: auth + CRUD + errors)

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **API integration tests (Supertest: auth + CRUD + errors)** theo issue GitHub [#121](https://github.com/khovan123/philo-mind/issues/121) để deliverable của task `T-J03` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [ ] In-memory DB
- [ ] 30+ endpoint tests

## Tasks/Subtasks

### Implementation

- [ ] Bổ sung test suite cho **API integration tests (Supertest: auth + CRUD + errors)** theo runner hiện có của repo.
- [ ] Bao phủ happy path, validation failure và edge case quan trọng được nêu trong acceptance criteria.
- [ ] Giữ fixture deterministic; không phụ thuộc network hoặc secret ngoài nếu không cần thiết.
- [ ] Chạy test suite liên quan và ghi command cùng kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: In-memory DB, 30+ endpoint tests.

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

- GitHub issue: [#121](https://github.com/khovan123/philo-mind/issues/121)
- Task ID: `T-J03`
- Track: J - Testing
- Group: All
- Milestone: Week 7
- Suggested owner: Any Dev
- Assigned GitHub user(s): NguyenDat204
- Estimate: 4h
- Labels: `track:J-testing`, `priority:medium`, `type:testing`

### Dependencies

- Declared dependencies: `T-A05`
- Dependency rule: chỉ bắt đầu integration thật sau khi dependency đã merge hoặc có contract/mock được thống nhất.

### Implementation Guidance

- Add deterministic tests that can run in CI without real secrets or network-only dependencies.
- Keep fixtures explicit and isolated; mock Prisma/API boundaries where required by the task.
- Record exact validation commands and expected results in the PR notes.
- Keep changes narrowly mapped to this story and do not absorb neighboring GitHub issues unless explicitly required by a dependency contract.
- If shared contracts change, update both producer and consumer or document the follow-up dependency clearly.

### Project Context Snapshot

- Backend stack: Express 5 + Prisma 7 + TypeScript, REST prefix `/api/v1/`.
- Frontend stack: Expo 56 + React Native + Expo Router + NativeWind + Redux Toolkit + Redux Persist.
- Shared package: `libs/shared` for DTOs, enums, constants, and cross-package contracts.
- Current architecture docs: `docs/project-context.md`, `docs/architecture.md`, `_bmad-output/implementation-artifacts/implementation-spec.md`.

### Original Issue Body

## T-J03: API integration tests (Supertest: auth + CRUD + errors)

### Mục tiêu

Hoàn thành **API integration tests (Supertest: auth + CRUD + errors)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị    |
| ----------------- | ---------- |
| Track             | J: Testing |
| Nhóm              | All        |
| Owner gợi ý       | Any Dev    |
| Estimate          | 4h         |
| Thời điểm dự kiến | Week 7     |
| Dependencies      | `T-A05`    |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Bổ sung test suite cho **API integration tests (Supertest: auth + CRUD + errors)** theo runner hiện có của repo.
- [ ] Bao phủ happy path, validation failure và edge case quan trọng được nêu trong acceptance criteria.
- [ ] Giữ fixture deterministic; không phụ thuộc network hoặc secret ngoài nếu không cần thiết.
- [ ] Chạy test suite liên quan và ghi command cùng kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: In-memory DB, 30+ endpoint tests.

### Acceptance Criteria

- [ ] In-memory DB
- [ ] 30+ endpoint tests

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

| Date       | Version | Description                           | Author |
| ---------- | ------- | ------------------------------------- | ------ |
| 2026-05-31 | 0.1     | Story created from GitHub issue #121. | Codex  |

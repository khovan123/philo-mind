---
story_key: 6-8-scenario-debate-integration-tests
github_issue: 100
github_url: https://github.com/khovan123/philo-mind/issues/100
task_id: T-F08
status: ready-for-dev
priority: low
track: F
type: testing
---

# Story 6-8-scenario-debate-integration-tests: Scenario + Debate integration tests

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **Scenario + Debate integration tests** theo issue GitHub [#100](https://github.com/khovan123/philo-mind/issues/100) để deliverable của task `T-F08` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [ ] Full flow verification

## Tasks/Subtasks

### Implementation

- [ ] Bổ sung test suite cho **Scenario + Debate integration tests** theo runner hiện có của repo.
- [ ] Bao phủ happy path, validation failure và edge case quan trọng được nêu trong acceptance criteria.
- [ ] Giữ fixture deterministic; không phụ thuộc network hoặc secret ngoài nếu không cần thiết.
- [ ] Chạy test suite liên quan và ghi command cùng kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Full flow verification.

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

- GitHub issue: [#100](https://github.com/khovan123/philo-mind/issues/100)
- Task ID: `T-F08`
- Track: F - Scenario & Debate
- Group: F-Debate
- Milestone: Week 7
- Suggested owner: Fullstack Dev
- Assigned GitHub user(s): Ngoclee123
- Estimate: 2h
- Labels: `track:F-scenario`, `priority:low`, `type:testing`

### Dependencies

- Declared dependencies: `T-F04`, `T-F07`
- Dependency rule: chỉ bắt đầu integration thật sau khi dependency đã merge hoặc có contract/mock được thống nhất.

### Implementation Guidance

- Add deterministic tests that can run in CI without real secrets or network-only dependencies.
- Keep fixtures explicit and isolated; mock Prisma/API boundaries where required by the task.
- Record exact validation commands and expected results in the PR notes.
- Keep changes narrowly mapped to this story and do not absorb neighboring GitHub issues unless explicitly required by a dependency contract.
- If shared contracts change, update both producer and consumer or document the follow-up dependency clearly.

### Project Context Snapshot

- Backend stack: Express 5 + Prisma 7 + TypeScript, REST prefix `/api/v1/`.
- Frontend stack: Expo 56 + React Native + Expo Router + NativeWind + Zustand.
- Shared package: `libs/shared` for DTOs, enums, constants, and cross-package contracts.
- Current architecture docs: `docs/project-context.md`, `docs/architecture.md`, `_bmad-output/implementation-artifacts/implementation-spec.md`.

### Original Issue Body

## T-F08: Scenario + Debate integration tests

### Mục tiêu

Hoàn thành **Scenario + Debate integration tests** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị              |
| ----------------- | -------------------- |
| Track             | F: Scenario & Debate |
| Nhóm              | F-Debate             |
| Owner gợi ý       | Fullstack Dev        |
| Estimate          | 2h                   |
| Thời điểm dự kiến | Week 6               |
| Dependencies      | `T-F04`, `T-F07`     |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Bổ sung test suite cho **Scenario + Debate integration tests** theo runner hiện có của repo.
- [ ] Bao phủ happy path, validation failure và edge case quan trọng được nêu trong acceptance criteria.
- [ ] Giữ fixture deterministic; không phụ thuộc network hoặc secret ngoài nếu không cần thiết.
- [ ] Chạy test suite liên quan và ghi command cùng kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Full flow verification.

### Acceptance Criteria

- [ ] Full flow verification

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
| 2026-05-31 | 0.1     | Story created from GitHub issue #100. | Codex  |

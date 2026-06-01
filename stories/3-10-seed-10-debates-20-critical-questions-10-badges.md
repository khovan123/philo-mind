---
story_key: 3-10-seed-10-debates-20-critical-questions-10-badges
github_issue: 64
github_url: https://github.com/khovan123/philo-mind/issues/64
task_id: T-C10
status: ready-for-dev
priority: medium
track: C
type: seed-data
---

# Story 3-10-seed-10-debates-20-critical-questions-10-badges: Seed: 10 Debates + 20 Critical Questions + 10 Badges

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **Seed: 10 Debates + 20 Critical Questions + 10 Badges** theo issue GitHub [#64](https://github.com/khovan123/philo-mind/issues/64) để deliverable của task `T-C10` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [ ] Debate topics
- [ ] question types
- [ ] badge conditions

## Tasks/Subtasks

### Implementation

- [ ] Triển khai artifact dùng chung cho **Seed: 10 Debates + 20 Critical Questions + 10 Badges** tại package hoặc seed module phù hợp.
- [ ] Đảm bảo export/import rõ ràng để consumer dùng được mà không cần truy cập file nội bộ.
- [ ] Giữ enum, DTO hoặc seed data đồng bộ với schema và API contract hiện có.
- [ ] Chạy typecheck hoặc seed smoke check tương ứng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Debate topics, question types, badge conditions.

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

- GitHub issue: [#64](https://github.com/khovan123/philo-mind/issues/64)
- Task ID: `T-C10`
- Track: C - Shared Types & Seed
- Group: All
- Milestone: Week 3
- Suggested owner: Any Dev
- Assigned GitHub user(s): Thienhoang78
- Estimate: 3h
- Labels: `track:C-shared`, `priority:medium`, `type:seed-data`

### Dependencies

- Declared dependencies: Không có dependency bắt buộc.
- Dependency rule: chỉ bắt đầu integration thật sau khi dependency đã merge hoặc có contract/mock được thống nhất.

### Implementation Guidance

- Seed content must be deterministic, Vietnamese-first where user-facing, and compatible with Prisma schema constraints.
- Prefer reusable seed utilities in `services/src/seed/utils` and keep seed runner order stable.
- Avoid real secrets and avoid content that depends on local-only artifacts.
- Keep changes narrowly mapped to this story and do not absorb neighboring GitHub issues unless explicitly required by a dependency contract.
- If shared contracts change, update both producer and consumer or document the follow-up dependency clearly.

### Project Context Snapshot

- Backend stack: Express 5 + Prisma 7 + TypeScript, REST prefix `/api/v1/`.
- Frontend stack: Expo 56 + React Native + Expo Router + NativeWind + Zustand.
- Shared package: `libs/shared` for DTOs, enums, constants, and cross-package contracts.
- Current architecture docs: `docs/project-context.md`, `docs/architecture.md`, `_bmad-output/implementation-artifacts/implementation-spec.md`.

### Original Issue Body

## T-C10: Seed: 10 Debates + 20 Critical Questions + 10 Badges

### Mục tiêu

Hoàn thành **Seed: 10 Debates + 20 Critical Questions + 10 Badges** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| Track             | C: Shared Types & Seed Data   |
| Nhóm              | All                           |
| Owner gợi ý       | Any Dev                       |
| Estimate          | 3h                            |
| Thời điểm dự kiến | Week 3                        |
| Dependencies      | Không có dependency bắt buộc. |

### Dependency Notes

Task có thể bắt đầu ngay. Nếu phát hiện dependency ngầm, cập nhật issue trước khi tiếp tục.

### Checklist triển khai

- [ ] Triển khai artifact dùng chung cho **Seed: 10 Debates + 20 Critical Questions + 10 Badges** tại package hoặc seed module phù hợp.
- [ ] Đảm bảo export/import rõ ràng để consumer dùng được mà không cần truy cập file nội bộ.
- [ ] Giữ enum, DTO hoặc seed data đồng bộ với schema và API contract hiện có.
- [ ] Chạy typecheck hoặc seed smoke check tương ứng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Debate topics, question types, badge conditions.

### Acceptance Criteria

- [ ] Debate topics
- [ ] question types
- [ ] badge conditions

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
| 2026-05-31 | 0.1     | Story created from GitHub issue #64. | Codex  |

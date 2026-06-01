---
story_key: 6-1-schema-migration-scenarioperspective-scenarioframework
github_issue: 93
github_url: https://github.com/khovan123/philo-mind/issues/93
task_id: T-F01
status: ready-for-dev
priority: medium
track: F
type: fullstack
---

# Story 6-1-schema-migration-scenarioperspective-scenarioframework: Schema migration: ScenarioPerspective, ScenarioFramework

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **Schema migration: ScenarioPerspective, ScenarioFramework** theo issue GitHub [#93](https://github.com/khovan123/philo-mind/issues/93) để deliverable của task `T-F01` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [ ] New models
- [ ] stance fields

## Tasks/Subtasks

### Implementation

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Schema migration: ScenarioPerspective, ScenarioFramework**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: New models, stance fields.

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

- GitHub issue: [#93](https://github.com/khovan123/philo-mind/issues/93)
- Task ID: `T-F01`
- Track: F - Scenario & Debate
- Group: F-Scenario
- Milestone: Week 5
- Suggested owner: Fullstack Dev
- Assigned GitHub user(s): Ngoclee123
- Estimate: 2h
- Labels: `track:F-scenario`, `priority:medium`, `type:fullstack`

### Dependencies

- Declared dependencies: Không có dependency bắt buộc.
- Dependency rule: chỉ bắt đầu integration thật sau khi dependency đã merge hoặc có contract/mock được thống nhất.

### Implementation Guidance

- Follow existing monorepo conventions and shared contracts.
- Keep the implementation scoped to the linked GitHub issue.
- Keep changes narrowly mapped to this story and do not absorb neighboring GitHub issues unless explicitly required by a dependency contract.
- If shared contracts change, update both producer and consumer or document the follow-up dependency clearly.

### Project Context Snapshot

- Backend stack: Express 5 + Prisma 7 + TypeScript, REST prefix `/api/v1/`.
- Frontend stack: Expo 56 + React Native + Expo Router + NativeWind + Redux Toolkit + Redux Persist.
- Shared package: `libs/shared` for DTOs, enums, constants, and cross-package contracts.
- Current architecture docs: `docs/project-context.md`, `docs/architecture.md`, `_bmad-output/implementation-artifacts/implementation-spec.md`.

### Original Issue Body

## T-F01: Schema migration: ScenarioPerspective, ScenarioFramework

### Mục tiêu

Hoàn thành **Schema migration: ScenarioPerspective, ScenarioFramework** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| Track             | F: Scenario & Debate          |
| Nhóm              | F-Scenario                    |
| Owner gợi ý       | Fullstack Dev                 |
| Estimate          | 2h                            |
| Thời điểm dự kiến | Week 5                        |
| Dependencies      | Không có dependency bắt buộc. |

### Dependency Notes

Task có thể bắt đầu ngay. Nếu phát hiện dependency ngầm, cập nhật issue trước khi tiếp tục.

### Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Schema migration: ScenarioPerspective, ScenarioFramework**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: New models, stance fields.

### Acceptance Criteria

- [ ] New models
- [ ] stance fields

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
| 2026-05-31 | 0.1     | Story created from GitHub issue #93. | Codex  |

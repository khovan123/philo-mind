---
story_key: 4-10-step-3-dilemma-screen-dramatic-presentation
github_issue: 76
github_url: https://github.com/khovan123/philo-mind/issues/76
task_id: T-D10
status: ready-for-dev
priority: medium
track: D
type: frontend
---

# Story 4-10-step-3-dilemma-screen-dramatic-presentation: Step 3: DILEMMA screen (dramatic presentation)

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **Step 3: DILEMMA screen (dramatic presentation)** theo issue GitHub [#76](https://github.com/khovan123/philo-mind/issues/76) để deliverable của task `T-D10` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [ ] Stakes description
- [ ] atmospheric bg

## Tasks/Subtasks

### Implementation

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Step 3: DILEMMA screen (dramatic presentation)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Stakes description, atmospheric bg.

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

- GitHub issue: [#76](https://github.com/khovan123/philo-mind/issues/76)
- Task ID: `T-D10`
- Track: D - Story Mode Engine
- Group: D-Frontend
- Milestone: Week 5
- Suggested owner: Fullstack Dev
- Assigned GitHub user(s): dklinh05
- Estimate: 3h
- Labels: `track:D-story`, `priority:medium`, `type:frontend`

### Dependencies

- Declared dependencies: `T-D07`
- Dependency rule: chỉ bắt đầu integration thật sau khi dependency đã merge hoặc có contract/mock được thống nhất.

### Implementation Guidance

- Frontend follows Expo Router + React Native feature structure under `webapp/src`.
- Reuse shared UI primitives, NativeWind/design tokens, Zustand stores, and API client conventions before adding new abstractions.
- Cover loading, empty, error, interaction, and responsive mobile states for the affected screen/component.
- Keep changes narrowly mapped to this story and do not absorb neighboring GitHub issues unless explicitly required by a dependency contract.
- If shared contracts change, update both producer and consumer or document the follow-up dependency clearly.

### Project Context Snapshot

- Backend stack: Express 5 + Prisma 7 + TypeScript, REST prefix `/api/v1/`.
- Frontend stack: Expo 56 + React Native + Expo Router + NativeWind + Zustand.
- Shared package: `libs/shared` for DTOs, enums, constants, and cross-package contracts.
- Current architecture docs: `docs/project-context.md`, `docs/architecture.md`, `_bmad-output/implementation-artifacts/implementation-spec.md`.

### Original Issue Body

## T-D10: Step 3: DILEMMA screen (dramatic presentation)

### Mục tiêu

Hoàn thành **Step 3: DILEMMA screen (dramatic presentation)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị              |
| ----------------- | -------------------- |
| Track             | D: Story Mode Engine |
| Nhóm              | D-Frontend           |
| Owner gợi ý       | Fullstack Dev        |
| Estimate          | 3h                   |
| Thời điểm dự kiến | Week 4               |
| Dependencies      | `T-D07`              |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Step 3: DILEMMA screen (dramatic presentation)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Stakes description, atmospheric bg.

### Acceptance Criteria

- [ ] Stakes description
- [ ] atmospheric bg

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
| 2026-05-31 | 0.1     | Story created from GitHub issue #76. | Codex  |

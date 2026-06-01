---
story_key: 2-12-short-lesson-swipe-cards-hook-insight-conflict-vote
github_issue: 50
github_url: https://github.com/khovan123/philo-mind/issues/50
task_id: T-B12
status: ready-for-dev
priority: medium
track: B
type: frontend
---

# Story 2-12-short-lesson-swipe-cards-hook-insight-conflict-vote: Short Lesson swipe cards (hook-insight-conflict-vote)

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **Short Lesson swipe cards (hook-insight-conflict-vote)** theo issue GitHub [#50](https://github.com/khovan123/philo-mind/issues/50) để deliverable của task `T-B12` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [ ] TikTok-style vertical
- [ ] community stats

## Tasks/Subtasks

### Implementation

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Short Lesson swipe cards (hook→insight→conflict→vote)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: TikTok-style vertical, community stats.

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

- GitHub issue: [#50](https://github.com/khovan123/philo-mind/issues/50)
- Task ID: `T-B12`
- Track: B - Frontend Shell
- Group: B-Main Screens
- Milestone: Week 3
- Suggested owner: Frontend Dev
- Assigned GitHub user(s): anhthungye
- Estimate: 6h
- Labels: `track:B-frontend`, `priority:medium`, `type:frontend`

### Dependencies

- Declared dependencies: `T-B02`
- Dependency rule: chỉ bắt đầu integration thật sau khi dependency đã merge hoặc có contract/mock được thống nhất.

### Implementation Guidance

- Frontend follows Expo Router + React Native feature structure under `webapp/src`.
- Reuse shared UI primitives, NativeWind/design tokens, Redux Toolkit slices, and RTK Query API slice conventions before adding new abstractions.
- Cover loading, empty, error, interaction, and responsive mobile states for the affected screen/component.
- Keep changes narrowly mapped to this story and do not absorb neighboring GitHub issues unless explicitly required by a dependency contract.
- If shared contracts change, update both producer and consumer or document the follow-up dependency clearly.

### Project Context Snapshot

- Backend stack: Express 5 + Prisma 7 + TypeScript, REST prefix `/api/v1/`.
- Frontend stack: Expo 56 + React Native + Expo Router + NativeWind + Redux Toolkit + Redux Persist.
- Shared package: `libs/shared` for DTOs, enums, constants, and cross-package contracts.
- Current architecture docs: `docs/project-context.md`, `docs/architecture.md`, `_bmad-output/implementation-artifacts/implementation-spec.md`.

### Original Issue Body

## T-B12: Short Lesson swipe cards (hook→insight→conflict→vote)

### Mục tiêu

Hoàn thành **Short Lesson swipe cards (hook→insight→conflict→vote)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị           |
| ----------------- | ----------------- |
| Track             | B: Frontend Shell |
| Nhóm              | B-Main Screens    |
| Owner gợi ý       | Frontend Dev      |
| Estimate          | 6h                |
| Thời điểm dự kiến | Week 3-4          |
| Dependencies      | `T-B02`           |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Short Lesson swipe cards (hook→insight→conflict→vote)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: TikTok-style vertical, community stats.

### Acceptance Criteria

- [ ] TikTok-style vertical
- [ ] community stats

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
| 2026-05-31 | 0.1     | Story created from GitHub issue #50. | Codex  |

---
story_key: 4-9-step-2-learn-screen-swipeable-cards-concept-chips
github_issue: 75
github_url: https://github.com/khovan123/philo-mind/issues/75
task_id: T-D09
status: ready-for-dev
priority: medium
track: D
type: frontend
---

# Story 4-9-step-2-learn-screen-swipeable-cards-concept-chips: Step 2: LEARN screen (swipeable cards + concept chips)

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **Step 2: LEARN screen (swipeable cards + concept chips)** theo issue GitHub [#75](https://github.com/khovan123/philo-mind/issues/75) để deliverable của task `T-D09` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria
- [ ] Horizontal swipe
- [ ] progress dots
- [ ] concept highlight

## Tasks/Subtasks

### Implementation
- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Step 2: LEARN screen (swipeable cards + concept chips)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Horizontal swipe, progress dots, concept highlight.

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
- GitHub issue: [#75](https://github.com/khovan123/philo-mind/issues/75)
- Task ID: `T-D09`
- Track: D - Story Mode Engine
- Group: D-Frontend
- Milestone: Week 5
- Suggested owner: Fullstack Dev
- Assigned GitHub user(s): dklinh05
- Estimate: 5h
- Labels: `track:D-story`, `priority:medium`, `type:frontend`

### Dependencies
- Declared dependencies: `T-D07`
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

## T-D09: Step 2: LEARN screen (swipeable cards + concept chips)

### Mục tiêu
Hoàn thành **Step 2: LEARN screen (swipeable cards + concept chips)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | D: Story Mode Engine |
| Nhóm | D-Frontend |
| Owner gợi ý | Fullstack Dev |
| Estimate | 5h |
| Thời điểm dự kiến | Week 4 |
| Dependencies | `T-D07` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Step 2: LEARN screen (swipeable cards + concept chips)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Horizontal swipe, progress dots, concept highlight.

### Acceptance Criteria
- [ ] Horizontal swipe
- [ ] progress dots
- [ ] concept highlight

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
| 2026-05-31 | 0.1 | Story created from GitHub issue #75. | Codex |

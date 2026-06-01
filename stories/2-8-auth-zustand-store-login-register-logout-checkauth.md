---
story_key: 2-8-auth-zustand-store-login-register-logout-checkauth
github_issue: 46
github_url: https://github.com/khovan123/philo-mind/issues/46
task_id: T-B08
status: ready-for-dev
priority: high
track: B
type: frontend
---

# Story 2-8-auth-zustand-store-login-register-logout-checkauth: Auth Zustand store (login/register/logout/checkAuth)

## Status

ready-for-dev

## Story

Là developer của PhiloMind, tôi cần hoàn thành **Auth Zustand store (login/register/logout/checkAuth)** theo issue GitHub [#46](https://github.com/khovan123/philo-mind/issues/46) để deliverable của task `T-B08` có thể review, test và tích hợp độc lập trong monorepo.

## Acceptance Criteria

- [ ] Auto-redirect
- [ ] error clearing

## Tasks/Subtasks

### Implementation

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Auth Zustand store (login/register/logout/checkAuth)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Auto-redirect, error clearing.

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

- GitHub issue: [#46](https://github.com/khovan123/philo-mind/issues/46)
- Task ID: `T-B08`
- Track: B - Frontend Shell
- Group: B-Foundation
- Milestone: Week 2
- Suggested owner: Frontend Dev
- Assigned GitHub user(s): thuhataplamdev
- Estimate: 2h
- Labels: `track:B-frontend`, `priority:high`, `type:frontend`

### Dependencies

- Declared dependencies: `T-B07`
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

## T-B08: Auth Zustand store (login/register/logout/checkAuth)

### Mục tiêu

Hoàn thành **Auth Zustand store (login/register/logout/checkAuth)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị           |
| ----------------- | ----------------- |
| Track             | B: Frontend Shell |
| Nhóm              | B-Foundation      |
| Owner gợi ý       | Frontend Dev      |
| Estimate          | 2h                |
| Thời điểm dự kiến | Week 1-2          |
| Dependencies      | `T-B07`           |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Auth Zustand store (login/register/logout/checkAuth)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Auto-redirect, error clearing.

### Acceptance Criteria

- [ ] Auto-redirect
- [ ] error clearing

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
| 2026-05-31 | 0.1     | Story created from GitHub issue #46. | Codex  |

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repo = 'khovan123/philo-mind';
const root = process.cwd();
const today = '2026-05-31';
const byIdDir = join(root, 'issues', 'by-github-id');
const docsDir = join(root, 'docs');

const trackNames = {
  A: 'Backend Core',
  B: 'Frontend Shell',
  C: 'Shared Types & Seed',
  D: 'Story Mode Engine',
  E: 'AI & Chat System',
  F: 'Scenario & Debate',
  G: 'Polish & Gamification',
  H: 'Missing Features',
  I: 'DevOps & Deploy',
  J: 'Testing',
  K: 'Admin & Settings',
};

function gh(args, options = {}) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 80,
    ...options,
  });
}

function parseTask(issue) {
  const match = issue.title.match(/\[(T-([A-Z])(\d+))\]\s*(.+)$/);
  if (!match) return null;
  return {
    id: match[1],
    track: match[2],
    taskNo: Number(match[3]),
    title: match[4].trim(),
  };
}

function labels(issue) {
  return issue.labels.map((label) => label.name);
}

function typeOf(issue) {
  return labels(issue).find((label) => label.startsWith('type:'))?.replace('type:', '') ?? 'general';
}

function safeName(value) {
  return value
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

function logFileName(issue, task) {
  return `#${String(issue.number).padStart(3, '0')}-${task.id}-${safeName(task.title)}.md`;
}

function apiBase(task) {
  const t = task.title.toLowerCase();
  if (t.includes('auth') || t.includes('password') || t.includes('otp')) return '/api/v1/auth';
  if (t.includes('topicperspective')) return '/api/v1/topics/:topicId/perspectives';
  if (t.includes('topic')) return '/api/v1/topics';
  if (t.includes('short lesson')) return '/api/v1/short-lessons';
  if (t.includes('lesson')) return '/api/v1/lessons';
  if (t.includes('quiz')) return '/api/v1/quizzes';
  if (t.includes('progress')) return '/api/v1/progress';
  if (t.includes('reflection')) return '/api/v1/reflections';
  if (t.includes('critical question')) return '/api/v1/critical-questions';
  if (t.includes('mindmap')) return '/api/v1/mindmap';
  if (t.includes('bookmark')) return '/api/v1/bookmarks';
  if (t.includes('notification')) return '/api/v1/notifications';
  if (t.includes('badge')) return '/api/v1/badges';
  if (t.includes('activity')) return '/api/v1/activity';
  if (t.includes('moderation')) return '/api/v1/moderation';
  if (t.includes('story') || t.includes('consequence') || t.includes('analysis')) return '/api/v1/stories';
  if (t.includes('gemini')) return '/api/v1/ai/generate';
  if (t.includes('character')) return '/api/v1/ai/characters';
  if (t.includes('chat') || t.includes('sse') || t.includes('stream')) return '/api/v1/ai/chat';
  if (t.includes('scenario')) return '/api/v1/scenarios';
  if (t.includes('debate')) return '/api/v1/debates';
  if (t.includes('minigame')) return '/api/v1/minigames';
  if (t.includes('delete account')) return '/api/v1/account';
  return '/api/v1';
}

function screenRoute(task) {
  const t = task.title.toLowerCase();
  if (t.includes('login')) return '/login';
  if (t.includes('register')) return '/register';
  if (t.includes('forgot') || t.includes('reset') || t.includes('otp')) return '/forgot-password -> /verify-otp -> /reset-password';
  if (t.includes('settings')) return '/settings';
  if (t.includes('delete account')) return '/delete-account';
  if (t.includes('terms') || t.includes('privacy')) return '/settings/legal';
  if (t.includes('home')) return '/(tabs)/home';
  if (t.includes('explore')) return '/(tabs)/explore';
  if (t.includes('profile')) return '/(tabs)/profile';
  if (t.includes('lesson')) return '/lessons/[id]';
  if (t.includes('quiz')) return '/quiz/[lessonId]';
  if (t.includes('story list')) return '/(tabs)/story';
  if (t.includes('intro')) return '/story/[id]';
  if (t.includes('learn')) return '/story/[id]/learn';
  if (t.includes('dilemma')) return '/story/[id]/play';
  if (t.includes('choose')) return '/story/[id]/choose';
  if (t.includes('consequence')) return '/story/[id]/result';
  if (t.includes('knowledge')) return '/story/[id]/knowledge';
  if (t.includes('reflect')) return '/story/[id]/reflect';
  if (t.includes('character')) return '/ai/characters';
  if (t.includes('chat')) return '/ai/chat/[sessionId]';
  if (t.includes('scenario')) return '/scenarios/[id]';
  if (t.includes('debate')) return '/debates/[id]';
  if (t.includes('minigame')) return '/minigames/[id]';
  if (t.includes('notification')) return '/notifications';
  if (t.includes('journal') || t.includes('reflection')) return '/journal';
  if (t.includes('mindmap')) return '/mindmap';
  if (t.includes('bookmark')) return '/bookmarks';
  return '/';
}

function featureSummary(task) {
  const t = task.title.toLowerCase();
  if (t.includes('auth') || t.includes('login') || t.includes('register') || t.includes('password') || t.includes('token')) {
    return 'Người dùng có thể tạo tài khoản, đăng nhập, duy trì phiên, làm mới token và đăng xuất/khôi phục mật khẩu mà không mất dữ liệu học tập cá nhân.';
  }
  if (t.includes('topic')) return 'Người học duyệt và mở đúng chủ đề triết học theo danh mục, độ khó, tìm kiếm và nội dung liên quan.';
  if (t.includes('lesson') || t.includes('quiz')) return 'Người học đọc bài, trả lời quiz/micro-lesson, nhận kết quả và tiến độ được cập nhật rõ ràng.';
  if (t.includes('story') || t.includes('consequence') || t.includes('analysis')) return 'Người học đi qua story mode nhiều bước: hiểu bối cảnh, học khái niệm, chọn quyết định, xem hệ quả, so sánh cộng đồng và phản tư.';
  if (t.includes('ai') || t.includes('gemini') || t.includes('chat') || t.includes('character') || t.includes('stream')) return 'Người học trò chuyện với nhân vật triết học AI theo ngữ cảnh học tập, có phản hồi an toàn, streaming và lịch sử hội thoại.';
  if (t.includes('scenario') || t.includes('debate')) return 'Người học phân tích tình huống đời thực hoặc tranh luận qua nhiều góc nhìn, lập luận, vote/comment và nhìn lại lập trường.';
  if (t.includes('badge') || t.includes('activity') || t.includes('streak') || t.includes('notification') || t.includes('leaderboard') || t.includes('minigame')) return 'Người học nhận động lực quay lại app qua tiến độ, streak, badge, mini-game, thông báo và bảng xếp hạng.';
  if (t.includes('profile') || t.includes('settings') || t.includes('terms') || t.includes('privacy') || t.includes('delete account')) return 'Người dùng quản lý hồ sơ, cài đặt, pháp lý và quyền riêng tư/tài khoản của mình trong app.';
  if (t.includes('seed') || t.includes('shared types')) return 'Developer và app có contract/dữ liệu nền ổn định để các màn hình/API dùng chung không đoán field hoặc thiếu nội dung demo.';
  if (t.includes('test') || t.includes('ci')) return 'Team có kiểm chứng tự động cho flow quan trọng để phát hiện regression trước khi merge/deploy.';
  return `Đầu ra là một phần tính năng hoàn chỉnh cho ${task.title}, có hành vi quan sát được qua UI, API hoặc test.`;
}

function outputItems(task, issueType) {
  const t = task.title.toLowerCase();
  if (issueType === 'backend') {
    return [
      `Một hoặc nhiều endpoint dưới \`${apiBase(task)}\` hoạt động với request hợp lệ và trả response chuẩn \`{ success, data, meta? }\`.`,
      'Validation trả lỗi rõ ràng khi thiếu field, sai kiểu, record không tồn tại hoặc user không đủ quyền.',
      'Dữ liệu được ghi/đọc qua Prisma đúng quan hệ schema, không tạo duplicate ngoài ý muốn và không trả field nhạy cảm.',
      'Frontend/test có thể dùng response ngay mà không phải đoán tên field hoặc tự tính business logic chính.',
    ];
  }
  if (issueType === 'frontend') {
    return [
      `Một màn hình/flow tại \`${screenRoute(task)}\` render được trạng thái loading, empty, error và success.`,
      'Các CTA chính có hành động cụ thể: submit, mở detail, chuyển bước, quay lại list, hoặc mở link ngoài/nội bộ đúng route.',
      'State sau thao tác được cập nhật trong store/API cache để màn hình kế tiếp hiển thị đúng dữ liệu mới.',
      'Layout usable trên mobile, keyboard-aware khi có form, không có màn hình trắng hoặc nút bấm không phản hồi.',
    ];
  }
  if (issueType === 'fullstack') {
    return [
      `Backend expose API dưới \`${apiBase(task)}\`, frontend gọi API đó từ route \`${screenRoute(task)}\`.`,
      'Người dùng hoàn thành được flow end-to-end từ màn hình vào form/action tới response thành công/lỗi rõ ràng.',
      'API contract và UI state thống nhất: field nào backend trả thì frontend render trực tiếp field đó.',
      'Nếu dependency chưa xong, có adapter/mock cùng shape và ghi rõ điểm thay bằng API thật.',
    ];
  }
  if (issueType === 'seed-data') {
    return [
      'Seed runner tạo được record cha/con đúng thứ tự và id/slug ổn định cho demo/test.',
      'Nội dung user-facing có tiếng Việt đủ title, mô tả, body markdown hoặc metadata cần render.',
      'Chạy lại seed không tạo duplicate hoặc phá quan hệ hiện có.',
      'Các issue frontend/backend liên quan có thể dùng dữ liệu seed để kiểm thử flow thật.',
    ];
  }
  if (issueType === 'testing') {
    return [
      'Test suite fail khi flow/contract chính bị phá và pass ổn định khi tính năng đúng.',
      'Test mô phỏng input/output hoặc thao tác người dùng thật thay vì chỉ kiểm implementation detail.',
      'Fixture deterministic, không cần secret thật hoặc network ngoài nếu không bắt buộc.',
      'CI/log chỉ ra lỗi nằm ở validation, API contract, UI render, navigation hay data persistence.',
    ];
  }
  if (issueType === 'devops') {
    return [
      'Developer/CI/deploy có command hoặc config chạy được, tái lập được và có output quan sát được.',
      'Environment/config không chứa secret thật, có ví dụ rõ cho local và production.',
      'Failure mode có log đủ để biết thiếu env, lỗi build, lỗi migration hay lỗi service health.',
      'Kết quả cuối được liên kết với GitHub issue và có bằng chứng chạy thành công.',
    ];
  }
  return [
    'Output phải quan sát được bằng UI, API hoặc command/test.',
    'Có input hợp lệ, output thành công và output lỗi được mô tả rõ.',
    'Có liên kết trực tiếp tới issue, PR hoặc log kiểm chứng.',
  ];
}

function inputs(task, issueType) {
  const t = task.title.toLowerCase();
  if (t.includes('login')) return ['email', 'password', 'submit action', 'auth API response'];
  if (t.includes('register')) return ['fullName/displayName', 'email', 'password', 'confirmPassword', 'password strength rules'];
  if (t.includes('password') || t.includes('otp')) return ['email', 'OTP code', 'newPassword', 'confirmPassword'];
  if (t.includes('topic')) return ['page/limit', 'search keyword', 'category', 'difficulty', 'topicId when opening detail'];
  if (t.includes('lesson')) return ['topicId', 'lessonId', 'markdown content', 'question/answer payload'];
  if (t.includes('quiz')) return ['quizId', 'attemptId', 'questionId', 'selected answer', 'timeSpentSeconds'];
  if (t.includes('story')) return ['storyId', 'sessionId', 'choiceId', 'reasoning', 'timeSpentSeconds'];
  if (t.includes('chat') || t.includes('gemini')) return ['characterId', 'sessionId', 'message content', 'conversation context'];
  if (t.includes('scenario')) return ['scenarioId', 'initialPosition', 'selected perspective/framework', 'reflection text'];
  if (t.includes('debate')) return ['debateId', 'stance', 'argument content', 'vote value', 'comment content'];
  if (t.includes('minigame')) return ['gameId', 'game config', 'user answers/actions', 'timeSpentSeconds'];
  if (issueType === 'seed-data') return ['seed data source', 'Prisma schema', 'stable slug/id mapping'];
  if (issueType === 'testing') return ['fixture data', 'mocked services', 'user/API actions under test'];
  if (issueType === 'devops') return ['env vars', 'config files', 'CI/deploy command', 'service credentials via secrets'];
  return ['request params/query/body or user action relevant to this issue'];
}

function successState(task, issueType) {
  if (issueType === 'frontend' || issueType === 'fullstack') {
    return `User thao tác trên \`${screenRoute(task)}\`, thấy dữ liệu/render đúng, CTA chính chuyển sang bước kế tiếp hoặc cập nhật UI ngay.`;
  }
  if (issueType === 'backend') {
    return `Client gọi \`${apiBase(task)}\`, nhận HTTP 2xx với data đủ field để consumer render/lưu state.`;
  }
  if (issueType === 'testing') return 'Command test chạy xanh, đồng thời test có assertion đủ mạnh để bắt regression.';
  if (issueType === 'seed-data') return 'Seed chạy xong và database có dữ liệu đúng quan hệ, app có thể mở demo content.';
  if (issueType === 'devops') return 'Command/build/deploy chạy thành công và có log/URL/status chứng minh kết quả.';
  return 'Output thành công được ghi nhận bằng UI/API/test/log.';
}

function emptyErrorStates(task, issueType) {
  if (issueType === 'frontend' || issueType === 'fullstack') {
    return [
      'Loading: hiển thị skeleton/spinner và disable CTA gây duplicate submit.',
      'Empty: hiển thị thông báo ngắn + CTA hợp lý thay vì màn hình trắng.',
      'Error: hiển thị message có thể hành động, cho retry hoặc quay lại flow an toàn.',
    ];
  }
  if (issueType === 'backend') {
    return [
      '400 cho input sai shape hoặc thiếu field bắt buộc.',
      '401/403 cho user chưa đăng nhập hoặc không đủ role.',
      '404 cho record không tồn tại; 409 cho duplicate/constraint conflict khi phù hợp.',
    ];
  }
  if (issueType === 'testing') return ['Test phải có case failure có chủ đích, không chỉ happy path.', 'Khi fixture thiếu/sai, lỗi test phải đọc được nguyên nhân.'];
  return ['Mô tả rõ trạng thái rỗng, lỗi và retry/recovery tương ứng.'];
}

function navigation(task, issueType) {
  const t = task.title.toLowerCase();
  if (!(issueType === 'frontend' || issueType === 'fullstack')) return [];
  if (t.includes('login')) return ['"Đăng nhập" -> `/(tabs)/home` khi success.', '"Tạo tài khoản" -> `/register`.', '"Quên mật khẩu" -> `/forgot-password`.'];
  if (t.includes('story')) return ['Story list -> intro -> learn -> dilemma/choose -> result -> knowledge -> reflect.', 'Back/continue giữ `storyId` và `sessionId`.'];
  if (t.includes('chat') || t.includes('character')) return ['Character card -> create/open session -> `/ai/chat/[sessionId]`.', 'Send message giữ user ở conversation và stream response inline.'];
  if (t.includes('scenario')) return ['Scenario card -> scenario detail.', 'Respond/rethink CTA -> form -> updated perspective/stats view.'];
  if (t.includes('debate')) return ['Debate card -> detail split FOR/AGAINST.', 'Argue CTA -> editor/preview -> submitted argument.'];
  if (t.includes('terms') || t.includes('privacy')) return ['Settings/Profile -> Terms/Privacy.', 'Internal href dùng app route; external href mở browser.'];
  if (t.includes('minigame')) return ['Game card -> play screen.', 'Finish -> result/leaderboard; replay -> new attempt.'];
  return [`Primary CTA trên \`${screenRoute(task)}\` phải dẫn tới detail, submit hoặc bước kế tiếp rõ ràng.`];
}

function featureOutputSection(issue) {
  const task = parseTask(issue);
  const issueType = typeOf(issue);
  const nav = navigation(task, issueType);
  return `## Feature Output Contract

> Added by BMAD Advanced Elicitation on ${today}. This section defines the concrete product output expected from issue #${issue.number} / \`${task.id}\`, beyond implementation process notes.

### User-facing outcome

${featureSummary(task)}

### Inputs

${inputs(task, issueType).map((item) => `- ${item}`).join('\n')}

### Expected output

${outputItems(task, issueType).map((item) => `- ${item}`).join('\n')}

### Success state

- ${successState(task, issueType)}

### Empty/error/loading states

${emptyErrorStates(task, issueType).map((item) => `- ${item}`).join('\n')}

${nav.length ? `### Navigation and interaction\n\n${nav.map((item) => `- ${item}`).join('\n')}\n` : ''}### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #${issue.number} and mention \`${task.id}\`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.
`;
}

function upsertFeatureOutput(body, section) {
  const marker = '## Feature Output Contract';
  if (!body.includes(marker)) {
    const insertBefore = body.includes('## Status Log') ? body.indexOf('## Status Log') : -1;
    if (insertBefore >= 0) {
      return `${body.slice(0, insertBefore).trim()}\n\n${section}\n${body.slice(insertBefore).trim()}\n`;
    }
    return `${body.trim()}\n\n${section}\n`;
  }
  const start = body.indexOf(marker);
  const next = body.slice(start + marker.length).search(/\n## /);
  if (next < 0) return `${body.slice(0, start).trim()}\n\n${section}\n`;
  const end = start + marker.length + next;
  return `${body.slice(0, start).trim()}\n\n${section}\n${body.slice(end).trim()}\n`;
}

function localIssueMarkdown(issue, body) {
  const task = parseTask(issue);
  return `# ${task.id}: ${task.title}

## GitHub Link

- Issue: [#${issue.number}](${issue.html_url})
- State: ${issue.state}
- Track: ${task.track} - ${trackNames[task.track] ?? 'Unknown'}
- Type: ${typeOf(issue)}
- Updated at: ${issue.updated_at}

${body}
`;
}

function table(rows) {
  return rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
}

function docsSummary(issues) {
  const rows = issues.map((issue) => {
    const task = parseTask(issue);
    return [
      `#${issue.number}`,
      `\`${task.id}\``,
      trackNames[task.track] ?? task.track,
      issue.state,
      typeOf(issue),
      task.title.replace(/\|/g, '/'),
    ];
  });
  const openCount = issues.filter((issue) => issue.state === 'open').length;
  const closedCount = issues.filter((issue) => issue.state === 'closed').length;
  return `# Feature Output Contracts

> Last updated: ${today}
> Source: GitHub issues in \`${repo}\`

## Summary

- Total issues with feature output contract: ${issues.length}
- Open: ${openCount}
- Closed: ${closedCount}
- Purpose: make every issue state the concrete feature output, not only code process, lint, or design-pattern steps.

## How To Use

- Developers implement against the \`Feature Output Contract\` section in the GitHub issue first.
- PRs must include evidence for the contract: screenshot, API sample, test output, seed log, or deploy/CI log.
- If behavior changes, update both the GitHub issue and local docs in the same PR.

## Issue Index

| GitHub | Task | Track | State | Type | Feature |
| --- | --- | --- | --- | --- | --- |
${table(rows)}
`;
}

const rawIssues = JSON.parse(gh(['api', `repos/${repo}/issues?state=all&per_page=100`, '--paginate']));
const issues = rawIssues
  .filter((issue) => !issue.pull_request)
  .filter((issue) => parseTask(issue))
  .sort((a, b) => a.number - b.number);

mkdirSync(byIdDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

let patched = 0;
for (const issue of issues) {
  const section = featureOutputSection(issue);
  const nextBody = upsertFeatureOutput(issue.body ?? '', section);
  if (nextBody !== (issue.body ?? '')) {
    gh(['api', '-X', 'PATCH', `repos/${repo}/issues/${issue.number}`, '-f', `body=${nextBody}`], { stdio: 'ignore' });
    patched += 1;
  }
  const task = parseTask(issue);
  const localPath = join(byIdDir, logFileName(issue, task));
  writeFileSync(localPath, localIssueMarkdown(issue, nextBody));
}

writeFileSync(join(docsDir, 'feature-output-contracts.md'), docsSummary(issues));
writeFileSync(join(root, 'issues', 'feature-output-contracts.md'), docsSummary(issues));

console.log(JSON.stringify({ total: issues.length, patched }, null, 2));

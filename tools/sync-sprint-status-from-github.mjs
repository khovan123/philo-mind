import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repo = 'khovan123/philo-mind';
const root = process.cwd();
const today = '2026-05-31';
const issueLogDir = join(root, 'issues', 'by-github-id');
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
    maxBuffer: 1024 * 1024 * 40,
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

function safeName(value) {
  return value
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

function labels(issue) {
  return issue.labels.map((label) => label.name);
}

function statusOf(issue) {
  return issue.state === 'closed' ? 'done' : 'open';
}

function priorityOf(issue) {
  return labels(issue).find((label) => label.startsWith('priority:'))?.replace('priority:', '') ?? 'unspecified';
}

function typeOf(issue) {
  return labels(issue).find((label) => label.startsWith('type:'))?.replace('type:', '') ?? 'unspecified';
}

function assigneesOf(issue) {
  return issue.assignees.map((assignee) => `@${assignee.login}`).join(', ') || 'Unassigned';
}

function logFileName(issue, task) {
  const padded = String(issue.number).padStart(3, '0');
  return `#${padded}-${task.id}-${safeName(task.title)}.md`;
}

function statusLogSection(issue, task, localPath) {
  const current = issue.state === 'closed' ? 'DONE' : 'OPEN';
  const closedText = issue.closed_at ? ` Closed at: ${issue.closed_at}.` : '';
  return `## Status Log

- ${today}: BMAD sprint-status sync checked GitHub issue #${issue.number} for \`${task.id}\`. Current source-of-truth status: **${current}**.${closedText} Local log: \`${localPath}\`.
`;
}

function ensureStatusLog(body, section) {
  if (!body || !body.includes('## Status Log')) {
    return `${body?.trim() ?? ''}\n\n${section}`.trim() + '\n';
  }
  return body;
}

function issueMarkdown(issue, task, localPath) {
  const state = statusOf(issue);
  const closed = issue.closed_at ? issue.closed_at : '';
  return `# ${task.id}: ${task.title}

## GitHub Link

- Issue: [#${issue.number}](${issue.html_url})
- State: ${state}
- Track: ${task.track} - ${trackNames[task.track] ?? 'Unknown'}
- Type: ${typeOf(issue)}
- Priority: ${priorityOf(issue)}
- Milestone: ${issue.milestone?.title ?? 'Unassigned'}
- Assignees: ${assigneesOf(issue)}
- Updated at: ${issue.updated_at}
${closed ? `- Closed at: ${closed}\n` : ''}
## Current Sprint Status

${issue.state === 'closed' ? '- [x] Done on GitHub. Treat this task as complete unless reopened.' : '- [ ] Open on GitHub. Treat this task as remaining work.'}

## Status Log

- ${today}: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #${issue.number} / \`${task.id}\`.

## Required Follow-up

${issue.state === 'closed' ? '- No implementation follow-up required from sprint-status unless QA reopens the issue.' : '- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.'}

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #${issue.number} |
| Task ID | ${task.id} |
| Title | ${task.title} |
| State | ${state} |
| Local log path | \`${localPath}\` |

## Issue Body

${(issue.body ?? '_No body_').trim()}
`;
}

function markdownTable(rows) {
  return rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
}

function summaryMarkdown(issues, missingLogsUpdated, localLogsCreated) {
  const total = issues.length;
  const done = issues.filter((issue) => issue.state === 'closed').length;
  const open = issues.filter((issue) => issue.state === 'open').length;
  const byTrack = Object.keys(trackNames).map((track) => {
    const items = issues.filter((issue) => parseTask(issue)?.track === track);
    return [
      `Track ${track}`,
      trackNames[track],
      String(items.length),
      String(items.filter((issue) => issue.state === 'closed').length),
      String(items.filter((issue) => issue.state === 'open').length),
    ];
  });
  const openByPriority = ['high', 'medium', 'low', 'unspecified']
    .map((priority) => [priority, String(issues.filter((issue) => issue.state === 'open' && priorityOf(issue) === priority).length)])
    .filter(([, count]) => count !== '0');
  const openIssues = issues
    .filter((issue) => issue.state === 'open')
    .sort((a, b) => a.number - b.number)
    .map((issue) => {
      const task = parseTask(issue);
      return `- [ ] #${issue.number} \`${task.id}\` ${task.title} (${trackNames[task.track]}, ${priorityOf(issue)}, ${assigneesOf(issue)})`;
    });
  const closedRecent = issues
    .filter((issue) => issue.state === 'closed')
    .sort((a, b) => `${b.closed_at}`.localeCompare(`${a.closed_at}`))
    .slice(0, 20)
    .map((issue) => {
      const task = parseTask(issue);
      return `- [x] #${issue.number} \`${task.id}\` ${task.title} (closed ${issue.closed_at})`;
    });
  const nextOpen = issues
    .filter((issue) => issue.state === 'open')
    .sort((a, b) => {
      const ta = parseTask(a);
      const tb = parseTask(b);
      return ta.track.localeCompare(tb.track) || ta.taskNo - tb.taskNo || a.number - b.number;
    })[0];
  const nextTask = nextOpen ? parseTask(nextOpen) : null;

  const missingStatusLogsNow = issues.filter((issue) => !(issue.body ?? '').includes('## Status Log')).length;

  return `# PhiloMind Sprint Status From GitHub Issues

> Last sync: ${today}
> Source of truth: GitHub issues in \`${repo}\`

## Summary

- Total tracked GitHub issues: ${total}
- Done / closed: ${done}
- Open / remaining: ${open}
- Completion: ${Math.round((done / total) * 100)}%
- Local issue logs available: ${total}
- GitHub issues currently missing Status Log: ${missingStatusLogsNow}
- Sync action this run: ${localLogsCreated} new local logs, ${missingLogsUpdated} GitHub bodies patched

## Progress By Track

| Track | Name | Total | Done | Open |
| --- | --- | ---: | ---: | ---: |
${markdownTable(byTrack)}

## Open Issues By Priority

| Priority | Open |
| --- | ---: |
${markdownTable(openByPriority)}

## Next Recommended Work

${nextOpen ? `Run dev/review workflow for #${nextOpen.number} \`${nextTask.id}\` ${nextTask.title}.` : 'All tracked GitHub issues are closed.'}

## Risks

- GitHub state only distinguishes open vs closed; it does not reliably show in-progress or review unless the team uses issue labels or project fields for those states.
- Local BMAD \`_bmad-output\` is ignored by Git, so this report and \`issues/by-github-id/\` are the tracked local docs for sprint visibility.
- Some tasks may be implemented through PRs while issue state stays open; keep issue state updated after merge to avoid stale plan status.

## Open Issues

${openIssues.join('\n') || 'No open issues.'}

## Recently Closed Issues

${closedRecent.join('\n') || 'No closed issues.'}
`;
}

const rawIssues = JSON.parse(gh(['api', `repos/${repo}/issues?state=all&per_page=100`, '--paginate']));
const allIssues = rawIssues
  .filter((issue) => !issue.pull_request)
  .map((issue) => ({ ...issue, task: parseTask(issue) }))
  .filter((issue) => issue.task)
  .sort((a, b) => a.number - b.number);

mkdirSync(issueLogDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

let localLogsCreated = 0;
let missingLogsUpdated = 0;

for (const issue of allIssues) {
  const localRelPath = `issues/by-github-id/${logFileName(issue, issue.task)}`;
  const localAbsPath = join(root, localRelPath);
  const existed = existsSync(localAbsPath);
  writeFileSync(localAbsPath, issueMarkdown(issue, issue.task, localRelPath));
  if (!existed) localLogsCreated += 1;

  const section = statusLogSection(issue, issue.task, localRelPath);
  const nextBody = ensureStatusLog(issue.body ?? '', section);
  if (nextBody !== (issue.body ?? '')) {
    gh(['api', '-X', 'PATCH', `repos/${repo}/issues/${issue.number}`, '-f', `body=${nextBody}`], { stdio: 'ignore' });
    missingLogsUpdated += 1;
  }
}

const summary = summaryMarkdown(allIssues, missingLogsUpdated, localLogsCreated);
writeFileSync(join(root, 'issues', 'sprint-status.md'), summary);
writeFileSync(join(root, 'docs', 'sprint-status.md'), summary);

// Sync the local sprint-status.yaml with the closed GitHub issues
const sprintStatusYamlPath = join(root, '_bmad-output', 'implementation-artifacts', 'sprint-status.yaml');
let updatedYamlCount = 0;
if (existsSync(sprintStatusYamlPath)) {
  let yamlContent = readFileSync(sprintStatusYamlPath, 'utf8');
  yamlContent = yamlContent.split('\n').map(line => {
    const match = line.match(/^(\s+)([^#:]+):\s*([a-zA-Z0-9_-]+)(\s+#\s*GitHub\s*#(\d+))/i);
    if (match) {
      const [full, indent, key, status, comment, issueNum] = match;
      const issueNumber = Number(issueNum);
      const issue = allIssues.find(i => i.number === issueNumber);
      if (issue && issue.state === 'closed' && status !== 'done') {
        updatedYamlCount++;
        return `${indent}${key}: done${comment}`;
      }
    }
    return line;
  }).join('\n');
  
  if (updatedYamlCount > 0) {
    writeFileSync(sprintStatusYamlPath, yamlContent, 'utf8');
  }
}

console.log(JSON.stringify({
  total: allIssues.length,
  done: allIssues.filter((issue) => issue.state === 'closed').length,
  open: allIssues.filter((issue) => issue.state === 'open').length,
  localLogsCreated,
  missingLogsUpdated,
  updatedYamlCount,
}, null, 2));

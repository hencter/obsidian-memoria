// ================= Memo 解析器 =================
// 负责把 YYYY-MM-DD.md（日记格式）或 YYYY.md（旧格式）文件解析成 Memo[]
// 以及把 Memo 序列化回文件

import { Memo, PIN_TAG, STAR_TAG } from "./types";

const WEEKDAY_CN = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const DATE_FROM_FILENAME_RE = /[/\\]?(\d{4})-(\d{2})-(\d{2})\.md$/;

export function extractDateFromPath(filePath: string): string | null {
  const m = filePath.match(DATE_FROM_FILENAME_RE);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

/**
 * 解析一个 md 文件内容，抽出所有 memo。
 *
 * 识别规则（新格式 YYYY-MM-DD.md —— 日记格式）：
 *   文件名即日期，内容直接是 memo 列表：
 *   - 12:43 内容内容        <- 一条 memo
 *     (缩进 2 空格的后续行视作同一条 memo 的多行内容)
 *
 * 旧格式（YYYY.md）兼容：
 *   ## 2026-04-25 周六      <- 日期分组
 *   - 12:43 内容内容
 */
export function parseFile(filePath: string, raw: string): Memo[] {
  const lines = raw.split(/\r?\n/);
  const memos: Memo[] = [];

  const resolvedDate = extractDateFromPath(filePath);
  const dateHeaderRe = /^##\s+(\d{4}-\d{2}-\d{2})(?:\s+.+)?$/;
  const memoStartRe = /^-\s+(\d{2}:\d{2})\s?(.*)$/;

  if (resolvedDate) {
    parseFlat(lines, resolvedDate, filePath, memos);
  } else {
    let currentDate = "";
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const dm = line.match(dateHeaderRe);
      if (dm) {
        currentDate = dm[1];
        i++;
        continue;
      }
      const mm = line.match(memoStartRe);
      if (mm && currentDate) {
        i = extractMemo(lines, i, mm, currentDate, filePath, memos);
        continue;
      }
      i++;
    }
  }
  return memos;
}

function parseFlat(lines: string[], date: string, filePath: string, out: Memo[]): void {
  const memoStartRe = /^-\s+(\d{2}:\d{2})\s?(.*)$/;
  let i = 0;
  while (i < lines.length) {
    const mm = lines[i].match(memoStartRe);
    if (mm) {
      i = extractMemo(lines, i, mm, date, filePath, out);
      continue;
    }
    i++;
  }
}

function extractMemo(
  lines: string[],
  startIdx: number,
  mm: RegExpMatchArray,
  currentDate: string,
  filePath: string,
  out: Memo[]
): number {
  const memoStartRe = /^-\s+(\d{2}:\d{2})\s?(.*)$/;
  const dateHeaderRe = /^##\s+(\d{4}-\d{2}-\d{2})(?:\s+.+)?$/;
  const time = mm[1];
  const firstLine = mm[2] ?? "";
  const startLine = startIdx;
  const bodyLines: string[] = [firstLine];
  let i = startIdx + 1;
  while (i < lines.length) {
    const next = lines[i];
    if (memoStartRe.test(next) || dateHeaderRe.test(next)) break;
    if (/^#\s+\d{4}\s*$/.test(next)) break;
    if (next.startsWith("  ")) {
      bodyLines.push(next.slice(2));
      i++;
      continue;
    }
    if (next.trim() === "") {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j >= lines.length) break;
      const peek = lines[j];
      if (memoStartRe.test(peek) || dateHeaderRe.test(peek)) break;
      if (/^#\s+\d{4}\s*$/.test(peek)) break;
      if (peek.startsWith("  ")) {
        for (let k = i; k < j; k++) bodyLines.push("");
        i = j;
        continue;
      }
      break;
    }
    break;
  }
  const endLine = i - 1;
  while (bodyLines.length && bodyLines[0].trim() === "") bodyLines.shift();
  while (bodyLines.length && bodyLines[bodyLines.length - 1].trim() === "")
    bodyLines.pop();
  const content = bodyLines.join("\n");
  const datetime = parseLocalDateTime(currentDate, time);
  const tags = extractTags(content);
  const hasImage = detectImage(content);
  const hasLink = detectLink(content);
  const isPinned = tags.includes(PIN_TAG);
  const isStarred = tags.includes(STAR_TAG);
  const tasks = detectTasks(content);
  out.push({
    file: filePath,
    date: currentDate,
    time,
    datetime,
    content,
    tags,
    hasImage,
    hasLink,
    isPinned,
    isStarred,
    hasOpenTask: tasks.open,
    hasClosedTask: tasks.closed,
    range: [startLine, endLine],
  });
  return i;
}

/** 把 "2026-04-25" + "12:43" 解析成本地 Date */
export function parseLocalDateTime(date: string, time: string): Date {
  const [y, mo, d] = date.split("-").map((s) => parseInt(s, 10));
  const [h, mi] = time.split(":").map((s) => parseInt(s, 10));
  return new Date(y, mo - 1, d, h, mi, 0, 0);
}

/** 抽取 #tag（支持中文、嵌套如 #父/子） */
export function extractTags(text: string): string[] {
  const re = /#([A-Za-z0-9_\u4e00-\u9fff][A-Za-z0-9_\u4e00-\u9fff/]*)/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    set.add(m[1]);
  }
  return [...set];
}

/** 是否包含图片：Markdown ![](url) 或 Obsidian 风格 ![[xxx.png]] */
export function detectImage(text: string): boolean {
  if (/!\[[^\]]*\]\([^)]+\)/.test(text)) return true;
  if (/!\[\[[^\]]+\.(png|jpe?g|gif|webp|svg|bmp|avif)(\|[^\]]*)?\]\]/i.test(text))
    return true;
  return false;
}

/** v1.5.0: 扫描正文里的任务列表项。
 *   Markdown 规范允许多种缩进和列表符号（- / * / +），需要都支持。
 *   `- [ ]` = 未完成，`- [x]` / `- [X]` = 已完成（有些 md 变体还支持
 *   `- [-]` 表示取消但我们不识别，保持最小集合）。
 *   返回 { open, closed } 分别表示"至少有一个未完成/已完成"的布尔。
 *   一次扫描同时算出两个，比 parser 里再单独跑一遍正则省一次遍历。 */
export function detectTasks(text: string): { open: boolean; closed: boolean } {
  // (?:^|\n) 锚定行首，允许前置空白 \s*，支持 - / * / + 三种列表符号
  const openRe = /(?:^|\n)\s*[-*+]\s+\[ \]\s/;
  const closedRe = /(?:^|\n)\s*[-*+]\s+\[[xX]\]\s/;
  return {
    open: openRe.test(text),
    closed: closedRe.test(text),
  };
}

/** 是否包含链接：http(s) 链接、Markdown 链接、Obsidian wikilink
 *
 * Bug fix (v1.1.3): 之前 `https?://` 裸链正则会匹配 `![](https://x.png)` 括号里的 URL，
 *   导致"只有一张外链图片"的笔记被同时算进"有图片"和"有链接"，两边重复出现。
 *   修复方式：先把所有图片语法（含其 URL 部分）整块剔除，再判断剩余文本里是否还有链接。
 *
 * Bug fix (v1.1.4): 代码块里的 URL 也会被当作链接（如 `http://192.168.1.1:10086`
 *   这种配置示例，本意是字面文本不是可点链接）。现在进一步剔除三段代码内容：
 *     1) ``` ... ``` 代码围栏
 *     2) ~~~ ... ~~~ 代码围栏
 *     3) `...` 行内代码
 *   这样"笔记里只有一张图片 + 一个代码块 URL"就不会再被误判为有链接。
 */
export function detectLink(text: string): boolean {
  const stripped = text
    // 代码块（多行围栏）
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    // 行内代码
    .replace(/`[^`\n]*`/g, "")
    // 图片语法（连 URL 一起剥掉）
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/!\[\[[^\]]+\]\]/g, "");
  if (/\[[^\]]+\]\([^)]+\)/.test(stripped)) return true;
  if (/\[\[[^\]]+\]\]/.test(stripped)) return true;
  if (/https?:\/\/[^\s)]+/.test(stripped)) return true;
  return false;
}

/** 根据 Date 生成本地 yyyy-MM-dd */
export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 根据 Date 生成本地 HH:mm */
export function fmtTime(d: Date): string {
  const h = d.getHours().toString().padStart(2, "0");
  const mi = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${mi}`;
}

/** 根据 Date 生成中文星期 */
export function fmtWeekday(d: Date): string {
  return WEEKDAY_CN[d.getDay()];
}

/** 生成一条 memo 的 md 文本（统一使用「时间独占一行 + 内容全部缩进 2 空格」格式）
 *
 * 为什么不再用紧凑的 `- HH:MM 内容` 单行格式？
 *   1. 统一结构更美观：日期（##）一行、时间（-）一行、内容缩进，md 源码阅读舒服
 *   2. 避免边缘情况：当内容以 `{` / `"key":` / `>` / task list 等开头时，紧凑格式
 *      会让后续行跳出列表，破坏 markdown 渲染
 *   3. 便于编辑：用 Obsidian 源码/其它编辑器直接修改时不易出错
 *
 * 插件解析器已经兼容新老两种格式，所以现有 md 无需强制重写也能正常工作。
 */
export function renderMemo(time: string, content: string): string {
  const raw = content.replace(/\r\n/g, "\n");
  // 去掉首尾空行
  const lines = raw.split("\n");
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

  // 完全空内容：只写时间行
  if (lines.length === 0) {
    return `- ${time}`;
  }

  // 统一格式：时间独占一行，内容全部缩进 2 空格
  const body = lines
    .map((l) => (l.trim() === "" ? "" : `  ${l}`))
    .join("\n");
  return `- ${time}\n${body}`;
}

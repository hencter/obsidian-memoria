# Motes 🪶

**A flow-style note plugin for Obsidian with native editor, waterfall layout and flexible storage.**

> Your data stays as plain Markdown. Freedom belongs to you.

[![release](https://img.shields.io/github/v/release/hencter/obsidian-motes?include_prereleases&label=release)](https://github.com/hencter/obsidian-motes/releases)
[![license](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

[English](#english) · [简体中文](#简体中文)

---

> **This project is a fork of [i-iooi-i/obsidian-memoria](https://github.com/i-iooi-i/obsidian-memoria).**  
> Original concept and architecture by [i-iooi-i](https://github.com/i-iooi-i).  
> This fork adds substantial new features and UI improvements, listed below.

---

## What's Different from Upstream

Since forking from Memoria v2.3.7, the following has been added or changed:

### Editor & Input
- **Native Obsidian Editor** — Full CodeMirror live-preview editor embedded directly in the input card (via ephemeral WorkspaceLeaf), supporting all Obsidian shortcuts, wikilinks, callouts, tables, and task lists
- **Configurable editor height** — Set in settings (60–600px)
- **Ctrl+Enter** submit with debounced draft auto-save

### Storage
- **Dual storage modes** — Choose between `YYYY-MM-DD.md` (daily) or `YYYY.md` (yearly) files in settings
- **Migration command** — One-click migrate daily files into yearly format via command palette

### Layout
- **Waterfall/card layout** — Sticky-note style multi-column masonry grid with subtle rotation, pastel tints, and hover elevation
- **Standalone sidebar view** — Sidebar can be opened in Obsidian's left dock as an independent pane (`Ctrl+P` → Open independent sidebar)
- **Responsive sidebar** — Auto-collapses at narrow viewport widths (960px)
- **Quick filter tabs** — Underline-style tab bar below the topbar for fast preset switching
- **Customizable brand title** — Set to any text or leave empty for icon-only

### Card Preview
- **Native hover-link preview** — Wiki links use Obsidian's built-in Page Preview (registered as HoverLinkSource)
- **Full Obsidian reading view** — Cards rendered with `markdown-preview-view` and `markdown-rendered` CSS classes for complete theme compatibility

### Data Report & Year View
- **Stats overview** — Redesigned bignum cards with accent top bars
- **Year panorama** — Month memo count badges, current-month highlight, clickable month labels
- **Tag cloud** — Interactive hover scaling

### Author
- **Rebranded as Motes** by [Hencter Lew（亦幸）](https://github.com/hencter)
- All internal identifiers, CSS classes, and plugin ID updated

---

## English

Motes is a lightweight note plugin for Obsidian. It gives you a quick-capture input with native editor, a waterfall-style timeline, tag search, image paste and drag support, task checkbox writeback, pinning, starring, statistics, and a year panorama view.

All notes are stored as ordinary Markdown files in your vault. Motes does not lock your data into a database or a proprietary format.

Main features:

- Native Obsidian editor with full live preview
- Plain Markdown storage in daily or yearly files
- Waterfall card layout with sticky-note style
- Tag autocomplete and combined tag/keyword search
- Image paste, drag, and file-picker capture
- Independent sidebar view, heatmap, calendar, stats, and year panorama
- Quick filter tabs for fast view switching
- Mobile-friendly layout
- Chinese and English interface

---

## 简体中文

### 这是什么

Motes 是一个 Obsidian 笔记插件，帮你在 Obsidian 里以瀑布流的方式快速记录想法。所有数据存为纯 Markdown 文件，停用插件也不影响阅读。

### 和原版 Memoria 的区别

本版本 Fork 自 [i-iooi-i/obsidian-memoria](https://github.com/i-iooi-i/obsidian-memoria) v2.3.7，在此之上做了大量改动：

- **Obsidian 原生编辑器**：输入区嵌入完整的 CodeMirror 实时预览编辑器，支持全部快捷键、双链、callout、表格、任务列表
- **双存储模式**：设置可选日记格式（每天一个 YYYY-MM-DD.md）或年格式（每年一个 YYYY.md），提供一键迁移命令
- **瀑布流卡片布局**：多列瀑布流 + 随意贴风格旋转 + 色纸底色
- **独立侧栏**：侧栏可作为 Obsidian 左侧面板独立打开，与主视图分离
- **响应式侧栏**：窄屏自动收起
- **快捷筛选 Tab**：顶栏下方 underline 风格标签切换
- **品牌标题**：可自定义或隐藏
- **数据报告优化**：总览卡片、标签云交互、年度全景优化
- **重命名为 Motes**，作者 Hencter Lew（亦幸）

### 安装

从 [Releases](../../releases/latest) 下载 `main.js`、`manifest.json`、`styles.css` 放入 `<vault>/.obsidian/plugins/motes/`，在 Obsidian 设置中启用。

或使用 BRAT 插件输入 `hencter/obsidian-motes` 自动安装更新。

### 快捷键

| 动作 | 快捷键 |
|---|---|
| 发送 | Ctrl+Enter |
| 快速记录弹窗 | Ctrl+Shift+M |

### 存储格式

**年格式（默认）**：

```markdown
# 2026

## 2026-04-25 周六
- 12:43
  第一条想法 #灵感

- 14:20
  下午想到的
```

**日记格式**：

```markdown
- 12:43
  第一条想法 #灵感
```

每条 `- HH:MM` 开头是一条独立笔记。停用插件后依然是完整可读的 md 文件。

---

## License

[MIT](./LICENSE) — same as upstream.

## Credits

- Original plugin [Memoria](https://github.com/i-iooi-i/obsidian-memoria) by [i-iooi-i](https://github.com/i-iooi-i)
- Maintained and extended by [Hencter Lew（亦幸）](https://github.com/hencter)

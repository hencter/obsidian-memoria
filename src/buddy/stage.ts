/**
 * v2.1.0-iter13: 宠物成长阶段
 *
 * 设计原则：
 *   - 不破坏"命中注定"哲学：稀有度 / 物种 / 帽子 / 眼睛 / shiny 永远不变
 *   - 只是"气场"在变 —— 你能感觉到它和你陪伴更久了，但它还是它
 *   - 双阈值（OR 关系）：天数 OR 笔记数任意一项达标即升阶
 *     - 高频写作者：靠笔记数快速升阶
 *     - 长期低频用户：靠天数稳定升阶
 *   - 不会回退：陪伴天数和笔记数都是单调递增的，阶段一旦达成就锁定
 *
 * 阈值（双阈值 OR）：
 *   幼年（baby）  ：起点
 *   少年（teen）  ：陪伴 ≥ 30 天 OR 笔记 ≥ 100 条
 *   成年（adult） ：陪伴 ≥ 365 天 OR 笔记 ≥ 1000 条
 */

export type BuddyStage = "baby" | "teen" | "adult";

export const STAGE_THRESHOLDS = {
  teen: { days: 30, memos: 100 },
  adult: { days: 365, memos: 1000 },
} as const;

/** 计算当前阶段。memos 传总条数（不是数组，避免大数据集的重复 length 调用） */
export function computeStage(days: number, memoCount: number): BuddyStage {
  if (
    days >= STAGE_THRESHOLDS.adult.days ||
    memoCount >= STAGE_THRESHOLDS.adult.memos
  ) {
    return "adult";
  }
  if (
    days >= STAGE_THRESHOLDS.teen.days ||
    memoCount >= STAGE_THRESHOLDS.teen.memos
  ) {
    return "teen";
  }
  return "baby";
}

/** 阶段对应的 i18n key */
export const STAGE_KEY: Record<BuddyStage, string> = {
  baby: "buddy.stage.baby",
  teen: "buddy.stage.teen",
  adult: "buddy.stage.adult",
};

/** 距离下一阶段还差多少（用于未来可能的"成长进度"展示）。返回 null = 已满级 */
export function nextStageProgress(
  days: number,
  memoCount: number
): { stage: BuddyStage; daysLeft: number; memosLeft: number } | null {
  const cur = computeStage(days, memoCount);
  if (cur === "adult") return null;
  const target = cur === "baby" ? "teen" : "adult";
  const th = STAGE_THRESHOLDS[target];
  return {
    stage: target,
    daysLeft: Math.max(0, th.days - days),
    memosLeft: Math.max(0, th.memos - memoCount),
  };
}

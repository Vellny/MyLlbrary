// ============================================
// MyLibrary — Star Points & Coin Reward System
// ============================================

// Keys are scoped per-user so each account has independent VIP, coins, and progress.
function key(base: string, userId: string | number): string {
  return `${base}_u${userId}`;
}

const STORAGE_KEY_COINS = 'mylibrary_coins';
const STORAGE_KEY_READ = 'mylibrary_chapters_read';
const STORAGE_KEY_MILESTONES = 'mylibrary_milestones_claimed';
const STORAGE_KEY_VIP = 'mylibrary_vip';
const STORAGE_KEY_CHAPTERS_WRITTEN = 'mylibrary_chapters_written';

// Milestone thresholds and their coin rewards
export const MILESTONES = [
  { percent: 25, coins: 10, label: '25% — Explorer' },
  { percent: 50, coins: 25, label: '50% — Bookworm' },
  { percent: 75, coins: 50, label: '75% — Scholar' },
  { percent: 100, coins: 100, label: '100% — Master Reader' },
];

export const VIP_COST = 500; // Coins needed to redeem VIP

// ---- Coin Balance ----
export function getCoins(userId: string | number): number {
  const saved = localStorage.getItem(key(STORAGE_KEY_COINS, userId));
  return saved ? parseInt(saved, 10) || 0 : 0;
}

export function addCoins(userId: string | number, amount: number): number {
  const current = getCoins(userId);
  const newBalance = current + amount;
  localStorage.setItem(key(STORAGE_KEY_COINS, userId), String(newBalance));
  return newBalance;
}

export function spendCoins(userId: string | number, amount: number): boolean {
  const current = getCoins(userId);
  if (current < amount) return false;
  localStorage.setItem(key(STORAGE_KEY_COINS, userId), String(current - amount));
  return true;
}

// ---- Chapter Read Tracking ----
export function getReadChapters(userId: string | number, bookId: string): string[] {
  try {
    const saved = localStorage.getItem(key(STORAGE_KEY_READ, userId));
    if (!saved) return [];
    const all: Record<string, string[]> = JSON.parse(saved);
    return all[bookId] || [];
  } catch {
    return [];
  }
}

export function markChapterRead(userId: string | number, bookId: string, chapterId: string): string[] {
  try {
    const saved = localStorage.getItem(key(STORAGE_KEY_READ, userId));
    const all: Record<string, string[]> = saved ? JSON.parse(saved) : {};
    if (!all[bookId]) all[bookId] = [];
    if (!all[bookId].includes(chapterId)) {
      all[bookId].push(chapterId);
    }
    localStorage.setItem(key(STORAGE_KEY_READ, userId), JSON.stringify(all));
    return all[bookId];
  } catch {
    return [];
  }
}

// ---- Reading Progress ----
export function getReadingProgress(userId: string | number, bookId: string, totalChapters: number): number {
  if (totalChapters <= 0) return 0;
  const readChapters = getReadChapters(userId, bookId);
  return Math.min(Math.round((readChapters.length / totalChapters) * 100), 100);
}

// ---- Milestone Rewards ----
function getMilestoneKey(bookId: string, percent: number): string {
  return `${bookId}_${percent}`;
}

export function getClaimedMilestones(userId: string | number, bookId: string): number[] {
  try {
    const saved = localStorage.getItem(key(STORAGE_KEY_MILESTONES, userId));
    if (!saved) return [];
    const all: string[] = JSON.parse(saved);
    return MILESTONES
      .filter(m => all.includes(getMilestoneKey(bookId, m.percent)))
      .map(m => m.percent);
  } catch {
    return [];
  }
}

/**
 * Check and auto-claim any newly reached milestones.
 * Returns array of newly claimed milestones with coin amounts.
 */
export function checkAndClaimMilestones(
  userId: string | number,
  bookId: string,
  totalChapters: number
): { percent: number; coins: number; label: string }[] {
  const progress = getReadingProgress(userId, bookId, totalChapters);
  const claimed = getClaimedMilestones(userId, bookId);
  const newClaims: { percent: number; coins: number; label: string }[] = [];

  try {
    const saved = localStorage.getItem(key(STORAGE_KEY_MILESTONES, userId));
    const allClaimed: string[] = saved ? JSON.parse(saved) : [];

    for (const milestone of MILESTONES) {
      if (progress >= milestone.percent && !claimed.includes(milestone.percent)) {
        allClaimed.push(getMilestoneKey(bookId, milestone.percent));
        addCoins(userId, milestone.coins);
        newClaims.push(milestone);
      }
    }

    localStorage.setItem(key(STORAGE_KEY_MILESTONES, userId), JSON.stringify(allClaimed));
  } catch {
    // ignore
  }

  return newClaims;
}

// ---- VIP Status ----
export function isVIP(userId: string | number): boolean {
  return localStorage.getItem(key(STORAGE_KEY_VIP, userId)) === 'true';
}

export function redeemVIP(userId: string | number): boolean {
  if (isVIP(userId)) return true; // Already VIP
  if (spendCoins(userId, VIP_COST)) {
    localStorage.setItem(key(STORAGE_KEY_VIP, userId), 'true');
    return true;
  }
  return false;
}

export function getVIPStatus(userId: string | number): { isVip: boolean; coins: number; cost: number } {
  return {
    isVip: isVIP(userId),
    coins: getCoins(userId),
    cost: VIP_COST,
  };
}

// ---- Premium Level ----
export function getChaptersWritten(userId: string | number): number {
  const saved = localStorage.getItem(key(STORAGE_KEY_CHAPTERS_WRITTEN, userId));
  return saved ? parseInt(saved, 10) || 0 : 0;
}

export function addChapterWritten(userId: string | number): void {
  const current = getChaptersWritten(userId);
  localStorage.setItem(key(STORAGE_KEY_CHAPTERS_WRITTEN, userId), String(current + 1));
}

export function getPremiumLevel(userId: string | number): { level: number; title: string } {
  const chapters = getChaptersWritten(userId);
  const vipBonus = isVIP(userId) ? 1 : 0;
  const level = chapters + vipBonus;
  
  let title = 'Beginner';
  if (level === 1) title = 'Explorer';
  else if (level === 2) title = 'Bookworm';
  else if (level >= 3 && level < 5) title = 'Scholar';
  else if (level >= 5 && level < 10) title = 'Master Reader';
  else if (level >= 10) title = 'Grandmaster';

  return { level, title };
}

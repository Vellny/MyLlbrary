// ============================================
// MyLibrary — Star Points & Coin Reward System
// ============================================

const STORAGE_KEY_COINS = 'mylibrary_coins';
const STORAGE_KEY_READ = 'mylibrary_chapters_read';
const STORAGE_KEY_MILESTONES = 'mylibrary_milestones_claimed';
const STORAGE_KEY_VIP = 'mylibrary_vip';

// Milestone thresholds and their coin rewards
export const MILESTONES = [
  { percent: 25, coins: 10, label: '25% — Explorer' },
  { percent: 50, coins: 25, label: '50% — Bookworm' },
  { percent: 75, coins: 50, label: '75% — Scholar' },
  { percent: 100, coins: 100, label: '100% — Master Reader' },
];

export const VIP_COST = 500; // Coins needed to redeem VIP

// ---- Coin Balance ----
export function getCoins(): number {
  const saved = localStorage.getItem(STORAGE_KEY_COINS);
  return saved ? parseInt(saved, 10) || 0 : 0;
}

export function addCoins(amount: number): number {
  const current = getCoins();
  const newBalance = current + amount;
  localStorage.setItem(STORAGE_KEY_COINS, String(newBalance));
  return newBalance;
}

export function spendCoins(amount: number): boolean {
  const current = getCoins();
  if (current < amount) return false;
  localStorage.setItem(STORAGE_KEY_COINS, String(current - amount));
  return true;
}

// ---- Chapter Read Tracking ----
export function getReadChapters(bookId: string): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_READ);
    if (!saved) return [];
    const all: Record<string, string[]> = JSON.parse(saved);
    return all[bookId] || [];
  } catch {
    return [];
  }
}

export function markChapterRead(bookId: string, chapterId: string): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_READ);
    const all: Record<string, string[]> = saved ? JSON.parse(saved) : {};
    if (!all[bookId]) all[bookId] = [];
    if (!all[bookId].includes(chapterId)) {
      all[bookId].push(chapterId);
    }
    localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(all));
    return all[bookId];
  } catch {
    return [];
  }
}

// ---- Reading Progress ----
export function getReadingProgress(bookId: string, totalChapters: number): number {
  if (totalChapters <= 0) return 0;
  const readChapters = getReadChapters(bookId);
  return Math.min(Math.round((readChapters.length / totalChapters) * 100), 100);
}

// ---- Milestone Rewards ----
function getMilestoneKey(bookId: string, percent: number): string {
  return `${bookId}_${percent}`;
}

export function getClaimedMilestones(bookId: string): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MILESTONES);
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
  bookId: string,
  totalChapters: number
): { percent: number; coins: number; label: string }[] {
  const progress = getReadingProgress(bookId, totalChapters);
  const claimed = getClaimedMilestones(bookId);
  const newClaims: { percent: number; coins: number; label: string }[] = [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY_MILESTONES);
    const allClaimed: string[] = saved ? JSON.parse(saved) : [];

    for (const milestone of MILESTONES) {
      if (progress >= milestone.percent && !claimed.includes(milestone.percent)) {
        allClaimed.push(getMilestoneKey(bookId, milestone.percent));
        addCoins(milestone.coins);
        newClaims.push(milestone);
      }
    }

    localStorage.setItem(STORAGE_KEY_MILESTONES, JSON.stringify(allClaimed));
  } catch {
    // ignore
  }

  return newClaims;
}

// ---- VIP Status ----
export function isVIP(): boolean {
  return localStorage.getItem(STORAGE_KEY_VIP) === 'true';
}

export function redeemVIP(): boolean {
  if (isVIP()) return true; // Already VIP
  if (spendCoins(VIP_COST)) {
    localStorage.setItem(STORAGE_KEY_VIP, 'true');
    return true;
  }
  return false;
}

export function getVIPStatus(): { isVip: boolean; coins: number; cost: number } {
  return {
    isVip: isVIP(),
    coins: getCoins(),
    cost: VIP_COST,
  };
}

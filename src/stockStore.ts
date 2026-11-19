export type StockCondition = "New" | "Reconditioned";

type StockBalances = Record<string, { newQty: number; reconQty: number }>;

const STORAGE_KEY = "autocare-inventory-balances";

function readBalances(): StockBalances {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as StockBalances;
  } catch {
    return {};
  }
}

function writeBalances(balances: StockBalances) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(balances));
}

export function getStockBalance(code: string, condition: StockCondition, fallback: number) {
  const stored = readBalances()[code];
  if (!stored) return fallback;
  return condition === "New" ? stored.newQty : stored.reconQty;
}

export function hydrateStock<T extends { code: string; newQty: number; reconQty: number }>(
  items: T[],
) {
  const balances = readBalances();
  return items.map((item) =>
    balances[item.code]
      ? {
          ...item,
          newQty: balances[item.code].newQty,
          reconQty: balances[item.code].reconQty,
        }
      : item,
  );
}

export function setStockBalance(
  code: string,
  condition: StockCondition,
  quantity: number,
  fallbackOther: number,
) {
  const balances = readBalances();
  const current = balances[code] ?? {
    newQty: condition === "New" ? quantity : fallbackOther,
    reconQty: condition === "Reconditioned" ? quantity : fallbackOther,
  };
  balances[code] = {
    newQty: condition === "New" ? quantity : current.newQty,
    reconQty: condition === "Reconditioned" ? quantity : current.reconQty,
  };
  writeBalances(balances);
}

export function deductStock(
  lines: { code: string; condition: StockCondition; quantity: number; fallback: number }[],
) {
  const balances = readBalances();
  for (const line of lines) {
    const existing = balances[line.code];
    const available = existing
      ? line.condition === "New"
        ? existing.newQty
        : existing.reconQty
      : line.fallback;
    if (line.quantity > available) {
      return { ok: false, code: line.code, available };
    }
  }
  for (const line of lines) {
    const existing = balances[line.code] ?? {
      newQty: line.condition === "New" ? line.fallback : 0,
      reconQty: line.condition === "Reconditioned" ? line.fallback : 0,
    };
    if (line.condition === "New") existing.newQty -= line.quantity;
    else existing.reconQty -= line.quantity;
    balances[line.code] = existing;
  }
  writeBalances(balances);
  return { ok: true as const };
}

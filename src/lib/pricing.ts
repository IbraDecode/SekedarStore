export type MarkupType = "percent" | "flat";

function normalizeMarkupType(type: string | undefined): MarkupType {
  return type === "flat" ? "flat" : "percent";
}

function normalizeNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function calculateTotals(
  basePricePerThousand: number,
  markupType: string | undefined,
  markupValue: number | undefined,
  qty: number
) {
  const base = ((normalizeNumber(qty) || 0) / 1000) * normalizeNumber(basePricePerThousand);
  const type = normalizeMarkupType(markupType);
  const markup = type === "percent" ? (normalizeNumber(markupValue) / 100) * base : normalizeNumber(markupValue);

  const base_total = Math.ceil(base);
  const sell_total = Math.ceil(base + markup);

  return { base_total, sell_total };
}

export function calculateSellPricePerThousand(
  basePricePerThousand: number,
  markupType: string | undefined,
  markupValue: number | undefined
) {
  return calculateTotals(basePricePerThousand, markupType, markupValue, 1000).sell_total;
}

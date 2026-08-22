/** Derived badge: empty bin vs still-on-shelf but under the minimum. */
export function stockStatusOf(
  row: Record<string, unknown>,
): 'out' | 'below' | 'available' {
  const qty = Number(row['quantity']);
  if (qty === 0) return 'out';
  if (row['isBelowMinimum'] === true || qty < Number(row['minimumStock'])) {
    return 'below';
  }
  return 'available';
}

/** Warehouse stock presets from `?stock=` — below-min and out-of-stock are distinct. */
export function matchesStock(
  row: Record<string, unknown>,
  stock: string,
): boolean {
  if (!stock) return true;
  return stockStatusOf(row) === stock;
}

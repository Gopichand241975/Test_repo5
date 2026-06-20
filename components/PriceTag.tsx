export function PriceTag({ amount }: { amount: number | string }) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return (
    <span className="price-tag inline-flex items-center gap-1 rounded-sm bg-ink text-paper px-2 py-0.5 text-sm">
      <span className="text-rust">$</span>
      {value.toFixed(2)}
    </span>
  );
}

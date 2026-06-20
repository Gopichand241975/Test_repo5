const STATUS_LABELS: Record<string, string> = {
  in_progress: "In progress",
  completed: "Completed",
  abandoned: "Shelved",
};

const STATUS_COLORS: Record<string, string> = {
  in_progress: "bg-rust/10 text-rust border-rust/30",
  completed: "bg-shop-green/10 text-shop-green border-shop-green/30",
  abandoned: "bg-muted/10 text-muted border-muted/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block text-xs uppercase tracking-wide font-medium px-2 py-0.5 rounded-sm border ${
        STATUS_COLORS[status] || STATUS_COLORS.in_progress
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

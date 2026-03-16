import { cn } from "@/app/utils/utils";

export interface PriceProps {
  amount: string;
  currencyCode: string;
  compareAtAmount?: string;
  className?: string;
}

const Price = ({ amount, currencyCode, compareAtAmount, className }: PriceProps) => {
  const format = (val: string) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(val));

  const hasDiscount =
    compareAtAmount &&
    Number.parseFloat(compareAtAmount) > Number.parseFloat(amount);

  const discountPct = hasDiscount
    ? Math.round(
        (1 - Number.parseFloat(amount) / Number.parseFloat(compareAtAmount!)) *
          100
      )
    : null;

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-medium text-primary">{format(amount)}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted line-through">
            {format(compareAtAmount!)}
          </span>
          <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
            -{discountPct}%
          </span>
        </>
      )}
    </span>
  );
};

export default Price;

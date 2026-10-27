// Cuota mensual necesaria para saldar la deuda estimada dentro del plazo elegido (sin intereses: es una referencia).
export function monthlyPayoffTarget(estimatedTotal: number, payoffMonths: number): number {
  return estimatedTotal / payoffMonths;
}

// Null cuando no declaró ingresos: sin ese dato no hay margen que calcular.
export function estimateMonthlyMargin(
  monthlyIncome: number | null,
  fixedExpensesTotal: number,
  monthlyDebtPayment: number,
): number | null {
  if (monthlyIncome === null) return null;
  return monthlyIncome - fixedExpensesTotal - monthlyDebtPayment;
}

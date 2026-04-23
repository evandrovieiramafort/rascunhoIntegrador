const formatadorCefetins = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatarC$(valor: number | string): string {
  return `C$ ${formatadorCefetins.format(Number(valor))}`;
}
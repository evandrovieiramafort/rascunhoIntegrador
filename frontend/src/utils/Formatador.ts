
// formatador de valores monetários
const formatadorCefetins = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// função para formatar o "C$" juntamente com os valores monetários em tela
export function formatarC$(valor: number | string): string {
  return `C$ ${formatadorCefetins.format(Number(valor))}`;
}
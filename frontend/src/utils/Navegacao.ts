export function navegarPara(rota: string): void {
  window.history.pushState({}, "", rota);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
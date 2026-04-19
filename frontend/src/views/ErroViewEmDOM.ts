export class ErroViewEmDOM {
    public exibirPaginaNaoEncontrada(container: HTMLElement, aoVoltar: () => void): void {
        container.replaceChildren();

        const divCentro = document.createElement('div');
        divCentro.className = 'text-center mt-5';

        const h1 = document.createElement('h1');
        h1.className = 'display-1 fw-bold';
        h1.textContent = '404';

        const pMensagem = document.createElement('p');
        pMensagem.className = 'fs-3';
        
        const spanOps = document.createElement('span');
        spanOps.className = 'text-danger';
        spanOps.textContent = 'Ops! ';
        
        pMensagem.append(spanOps, document.createTextNode('Página não encontrada.'));

        const pDescricao = document.createElement('p');
        pDescricao.className = 'lead';
        pDescricao.textContent = 'O endereço que você procura não existe no sistema Cefet Shop.';

        const btnVoltar = document.createElement('button');
        btnVoltar.className = 'btn btn-primary';
        btnVoltar.textContent = 'Voltar para o início';
        btnVoltar.onclick = (e) => {
            e.preventDefault();
            aoVoltar();
        };

        divCentro.append(h1, pMensagem, pDescricao, btnVoltar);
        container.appendChild(divCentro);
    }
}
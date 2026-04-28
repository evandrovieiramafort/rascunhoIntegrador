# Cefet Shop
Projeto Fullstack E-commerce para a disciplina Projeto Integrador de Sistemas.

## Alunos
**Evandro Vieira Mafort**
- evandro.mafort@aluno.cefet-rj.br

**Lucas Pinheiro Machado**
- lucas.machado@aluno.cefet-rj.br

---

## Comandos para colocar o projeto em funcionamento

**Pré-requisitos:**
* MySQL ou MariaDB instalado e em execução.
* PHP 8.x e Composer instalados.
* Node.js e pnpm instalados.

**Passos:**

1. **Clonar o repositório do projeto:**
   * Rode `git clone https://github.com/evandrovieiramafort/rascunhoIntegrador.git`

2. **Instalar Dependências do Backend:**
   * Navegue até a pasta `/backend`.
   * Rode `composer install`.

3. **Instalar Dependências do Frontend:**
   * Navegue até a pasta `/frontend`.
   * Rode `pnpm install`.

4. **Configurar o Banco de Dados:**
   * Na raiz da pasta `/backend`, altere o nome do arquivo `env-example.php` para `env.php`.
   * Abra o arquivo e insira suas credenciais de banco de dados (usuário e senha) no array associativo de configuração.
   * Na raiz do projeto, rode os scripts:
   * Para criar a estrutura de produção: `composer run db:prd`.
   * Para preparar o banco de testes: `composer run db:test`.

5. **Iniciar o Backend (API):**
   * Em um terminal em `/backend`, rode:
   * `composer run api` (iniciará em `localhost:8000` por padrão).

6. **Iniciar o Frontend:**
   * Em outro terminal, em `/frontend`, rode:
   * `pnpm run dev` (iniciará em `localhost:5173` por padrão).

---

## Qualidade e Testes

### Backend (PHP)
* **Análise Estática (PHPStan - Nível 10):** Rode `composer run check`.
* **Testes de Unidade e Integração (Kahlan):** Rode `composer run test`.

### Frontend (TypeScript & Vite)
* **Testes Unitários (Vitest):** Rode `pnpm run test:unit`.
* **Testes E2E (Playwright):** Rode `pnpm run test:e2e`.
* **Build e Verificação de Tipos:** Rode `pnpm run build` (executa `tsc` seguido do build do Vite).

---

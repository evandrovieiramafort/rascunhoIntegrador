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
* Node.js e npm instalados.

**Passos:**

1. **Clonar o repositório do projeto:**
   * Rode `git clone 

2. **Instalar Dependências do Backend:**
   * Navegue até a pasta `/backend`.
   * Rode `composer install`.

3. **Instalar Dependências do Frontend:**
   * Navegue até a pasta `/frontend`.
   * Rode `npm install`.

4. **Configurar o Banco de Dados:**
   * Há um arquivo na raiz do `/backend` chamado env-example.php, onde as variáveis do banco já estão organizadas em um array associativo. Altere o nome do arquivo para env.php e troque pelas suas credenciais os campos de usuário e senha.
   * Na raiz do projeto, rode os scripts:
   * Para criar a estrutura de produção: `composer run db:prd`.
   * Para preparar o banco de testes: `composer run db:test`.

5. **Iniciar o Backend (API):**
   * Em um terminal em `/backend`, rode:
   * `composer run api` (iniciará em `localhost:8000` por padrão).

6. **Iniciar o Frontend:**
   * Em outro terminal, em `/frontend`, rode:
   * `npm run dev` (iniciará em `localhost:5173` por padrão).

---

## Qualidade e Testes

### Backend (PHP)
* **Análise Estática (PHPStan - Nível 10):** Rode `composer run check`.
* **Testes de Unidade e Integração (Kahlan):** Rode `composer run test`.

### Frontend (TypeScript & Vite)
* **Testes Unitários (Vitest):** Rode `npm run test:unit`.
* **Testes E2E (Playwright):** Rode `npm run test:e2e`.
* **Build e Verificação de Tipos:** Rode `npm run build` (executa `tsc` seguido do build do Vite).

---

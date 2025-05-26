# Humores Shopping

Este projeto é uma loja virtual de roupas de grife para homens, desenvolvida em React + TypeScript com TailwindCSS.

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## Passo a passo para rodar a aplicação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd humores-shopping
   ```

2. **Instale as dependências**

   Usando npm:

   ```bash
   npm install
   ```

   Ou usando yarn:

   ```bash
   yarn install
   ```

3. **Configure o TailwindCSS (se necessário)**

   O projeto já está configurado para usar TailwindCSS. Se precisar ajustar, verifique o arquivo `tailwind.config.js` e o `postcss.config.js`.

4. **Inicie o servidor de desenvolvimento**

   Usando npm:

   ```bash
   npm run dev
   ```

   Ou usando yarn:

   ```bash
   yarn dev
   ```

5. **Acesse a aplicação**

   Abra o navegador e acesse: [http://localhost:5173](http://localhost:5173) (ou a porta indicada no terminal).

## Estrutura do Projeto

- `src/components/` - Componentes React da aplicação
- `src/data/` - Dados dos produtos
- `src/App.tsx` - Componente principal e rotas
- `src/index.css` - Estilos globais e Tailwind
- `public/` ou `src/assets/` - Imagens e assets

## Observações

- O histórico de compras é salvo no `localStorage` do navegador.
- Para resetar o histórico, utilize o botão "Limpar Histórico de Compras" na página de perfil.
- As imagens dos produtos devem estar presentes no caminho correto em `src/assets/Products/`.

## Scripts úteis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente

---

Qualquer dúvida, consulte o código ou abra uma issue!

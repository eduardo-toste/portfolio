# portfolio

Portfólio pessoal de Eduardo Toste, feito com [Astro](https://astro.build) e publicado em https://eduardo-toste.github.io/portfolio/.

```sh
npm install
npm run dev      # http://localhost:4321/portfolio/
npm run build    # gera dist/
npm run deploy   # publica no GitHub Pages
```

## Estrutura

- `src/pages/index.astro`: marcação da página (textos em PT; o script troca para EN).
- `src/layouts/Base.astro`: `<head>` com SEO e a Content Security Policy.
- `src/styles/global.css`: tokens de cor, tipografia e animações.
- `src/scripts/main.js`: textos PT/EN, projetos, trajetória e o motor de células (gráfico do nome e ícones em pixel art).
- `src/scripts/github.js`: dados ao vivo do GitHub (perfil, repositórios e calendário de contribuições), validados e em cache por 30 min.
- `public/`: favicon.

## Deploy

`npm run deploy` gera o site e envia `dist/` para o branch `gh-pages`, que o GitHub Pages publica
(Settings → Pages → Deploy from a branch → `gh-pages` / root). O `main` guarda só o código-fonte.
Se mudar o domínio ou o nome do repositório, ajuste `site` e `base` em `astro.config.mjs`.

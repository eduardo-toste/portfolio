# portfolio

Portfólio pessoal de Eduardo Toste, feito com [Astro](https://astro.build).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
```

## Estrutura

- `src/pages/index.astro`: marcação da página (textos em PT; o script troca para EN).
- `src/styles/global.css`: tokens de cor, tipografia e animações.
- `src/scripts/main.js`: textos PT/EN, projetos, trajetória e o motor de células (gráfico do nome e ícones em pixel art).
- `public/`: favicon e os PDFs do currículo.

## Pendências

- Adicionar `public/curriculo-eduardo-toste.pdf` e `public/resume-eduardo-toste.pdf`.
- Trocar o conteúdo de exemplo (projetos, trajetória, números, e-mail, LinkedIn) pelos dados reais em `src/scripts/main.js` e `src/pages/index.astro`.

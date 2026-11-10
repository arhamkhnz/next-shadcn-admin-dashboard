# AGENTS.md

## Visão geral do projeto

Studio Admin é um dashboard administrativo responsivo construído com Next.js 16, React 19, TypeScript, Tailwind CSS v4 e shadcn/ui.

Este repositório usa o estilo `radix-nova` do shadcn. A CLI do shadcn reporta `base: "radix"`, que se refere ao Radix UI. Sempre inspecione os componentes locais em `src/components/ui/` porque wrappers individuais podem usar primitivas diferentes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## shadcn skill

Use a shadcn skill para todo trabalho envolvendo componentes shadcn/ui, estilização, composição, registros, presets ou `components.json`.

Se a skill não estiver disponível, instale com:

```bash
npx skills add shadcn/ui
```

A skill contém as regras de componente, estilização, acessibilidade e CLI. Não duplique essas regras aqui. Sempre inspecione o código-fonte local dos componentes antes de usar.

Não modifique arquivos dentro de `src/components/ui/` ou `src/components/calendar/`. Mantenha esses componentes intactos e aplique estilização ou customização onde eles são usados.

## Configuração

Este projeto usa npm.

```bash
npm install
npm run dev
```

Comandos disponíveis:

```bash
npm run build
npm run lint
npm run format
npm run check
npm run check:fix
npm run generate:presets
```

Atualmente não há comando de testes automatizados. Rode build, lint, check ou outros comandos de validação apenas quando o usuário solicitar explicitamente essa validação.

## Estrutura colocation-based

Mantenha o código de cada feature perto da rota à qual ela pertence.

- Rotas de dashboard: `src/app/(main)/dashboard/<tela>/page.tsx`
- Componentes, dados e schemas específicos da tela: `src/app/(main)/dashboard/<tela>/_components/`
- Componentes compartilhados de dashboard: `src/app/(main)/dashboard/_components/`
- Componentes compartilhados da aplicação: `src/components/`
- Componentes locais do shadcn: `src/components/ui/`
- Hooks e utilitários compartilhados: `src/hooks/` e `src/lib/`
- Presets de tema: `src/styles/presets/`

Mantenha um componente dentro da rota dele até que seja reutilizado por outra feature. Não mova código específico de tela para um diretório compartilhado preventivamente.

## Criando ou estendendo uma tela

1. Inspecione a tela atual mais próxima antes de escrever código. Finance, Infrastructure, CRM e Analytics são referências úteis. Não use rotas em `(legacy)` como referência para telas novas, a menos que esteja mantendo uma rota legada.
2. Ao reproduzir uma UI a partir de screenshot ou imagem, siga de perto a direção visual dela, incluindo layout, hierarquia, espaçamento, estrutura de componentes e detalhes importantes. Implemente com os componentes existentes do projeto e tokens de tema semânticos, em vez de copiar valores de cor crus. Se o design precisar de uma cor indisponível via tokens de tema existentes, ou o usuário solicitar explicitamente uma cor fora do tema, use uma cor nomeada da paleta padrão do Tailwind. Não use valores hex, RGB, HSL ou OKLCH arbitrários.
3. Reaproveite o shell de dashboard existente, componentes locais, controles de layout e tokens de tema.
4. Quebre cada página nova em componentes focados dentro do diretório `_components/` da rota. Mantenha `page.tsx` pequeno e focado em compor essas peças.
5. Mantenha `page.tsx` como Server Component por padrão. Mova código interativo ou dependente de navegador para um Client Component dedicado.
6. Adicione a tela em `src/navigation/sidebar/sidebar-items.ts` quando ela deve aparecer na navegação do dashboard.
7. Decida a hierarquia de informação antes de escolher widgets. Deixe o conteúdo determinar a estrutura da página.
8. Mantenha o ritmo visual estabelecido onde couber: espaçamento compacto, hierarquia tipográfica clara, linhas de ação responsivas e grids que colapsam de forma limpa em telas menores.
9. A escolha de widgets não é uma fórmula fixa. Experimente variações de cards, linhas de recursos, medidores, gráficos, tabs, empty states e ações e mantenha a versão que comunica o conteúdo claramente e soa consistente com o projeto.
10. Combine com telas vizinhas em densidade de cards, bordas, raio, espaçamento, largura de conteúdo e comportamento responsivo.
11. Use tokens de tema semânticos para que novas telas funcionem em modo claro, modo escuro e nos presets de tema existentes.
12. Trate estados relevantes de loading, vazio, erro, desabilitado e overflow.
13. Mantenha as telas acessíveis com HTML semântico, suporte a teclado, estados de foco visíveis, labels e atributos ARIA apropriados.

## Convenções de código

- TypeScript em modo strict está habilitado. Use tipos precisos e evite `any`.
- Use os aliases de importação `@/` existentes.
- Siga a configuração do Biome: aspas duplas, ponto e vírgula, indentação de dois espaços, imports ordenados e largura de linha de 120 caracteres.
- Evite dependências desnecessárias.
- Mantenha as alterações focadas e não refatore arquivos não relacionados.

## Contribuições

- Use prefixos de commit convencionais, como `feat:`, `fix:`, `refactor:`, `docs:` e `chore:`.
- Inclua screenshots para telas novas e mudanças visuais materiais. Inclua estados mobile e de tema escuro quando relevante.
- Explique no pull request novos padrões reutilizáveis ou dependências.
- Siga `CONTRIBUTING.md` para o fluxo de contribuição.

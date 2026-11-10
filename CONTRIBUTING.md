# Contribuindo com o Studio Admin

Obrigado por demonstrar interesse em melhorar o **Studio Admin** (repo: `shadcn-admin-sqlite`).
Este guia vai ajudar você a configurar seu ambiente e entender como contribuir.

---

## Visão geral

Este projeto é construído com **Next.js 16**, **TypeScript**, **Tailwind CSS v4** e **Shadcn UI**.
O objetivo é manter a base de código modular, escalável e fácil de estender.

---

## Estrutura do projeto

Usamos um **sistema de arquivos colocation-based**. Cada feature mantém suas próprias páginas, componentes e lógica.

```
src
├── app               # Rotas Next.js (App Router)
│   ├── (auth)        # Layouts e telas de autenticação
│   ├── (main)        # Rotas principais do dashboard
│   │   └── (dashboard)
│   │       ├── crm
│   │       ├── finance
│   │       ├── default
│   │       └── ...
│   └── layout.tsx
├── components        # Componentes de UI compartilhados
├── hooks             # Hooks reutilizáveis
├── lib               # Configurações e utilitários
├── styles            # Tailwind / configuração de tema
└── types             # Definições TypeScript
```

---

## Primeiros passos

### Dê fork e clone o repositório

1. Dê fork no repositório

   Clique [aqui](https://github.com/prof-ramos/shadcn-admin-sqlite/fork) para fazer o fork do repositório.

2. Clone o repositório
   ```bash
   git clone https://github.com/SEU_USUARIO/shadcn-admin-sqlite.git
   ```

3. Entre no projeto
   ```bash
   cd shadcn-admin-sqlite
   ```

4. **Instale as dependências**
   ```bash
   npm install
   ```

5. **Rode o servidor de dev**
   ```bash
   npm run dev
   ```
   O app estará disponível em [http://localhost:3000](http://localhost:3000).

---

## Fluxo de contribuição

- Sempre crie uma branch nova antes de trabalhar em alterações:
  ```bash
  git checkout -b feature/minha-atualizacao
  ```

- Use mensagens de commit claras:
  ```bash
  git commit -m "feat: add finance dashboard screen"
  ```

- Abra um Pull Request quando estiver pronto.
- Se sua alteração adiciona uma nova tela ou componente de UI, inclua um screenshot na descrição do PR.

---

## Onde contribuir

- **Páginas externas**: páginas de landing ou outras rotas fora do dashboard → `src/app/(external)/`
- **Telas de auth**: login, registro e layouts de autenticação → `src/app/(main)/auth/`
- **Telas de dashboard**: dashboards de feature como CRM, Finance, Analytics → `src/app/(main)/dashboard/`
- **Componentes**: UI reutilizável fica em `src/components/`
- **Hooks**: lógica customizada fica em `src/hooks/`
- **Temas**: presets novos em `src/styles/presets/`
- **Tradução pt-BR**: siga o glossário e o protocolo em `PLANO-TRADUCAO.md`

---

## Diretrizes

- Prefira **tipos TypeScript** a `any`
- Hooks de pre-commit do Husky estão habilitados — linting e formatação rodam automaticamente quando você commita, e, se houver erros, o commit será bloqueado até que sejam corrigidos.
- Siga o estilo do **Shadcn UI** e as convenções do Tailwind v4
- Tenha acessibilidade em mente (ARIA, navegação por teclado)
- Use mensagens de commit claras com prefixos convencionais (`feat:`, `fix:`, `chore:`, etc.)
- Evite dependências desnecessárias — prefira utilitários existentes quando possível

---

## Enviando PRs

- Abra um Pull Request quando suas alterações estiverem prontas.
- Garanta que sua branch esteja atualizada com a `main` antes de enviar.
- Referencie qualquer issue relacionada no seu PR para dar contexto.

---

## Dúvidas e suporte

- Reporte bugs, sugestões ou issues via [GitHub Issues](https://github.com/prof-ramos/shadcn-admin-sqlite/issues)

---

Suas contribuições mantêm este projeto crescendo. 🚀

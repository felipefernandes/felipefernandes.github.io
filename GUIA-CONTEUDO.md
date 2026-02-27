# 📝 Guia de Conteúdo - felipefernandes.github.io

Guia rápido para adicionar e editar conteúdo no seu portfólio.

---

## 🎯 Estrutura de Conteúdo

Todo o conteúdo fica em `src/content/` organizado em Collections:

```
src/content/
├── projects/      → Projetos
├── articles/      → Publicações (Medium, livros, blog)
├── talks/         → Palestras e mentorias
└── archive/       → Posts antigos arquivados
```

---

## 📦 Como Adicionar Novo Projeto

1. Crie um arquivo `.md` em `src/content/projects/` (ex: `meu-novo-projeto.md`)

2. Use este template:

```markdown
---
title: "Nome do Projeto"
description: "Descrição breve do que o projeto faz"
tags: ["Python", "AI", "Automação"]
status: "open-source"  # ou "saas", "internal", "archived"
featured: true         # true = aparece na home, false = só em /projetos
year: 2026
github: "https://github.com/seu-usuario/repo"  # opcional
link: "https://seusite.com"                    # opcional
order: 1               # ordem de exibição (menor = primeiro)
lang: "pt-BR"
---

## Sobre o Projeto

Aqui você escreve o conteúdo completo do projeto usando Markdown.

### Funcionalidades

- Feature 1
- Feature 2

### Tecnologias

- Python
- FastAPI
```

3. Salve e o site atualiza automaticamente! ✅

---

## 📰 Como Adicionar Nova Publicação (Artigo/Livro)

1. Crie um arquivo `.md` em `src/content/articles/` (ex: `meu-artigo.md`)

2. Use este template:

```markdown
---
title: "Título do Artigo"
description: "Resumo do que o artigo aborda"
publishedAt: 2026-02-27
platform: "medium"     # ou "book", "blog"
tags: ["Gestão", "Agilidade", "IA"]
featured: true         # true = aparece na home
url: "https://medium.com/@user/artigo"  # opcional (livros não têm URL)
lang: "pt-BR"
---

Conteúdo completo do artigo (se for blog).
Para Medium/livros externos, só o frontmatter basta.
```

3. Salve e pronto! 🎉

**Tipos de platform:**
- `"medium"` - artigos no Medium
- `"book"` - livros publicados
- `"blog"` - posts no blog

---

## 🎤 Como Adicionar Palestra/Mentoria

1. Crie um arquivo `.md` em `src/content/talks/` (ex: `minha-palestra.md`)

2. Use este template:

```markdown
---
title: "Título da Palestra"
event: "Nome do Evento (ex: Campus Party 2026)"
type: "talk"           # ou "workshop", "mentorship", "community"
date: 2026-03-15
description: "Descrição do que foi apresentado"
link: "https://evento.com"          # opcional
videoUrl: "https://youtube.com/..."  # opcional
lang: "pt-BR"
---

Descrição completa da palestra (opcional).
```

3. Salve! 🚀

---

## 🛠️ Como Editar Tech Stack

Edite o arquivo `src/data/tech-stack.ts`:

```typescript
export const techStack = {
  ai: [
    { name: 'Claude', category: 'AI & LLMs', highlight: 'purple' },
    { name: 'Nova Tech', category: 'AI & LLMs' },  // sem highlight
  ],
  // ...
};
```

**Highlights disponíveis:**
- `highlight: 'purple'` - cor roxa (para LLMs principais)
- `highlight: 'cyan'` - cor cyan (para ferramentas/metodologias chave)
- Sem highlight - cor neutra (padrão)

---

## 🔗 Como Editar Links Sociais

Edite o arquivo `src/data/social.ts`:

```typescript
export const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/seu-user/',
    username: '@seu-user',
  },
  // adicione novos links aqui
];
```

---

## 📄 Como Editar Página "Sobre"

Edite o arquivo `src/pages/sobre.astro`.

Procure pela seção de conteúdo e edite o texto diretamente:

```astro
<p class="text-white/70 leading-relaxed">
  Seu novo texto aqui...
</p>
```

---

## 🎨 Como Destacar Itens na Home

### Projetos em Destaque

No arquivo do projeto, adicione `featured: true`:

```yaml
---
title: "Projeto Legal"
featured: true    # ← adicione isto
order: 1          # ordem na home (1 = primeiro)
---
```

### Artigos em Destaque

No arquivo do artigo, adicione `featured: true`:

```yaml
---
title: "Artigo Importante"
featured: true    # ← adicione isto
---
```

**Nota:** Apenas os 3 itens mais recentes com `featured: true` aparecem na home.

---

## 🚀 Publicar Mudanças

Depois de editar qualquer arquivo:

```bash
# 1. Adicionar mudanças
git add .

# 2. Commitar
git commit -m "Adiciona novo projeto X"

# 3. Publicar
git push origin master
```

O GitHub Actions vai buildar e publicar automaticamente em ~2 minutos! ⚡

---

## 🎯 Dicas Rápidas

- **Testar localmente**: `npm run dev` → http://localhost:4321
- **Ver erros de build**: `npm run build`
- **Formato de datas**: Use formato ISO `YYYY-MM-DD` (ex: `2026-02-27`)
- **Markdown suportado**: Títulos, listas, links, código, imagens, etc.
- **Slugs automáticos**: O nome do arquivo vira a URL (ex: `meu-projeto.md` → `/projetos/meu-projeto`)

---

## 🆘 Problemas Comuns

### Site não atualiza após push

1. Vá em **Actions** no GitHub
2. Veja se o workflow rodou com sucesso (✅ verde)
3. Se falhou (❌ vermelho), clique para ver o erro

### Erro "Invalid date"

Formato correto de data: `2026-02-27` (ano-mês-dia)

### Projeto não aparece na home

Certifique-se que tem `featured: true` e `order` definido.

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas, abra uma issue no GitHub ou me chame! 😄

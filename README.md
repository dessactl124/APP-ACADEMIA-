# Treino SaaS — plataforma de fichas de treino para academias

App white-label: você (dono do SaaS) cadastra academias, cada academia ganha um link próprio
(`/sua-academia/login`) com a **logo e a cor dela**, cadastra alunos e monta fichas de treino.
O aluno acessa pelo link com um **código de acesso** e vê o treino do dia, marca como concluído
e acompanha o histórico.

⚠️ **Este é um projeto DEMO, pronto para mostrar a academias, mas ainda não é produção.**
Os dados ficam salvos no `localStorage` do navegador (cada pessoa vê seus próprios dados,
nada é compartilhado entre dispositivos). Veja a seção "Colocar em produção de verdade" pra saber
o que trocar antes de vender de verdade.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Contas de demonstração (já vêm cadastradas)

- **Admin da plataforma (você):** `/admin/login` → `admin@treinosaas.com` / `admin123`
- **Academia de exemplo "Fit Power":** `/fit-power/login` → aba "Sou a academia" → `dono@fitpower.com` / `academia123`
- **Aluno de exemplo (Fit Power):** `/fit-power/login` → aba "Sou aluno" → código `DEMO01`
- Também existe a academia "Vertex Treinos" (`/vertex-treinos/login`) com status **pendente**,
  pra você ver o fluxo de aprovação no painel admin.

## Estrutura do projeto

```
src/
  lib/db.ts         → "banco de dados" (localStorage) com todas as funções de CRUD
  lib/auth.ts        → login/logout simples (sessionStorage)
  context/           → contexto que carrega a academia pela URL (slug) e aplica a marca
  pages/              → páginas: landing, admin, painel da academia, app do aluno
```

Cada academia é identificada por um **slug** (ex: `fit-power`) que vira a URL:
`seusite.com/fit-power/login`. É esse link que você compartilha com cada academia cliente,
e a cor/logo mudam automaticamente conforme o cadastro dela.

## Subir no GitHub

```bash
cd academia-saas
git init
git add .
git commit -m "primeira versão do app de treinos"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO_NO_GITHUB>
git push -u origin main
```

## Subir no Lovable

O Lovable consegue importar um repositório GitHub existente ("Import from GitHub" na tela de
novo projeto). Depois de importado, você pode continuar pedindo ajustes por prompt em português
normalmente, e o Lovable sincroniza de volta com o GitHub.

## Colocar em produção de verdade (recomendado antes de vender)

Hoje tudo roda no navegador (localStorage), o que é ótimo para demonstrar o produto, mas tem duas
limitações importantes: os dados não são compartilhados entre dispositivos, e as senhas ficam em
texto puro no armazenamento local. Para produção, o caminho mais rápido (e o que o próprio Lovable
já integra nativamente) é o **Supabase**:

1. Criar um projeto no Supabase e conectar pelo botão nativo do Lovable.
2. Criar as tabelas `academias`, `alunos`, `planos_treino`, `registros_treino` (os campos já estão
   todos modelados em `src/types.ts` — é praticamente copiar a estrutura).
3. Trocar as funções de `src/lib/db.ts` pelas chamadas equivalentes do Supabase client
   (`supabase.from('academias').select()...`), mantendo os mesmos nomes de função para não
   precisar mexer nas páginas.
4. Trocar `src/lib/auth.ts` pelo Supabase Auth (com Row Level Security, pra cada academia só
   enxergar os próprios alunos) e usar Storage para os uploads de logo em vez de base64.
5. Adicionar cobrança recorrente (ex: Stripe) associada a cada `academia`, controlando o campo
   `status`/`plano` automaticamente conforme o pagamento.

Se quiser, é só voltar nessa conversa e pedir "me ajuda a migrar isso pra Supabase" que eu te
guio passo a passo.

## Ideias para próximas versões

- Notificação (push ou WhatsApp automático) lembrando o aluno de treinar.
- Gráfico de evolução de carga por exercício ao longo do tempo.
- Avaliação física (medidas, fotos) dentro do histórico do aluno.
- App para o personal acompanhar múltiplos alunos em tempo real.

# Studio Val Pinheiro — App de Faturamento

## ✅ Firebase já configurado
As credenciais do Firebase já estão integradas no código (`src/App.jsx`).

---

## 🚀 Como publicar no Vercel (gratuito, ~5 minutos)

### Opção A — Via GitHub (recomendado)

1. Crie conta em **github.com** (pode usar o Gmail da Val)
2. Clique em **"New repository"** → nome: `studio-val-pinheiro` → Create
3. Faça upload de todos os arquivos desta pasta para o repositório
4. Acesse **vercel.com** → "Continue with GitHub" → autorize
5. Clique em **"Add New Project"** → selecione o repositório `studio-val-pinheiro`
6. Clique em **Deploy** — o Vercel detecta o Vite automaticamente
7. Em ~1 minuto você recebe um link como: `studio-val-pinheiro.vercel.app`

### Opção B — Via Vercel CLI

```bash
npm install -g vercel
cd studio-val-pinheiro
npm install
vercel --prod
```

---

## 🔧 Ativar login com Google no Firebase (obrigatório)

1. Acesse **console.firebase.google.com**
2. Selecione o projeto **studio-val-pinheiro**
3. No menu esquerdo: **Authentication → Primeiros passos**
4. Clique em **Google** → ative → salve
5. Vá em **Authentication → Settings → Domínios autorizados**
6. Adicione o domínio do Vercel (ex: `studio-val-pinheiro.vercel.app`)

---

## 📱 Como instalar no iPhone da Val

Depois que o Vercel publicar o app:

1. Abra o **Safari** no iPhone (obrigatório — Chrome não funciona para instalar)
2. Acesse `studio-val-pinheiro.vercel.app`
3. Toque no ícone de **compartilhar** (quadrado com seta ↑ na barra de baixo)
4. Role a lista e toque em **"Adicionar à Tela de Início"**
5. Confirme o nome **"Studio Val"** e toque em **Adicionar**

✅ O app aparece na tela inicial como qualquer app da App Store.
✅ Abre em tela cheia, sem barra do navegador.
✅ Todos os dados ficam salvos na conta Google, para sempre.

---

## ☁️ Segurança dos dados

- Os dados são salvos no **Firebase Firestore** (Google Cloud)
- Cada usuário só acessa os próprios dados (regras de segurança)
- Nunca se perdem, mesmo trocando de celular
- Para acessar de outro dispositivo: basta fazer login com o mesmo Gmail

---

## 📊 Funcionalidades do app

- **Início**: registrar atendimentos, ver faturamento do dia
- **Agenda**: calendário mensal com faturamento por dia
- **Relatórios**: semana / mês / ano, melhor dia, melhor mês, ranking de serviços
- **Config.**: editar preços, histórico completo, exportar CSV, conta Google

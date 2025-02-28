# 📢 Chat em Tempo Real com Autenticação

## 📌 Introdução
Este projeto é uma aplicação de **chat em tempo real**. A solução foi projetada para ser **eficiente, funcional e escalável**.

A aplicação permite que usuários realizem **cadastro e login**, enviem **mensagens em tempo real** via **WebSockets**, e tenham acesso ao **histórico paginado** de mensagens. Além disso, a segurança é garantida por meio de **autenticação JWT** e proteção de rotas.

---

## 🚀 Tecnologias Utilizadas
### **Backend:**
- **Node.js** + **Express** (Servidor backend)
- **TypeScript** (Tipagem segura)
- **PostgreSQL** + **Prisma ORM** (Banco de dados e abstração de consultas)
- **WebSockets (socket.io)** (Mensagens em tempo real)
- **JWT (JSON Web Token)** (Autenticação segura)

### **Frontend:**
- **Next.js** (Framework React para SSR/CSR)
- **TypeScript** (Segurança e padronização)
- **Tailwind CSS** (Estilização rápida e responsiva)
- **WebSockets (socket.io-client)** (Integração do chat em tempo real)
- **Context API** (Gerenciamento de autenticação e estado global)

---

## 📂 Estrutura de Diretórios
```
.
├── backend
│   ├── src
│   │   ├── config
│   │   │   ├── prisma.ts
            ├── socket.ts
│   │   ├── middlewares
│   │   │   ├── auth.ts
│   │   ├── routes
│   │   │   ├── auth.ts
            ├── index.ts
│   │   │   ├── messages.ts
│   │   │   ├── users.ts
│   │   ├── server.ts
│   ├── prisma
│   │   ├── schema.prisma
│   ├── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Chat.tsx
│   │   ├── contexts
│   │   │   ├── AuthContext.tsx
│   │   ├── hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useSocket.ts
│   │   ├── pages
│   │   │   ├── index.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   ├── package.json
│
├── README.md
```

---

## 📜 Funcionalidades Principais
✅ **Autenticação JWT**: Registro, login e logout seguro.  
✅ **WebSockets**: Chat em tempo real.  
✅ **Paginamento**: Mensagens são carregadas dinamicamente.  
✅ **Proteção de Rotas**: Apenas usuários autenticados podem acessar o chat.  
✅ **Frontend responsivo**: Interface intuitiva e adaptada para diferentes dispositivos.  
✅ **Persistência de Dados**: Utiliza PostgreSQL para armazenamento eficiente.  

---

## 📌 Como Rodar o Projeto
### **1️⃣ Clonar o Repositório**
```sh
git clone https://github.com/angelloantonnio/realchat-app.git
cd realchat-app
```

### **2️⃣ Configurar e Rodar o Backend**
```sh
cd backend
npm install
cp .env.example .env  # Configurar variáveis de ambiente
npx prisma migrate dev --name init
npm run dev
```

### **3️⃣ Configurar e Rodar o Frontend**
```sh
cd frontend
npm install
cp .env.example .env  # Configurar variáveis de ambiente
npm run dev
```
Acesse o projeto no navegador em: `http://localhost:3000`

---

## 📡 **Endpoints Principais** (API REST)

### **Usuários**
- `POST /auth/register` → Cadastro de um novo usuário.
- `POST /auth/login` → Login e geração de token JWT.
- `POST /auth/logout` → Logout e revogação do token.

### **Mensagens**
- `GET /messages?page=1&limit=10` → Listagem paginada de mensagens.
- `POST /messages` → Envio de uma nova mensagem (autenticado via JWT).

---

## 🛠️ Possíveis Melhorias Futuras
- 📌 **Sistema de Notificações** (Indicadores de digitação em tempo real).  
- 📌 **Perfis de Usuários** (Foto de perfil e bio).  
- 📌 **Modo Escuro** (Alternância entre light/dark mode).  
- 📌 **Melhoria na Segurança** (Rate limiting e proteção contra ataques comuns).  

---

## 📜 Licença
Este projeto é de uso livre para aprendizado e aprimoramento técnico. Sinta-se à vontade para forkar e melhorar!

---

## 🙌 Agradecimentos
Se você gostou desse projeto, dê uma estrela ⭐ no repositório do GitHub e me acompanhe para mais conteúdo de desenvolvimento! 💜


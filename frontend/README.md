# Hotel Imperium - Frontend

Interface moderna e responsiva para o sistema de gestão do Hotel Imperium, desenvolvida com React, Vite e Tailwind CSS.

## 🚀 Funcionalidades

- **Página de Login** com validação em tempo real
- **Página de Cadastro** com verificação de disponibilidade
- **Dashboard** com estatísticas e visão geral
- **Design Responsivo** para desktop e mobile
- **Validação de Formulários** com react-hook-form
- **Notificações** com react-hot-toast
- **Roteamento** com React Router
- **API Integration** com axios

## 🛠️ Tecnologias

- **React 18** - Biblioteca de interface
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

## 📦 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

3. **Editar `.env` com a URL da API:**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Hotel Imperium
VITE_APP_VERSION=1.0.0
```

4. **Executar em desenvolvimento:**
```bash
npm run dev
```

5. **Build para produção:**
```bash
npm run build
```

## 🎨 Design System

### Cores
- **Primary**: Azul (#0ea5e9)
- **Secondary**: Cinza (#64748b)
- **Success**: Verde (#10b981)
- **Error**: Vermelho (#ef4444)
- **Warning**: Amarelo (#f59e0b)

### Componentes
- **Botões**: `btn-primary`, `btn-secondary`
- **Inputs**: `input-field`, `input-error`
- **Cards**: `card`
- **Formulários**: `form-group`, `form-label`, `form-error`

## 📱 Páginas

### 🔐 Login (`/login`)
- Formulário de autenticação
- Validação de email e senha
- Link para cadastro
- Design responsivo

### 📝 Cadastro (`/register`)
- Formulário completo de cadastro
- Validação em tempo real
- Verificação de disponibilidade de email/CPF
- Validação de CPF com algoritmo
- Feedback visual de disponibilidade

### 📊 Dashboard (`/dashboard`)
- Estatísticas do sistema
- Lista de usuários recentes
- Ações rápidas
- Layout com sidebar

## 🔧 Configuração da API

O frontend se conecta com o backend através do serviço `src/services/api.js`:

```javascript
// Configuração automática baseada em VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

### Endpoints Utilizados:
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `POST /api/auth/check-email` - Verificar email
- `POST /api/auth/check-cpf` - Verificar CPF
- `GET /api/users` - Listar usuários
- `GET /api/users/deleted` - Usuários deletados

## 🎯 Funcionalidades Especiais

### Validação de CPF
- Algoritmo completo de validação
- Formatação automática
- Verificação de disponibilidade

### Verificação em Tempo Real
- Email disponível/disponível
- CPF disponível/disponível
- Feedback visual com ícones

### Responsividade
- Mobile-first design
- Sidebar colapsível
- Grid responsivo
- Breakpoints otimizados

## 🚀 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linter ESLint

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.jsx      # Layout principal
│   └── LoadingSpinner.jsx
├── pages/              # Páginas da aplicação
│   ├── Login.jsx       # Página de login
│   ├── Register.jsx    # Página de cadastro
│   └── Dashboard.jsx   # Dashboard principal
├── services/           # Serviços e APIs
│   └── api.js         # Cliente da API
├── App.jsx            # Componente principal
├── main.jsx           # Ponto de entrada
└── index.css          # Estilos globais
```

## 🔒 Autenticação

- **Token Storage**: localStorage
- **Auto-redirect**: Login automático se autenticado
- **Logout**: Limpeza de dados locais
- **Protected Routes**: Rotas protegidas por autenticação

## 🎨 Personalização

### Cores Customizadas
Edite `tailwind.config.js` para personalizar as cores:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores personalizadas
      }
    }
  }
}
```

### Componentes
Todos os componentes são modulares e podem ser facilmente customizados.

## 🐛 Troubleshooting

### Erro de Conexão com API
1. Verifique se o backend está rodando na porta 3000
2. Confirme a URL no arquivo `.env`
3. Verifique o CORS no backend

### Problemas de Build
1. Limpe o cache: `rm -rf node_modules && npm install`
2. Verifique as dependências
3. Execute `npm run lint` para verificar erros

## 📄 Licença

MIT License - Hotel Imperium © 2024

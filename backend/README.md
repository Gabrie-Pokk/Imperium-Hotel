# Imperium Hotel - Backend API

API REST para gerenciamento de usuários do sistema Imperium Hotel, desenvolvida com Node.js, Express e Supabase.

## 🚀 Funcionalidades

- **CRUD completo de usuários** com validação de dados
- **Autenticação** com hash de senhas (bcrypt)
- **Paginação** para listagem de usuários
- **Soft delete** para exclusão lógica
- **Busca** de usuários por nome ou email
- **Rate limiting** para proteção contra spam
- **Validação robusta** com Joi
- **Logs** de requisições

## 📋 Estrutura da Tabela Usuários

```sql
CREATE TABLE usuarios (
  id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf CHAR(11) NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT NOT NULL,
  senha TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID
);
```

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

3. **Editar `.env` com suas credenciais do Supabase:**
```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

4. **Executar o servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Endpoints da API

### Base URL: `http://localhost:3000`

### 👥 Usuários

#### `GET /api/users`
Lista todos os usuários com paginação.

**Query Parameters:**
- `page` (opcional) - Número da página (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 10, máx: 100)

**Exemplo:**
```bash
GET /api/users?page=1&limit=10
```

#### `GET /api/users/:id`
Busca usuário por ID.

**Exemplo:**
```bash
GET /api/users/123e4567-e89b-12d3-a456-426614174000
```

#### `POST /api/users`
Cria novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "telefone": "11999999999",
  "endereco": "Rua das Flores, 123",
  "senha": "senha123"
}
```

#### `PUT /api/users/:id`
Atualiza usuário existente.

**Body (todos os campos são opcionais):**
```json
{
  "nome": "João Santos",
  "email": "joao.santos@email.com",
  "telefone": "11888888888"
}
```

#### `DELETE /api/users/:id`
Exclui usuário (soft delete).

#### `POST /api/users/login`
Autentica usuário.

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

#### `GET /api/users/search`
Busca usuários por nome ou email.

**Query Parameters:**
- `q` - Termo de busca (mín: 2 caracteres)
- `page` - Página (opcional)
- `limit` - Limite (opcional)

**Exemplo:**
```bash
GET /api/users/search?q=joão&page=1&limit=10
```

### 🏥 Health Check

#### `GET /health`
Verifica se a API está funcionando.

## 📝 Exemplos de Uso

### Criar usuário:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "cpf": "98765432100",
    "telefone": "11987654321",
    "endereco": "Av. Paulista, 1000",
    "senha": "minhasenha123"
  }'
```

### Listar usuários:
```bash
curl http://localhost:3000/api/users?page=1&limit=5
```

### Buscar usuário:
```bash
curl http://localhost:3000/api/users/search?q=maria
```

### Login:
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@email.com",
    "senha": "minhasenha123"
  }'
```

## 🔒 Segurança

- **Rate Limiting**: 100 requisições por 15 minutos por IP
- **Helmet**: Headers de segurança
- **CORS**: Configurado para frontend específico
- **Validação**: Todos os dados são validados com Joi
- **Hash de senhas**: bcrypt com salt rounds 10
- **Soft delete**: Dados não são removidos fisicamente

## 🚨 Tratamento de Erros

A API retorna erros padronizados:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [
    {
      "field": "campo",
      "message": "Erro específico"
    }
  ]
}
```

## 📊 Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (email já existe)
- `429` - Muitas requisições
- `500` - Erro interno

## 🧪 Testes

```bash
npm test
```

## 📦 Scripts Disponíveis

- `npm start` - Executa em produção
- `npm run dev` - Executa em desenvolvimento com nodemon
- `npm test` - Executa testes

## 🔧 Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL da estrutura da tabela `usuarios`
3. Copie as credenciais para o arquivo `.env`
4. Teste a conexão com `/health`

## 📈 Monitoramento

- Logs de requisições no console
- Health check em `/health`
- Rate limiting ativo
- Tratamento de erros global

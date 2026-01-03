# 🚀 Meu Primeiro Projeto com Kafka, NestJS e Microsserviços

## 📖 Sobre o Projeto

Este é **meu primeiro projeto explorando arquitetura de microsserviços** com Apache Kafka e NestJS. O projeto implementa um sistema de processamento de pedidos e pagamentos, onde os microsserviços se comunicam de forma assíncrona através do Kafka.

> ⚠️ **Nota Importante:** Encontrei alguns problemas interessantes durante o desenvolvimento, como incompatibilidade entre o Prisma v7 e o NestJS e também validação de variáveis de ambiente com Zod. Como não encontrei soluções definitivas na web, com ajuda de IA cheguei em soluções criativas (e um pouco "gambiarras" 😅) que deixam o projeto rodar. Este projeto é uma ótima experiência de aprendizado!

---

## 📚 Stack Tecnológico

### Backend & Framework
- **NestJS 11** 
- **TypeScript** 

### Dados
- **Prisma 7**  
- **MariaDB 11.5** 

### Message Broker
- **Apache Kafka 7.8** 
- **KafkaJS** 

### Validação & Configuração
- **Zod** 
- **dotenv**

### Testes & Qualidade
- **Vitest** 
- **ESLint** 
- **Prettier** 

### Ferramentas
- **pnpm** 
- **Docker & Docker Compose** 
- **Kafka UI**

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura de **microserviços** com dois serviços principais:

### 📦 Serviço de Pedidos (`orders`)
- Responsável por criar e gerenciar pedidos
- Publica eventos quando um pedido é criado
- Consome eventos de pagamentos confirmados
- Porta: `3001`
- DB: MariaDB (porta `3306`)

### 💳 Serviço de Pagamentos (`payments`)
- Responsável por processar pagamentos
- Consome eventos de pedidos criados
- Publica eventos quando um pagamento é confirmado
- Porta: `3002`
- DB: MariaDB (porta `3307`)

### 🔄 Fluxo de Comunicação
```
Orders Service → [Pedido Criado] → Kafka Topic
                                       ↓
Payments Service → [Processa Pagamento] → Kafka Topic
                                       ↓
Orders Service → [Confirma Pedido]
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **pnpm** (`npm install -g pnpm`)
- **Docker & Docker Compose**

### 1️⃣ Instalação de Dependências

```bash
pnpm install
```

### 2️⃣ Subir a Infraestrutura (Kafka, MariaDB)

```bash
pnpm docker:dev
```

Isso vai iniciar:
- Kafka (porta `9092`)
- Kafka UI (porta `8080`)
- MariaDB Orders (porta `3306`)
- MariaDB Payments (porta `3307`)

### 3️⃣ Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` na raiz do projeto(`orders` ou `payments`) cole em um arquivo `.env`:

### 4️⃣ Executar Migrações do Banco de Dados

```bash
# Migrations do serviço Orders
pnpm prisma:migrate:orders

# Migrations do serviço Payments
pnpm prisma:migrate:payments
```

### 5️⃣ Iniciar os Microserviços

Em terminais separados:

```bash
# Terminal 1 - Serviço de Pedidos
pnpm start:dev orders

# Terminal 2 - Serviço de Pagamentos
pnpm start:dev payments
```

Os serviços estarão rodando em:
- Orders: `http://localhost:3333`
- Payments: `http://localhost:3444`

---

## 📊 Monitorando o Kafka

Acesse a UI do Kafka em `http://localhost:8080` para:
- Ver tópicos e partições
- Monitorar mensagens em tempo real
- Verificar consumer groups

---

## 🧪 Testes

```bash
# Executar testes unitários
pnpm test

# Teste em watch mode
pnpm test:watch

# Cobertura de testes
pnpm test:cov

# Testes E2E
pnpm test:e2e
```

---

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm build` | Build do projeto |
| `pnpm start` | Inicia o projeto |
| `pnpm start:dev` | Inicia em modo desenvolvimento com watch |
| `pnpm start:prod` | Inicia em modo produção |
| `pnpm lint` | Executa ESLint e corrige |
| `pnpm format` | Formata código com Prettier |
| `pnpm test` | Executa testes |
| `pnpm docker:dev` | Sobe infraestrutura com Docker |
| `pnpm prisma:migrate:orders` | Migration do Orders |
| `pnpm prisma:migrate:payments` | Migration do Payments |

---

## 🎯 Desafios e Aprendizados

### 1. **Incompatibilidade Prisma v7 com NestJS**
O Prisma v7 teve algumas mudanças que causaram conflitos com a injeção de dependência do NestJS. A solução foi criar um módulo customizado para instanciar o Prisma Client corretamente.

### 2. **Validação de Variáveis de Ambiente com Zod**
Implementar validação de `.env` com Zod no contexto de uma monorepo com múltiplos microserviços foi desafiador. Cada serviço tem suas próprias variáveis, então tive que criar um sistema modular de validação.

### 3. **Comunicação Assíncrona com Kafka**
Aprender como estruturar consumers e producers de forma correta foi crucial. O desafio foi entender o ciclo de vida dos consumers e garantir que as mensagens fossem processadas no ordem correta.

## 🤝 Contribuições e Sugestões

Este é um projeto de aprendizado e estou aberto a:
- 💡 Sugestões de melhorias
- 🐛 Identificação de problemas
- 📚 Boas práticas de microsserviços
- 🚀 Otimizações de performance

Qualquer feedback é bem-vindo! Deixe uma issue ou abra uma discussão.

---

## 📄 Licença

UNLICENSED - Projeto de estudos pessoais

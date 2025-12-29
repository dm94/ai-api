# AI API (Fastify Edition)

This repository is a modified version of [midudev/bun-ai-api](https://github.com/midudev/bun-ai-api), migrated to use **Fastify** and **Node.js** with enhanced features and modular architecture.

## 🚀 Key Changes & Features

### 1. Framework Migration (Bun → Fastify)

- Switched from Bun's native server to **Fastify**, a high-performance web framework for Node.js.
- Replaced `bun run` with `tsx` for TypeScript execution.
- Dependency management via `pnpm`.

### 2. Enhanced Architecture

- **Service Rotation (Round Robin):** Implemented a load-balancing strategy that rotates between available AI services (`Groq`, `Cerebras` and `OpenRouter`) for each request.
- **Modular Routing:** Utilizes `@fastify/autoload` to automatically load routes from the `routes/` directory.

### 3. Security & Middleware

- **API Key Authentication:** Added a `preHandler` hook to validate the `apikey` header on every request.
- **Rate Limiting:** Integrated `@fastify/rate-limit` to restrict traffic (default: 100 requests per minute).
- **CORS Support:** Configured `@fastify/cors` for secure cross-origin requests.

### 4. Streaming Support

- The chat endpoint (`POST /chat`) fully supports **Server-Sent Events (SSE)** for streaming AI responses.

## 🛠️ Project Structure

```bash
.
├── routes/          # API Routes (loaded automatically)
├── services/        # AI Service implementations (Groq, Cerebras)
├── index.ts         # Application entry point & configuration
├── types.ts         # TypeScript definitions
└── package.json     # Dependencies & scripts
```

## 📦 Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd ai-api
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file based on `.env.example`:

    ```env
    PORT=3000
    LOG_LEVEL=info
    API_KEY=your-secure-api-key
    GROQ_API_KEY=your-groq-key
    CEREBRAS_API_KEY=your-cerebras-key
    ```

4.  **Run the server:**
    ```bash
    pnpm start
    ```

## 🔌 API Usage

### Chat Completion

**Endpoint:** `POST /chat`
**Headers:**

- `Content-Type: application/json`
- `apikey: <YOUR_API_KEY>`

**Body:**

```json
{
  "messages": [{ "role": "user", "content": "Hello, how are you?" }]
}
```

**Response:**
Streamed text (SSE).

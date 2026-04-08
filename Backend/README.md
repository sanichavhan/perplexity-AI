# Perplexity Backend

Node.js/Express backend server with MongoDB, Socket.io, and AI integration.

## Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- API keys for:
  - Google Generative AI (Gemini)
  - Mistral AI
  - Tavily Search API

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in all required API keys and credentials
```bash
PORT=3000
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_key
MISTRAL_API_KEY=your_key
TAVILY_API_KEY=your_key
MONGODB_URI=your_mongodb_uri
```

### Development

Start the development server with hot-reload:
```bash
npm run dev
```

Server will run on `http://localhost:3000`

### Project Structure

```
Backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Request handlers
│   ├── routes/               # API routes
│   ├── models/               # MongoDB schemas
│   ├── services/             # Business logic (AI, Search)
│   ├── middleware/           # Custom middleware
│   ├── validators/           # Request validators
│   └── sockets/              # Socket.io handlers
├── server.js                 # Entry point
├── .env.example              # Environment template
└── package.json
```

### Features

- User authentication with JWT
- Real-time chat with Socket.io
- AI-powered responses (Gemini, Mistral)
- Internet search integration (Tavily)
- MongoDB persistence
- CORS enabled

### API Endpoints

- `GET /` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/chats` - Get user chats
- `POST /api/chats` - Create new chat
- `DELETE /api/chats/:id` - Delete chat

### Socket Events

- `connection` - Client connects
- `send_message` - Send chat message
- `receive_message` - Receive AI response
- `disconnect` - Client disconnects

### Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 3000) |
| JWT_SECRET | Secret key for JWT tokens |
| MONGODB_URI | MongoDB connection string |
| GEMINI_API_KEY | Google Generative AI key |
| MISTRAL_API_KEY | Mistral AI API key |
| TAVILY_API_KEY | Tavily Search API key |
| GOOGLE_* | Google OAuth credentials |

### Troubleshooting

**Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**MongoDB connection failed:**
- Verify MONGODB_URI is correct
- Check network access in MongoDB Atlas
- Ensure IP is whitelisted

**Missing API keys:**
- All API keys are required
- Get them from respective provider dashboards

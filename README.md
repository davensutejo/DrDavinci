# 🏥 Dr. Davinci - Advanced Clinical Support System

An intelligent medical diagnosis assistant powered by **Google's Gemini AI**, featuring real-time clinical consultations, symptom analysis, and medical literature integration.

## ✨ Features

### 🤖 AI-Powered Diagnostics
- Real-time disease matching based on symptoms
- Natural language processing for symptom extraction
- Integration with Google Gemini API for advanced analysis
- Grounding sources with clinical references

### 👤 User Authentication
- Secure signup with email validation
- Login with remember-me functionality
- Token-based authentication (30-day expiry)
- bcryptjs password hashing (12 salt rounds)
- Rate limiting protection

### 💬 Chat Interface
- Real-time message streaming
- Image upload support (for medical images)
- Voice input capability
- Message persistence with timestamps
- Session-based chat history

### 📋 Consultation Management
- View complete chat history
- Search past consultations
- Filter by title or content
- Session-based organization
- Automatic session titling

### 🎨 User Experience
- Responsive design (mobile & desktop)
- Smooth animations and transitions
- Dark-mode compatible
- Disclaimer management with session persistence
- Dismissible alerts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (free at https://makersuite.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Dr-Davinci.git
cd Dr-Davinci

# Install dependencies
npm install
cd server && npm install && cd ..

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_api_key_here

# Start development servers
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000/api

## 📁 Project Structure

```
Dr-Davinci/
├── components/                 # React components
│   ├── AuthView.tsx           # Login/signup interface
│   ├── DiagnosisResult.tsx    # Diagnosis display
│   ├── SearchConsultations.tsx # Search modal
│   └── Disclaimer.tsx          # Medical disclaimer
│
├── services/                   # Business logic
│   ├── authService.ts         # Authentication
│   ├── historyService.ts      # Chat/session management
│   ├── apiClient.ts           # API communication
│   ├── inferenceService.ts    # Disease matching
│   └── nlpService.ts          # Symptom extraction
│
├── server/                     # Express backend
│   ├── routes/
│   │   ├── auth.ts            # Authentication endpoints
│   │   └── history.ts         # Session/message endpoints
│   ├── database.ts            # SQLite schema & initialization
│   └── index.ts               # Server entry point
│
├── types.ts                    # TypeScript interfaces
├── constants.ts               # App constants
└── App.tsx                     # Main application component
```

## 🔧 Technology Stack

### Frontend
- **React** 19.2 - UI framework
- **TypeScript** - Type safety
- **Vite** 6.4.1 - Build tool
- **Tailwind CSS** - Styling
- **@google/genai** - Gemini API client

### Backend
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **crypto** - Token generation
- **TypeScript** - Type safety

## 🔐 Security Features

✅ **Authentication**
- bcryptjs hashing with 12 salt rounds
- Token-based with expiry
- Rate limiting (5 attempts / 15 minutes)
- Password validation requirements

✅ **Database**
- SQL injection prevention (parameterized queries)
- Foreign key constraints
- Unique constraints on username & email
- Proper indexes for performance

✅ **API Protection**
- CORS enabled for localhost
- Environment variable protection
- Secure session handling
- Token expiry management

## 📊 Database Schema

### Users Table
- `id` (PRIMARY KEY)
- `username` (UNIQUE)
- `email` (UNIQUE)
- `password_hash`
- `name`
- `auth_token`
- `token_expiry`
- `created_at`, `updated_at`

### Chat Sessions Table
- `id` (PRIMARY KEY)
- `user_id` (FOREIGN KEY → users)
- `title`
- `created_at`, `updated_at`

### Messages Table
- `id` (PRIMARY KEY)
- `session_id` (FOREIGN KEY → chat_sessions)
- `role` (user/assistant)
- `content`
- `timestamp`
- `image_url`, `extracted_symptoms`, `grounding_sources`, `analysis_results`

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/signup        - Register new user
POST   /api/auth/login         - User login
POST   /api/auth/logout        - User logout
```

### Chat History
```
GET    /api/history/sessions   - Get all sessions for user
GET    /api/history/session/:id - Get specific session
POST   /api/history/session    - Create new session
POST   /api/history/message    - Save message
```

## 🌱 Environment Variables

Create a `.env` file (use `.env.example` as template):

```env
GEMINI_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:5000/api
```

## 📝 Usage

1. **Sign Up**
   - Create account with email, username, name
   - Password must contain uppercase, lowercase, and numbers

2. **Start Consultation**
   - Click "New Consultation"
   - Describe your symptoms
   - Optionally upload medical images

3. **AI Analysis**
   - Real-time response from Gemini AI
   - Disease matching with confidence scores
   - Clinical references included

4. **View History**
   - Access past consultations
   - Search by title or content
   - Review complete chat transcripts

## 🎨 Features in Detail

### Symptom Analysis
- Natural language processing
- Multi-symptom support
- Automatic extraction from descriptions

### Disease Matching
- Inference engine with scoring
- Confidence-based ranking
- Related conditions display

### Clinical References
- Grounding sources from medical literature
- Clickable links to sources
- Evidence-based recommendations

## 🚦 Development

### Available Scripts

```bash
# Frontend development
npm run dev                # Start dev server with hot reload
npm run build             # Build for production
npm run preview           # Preview production build

# Backend development (in server/)
npm run dev              # Start backend dev server
npm run build            # TypeScript compilation
```

### Code Style
- ESLint configured for TypeScript
- Tailwind CSS for consistent styling
- Component-based architecture
- Service layer for business logic

## 📈 Future Enhancements

- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Export consultation as PDF
- [ ] Integration with electronic health records
- [ ] Real-time notifications
- [ ] Dark mode theme toggle
- [ ] Mobile app (React Native)
- [ ] Prescription generation

## 📄 License

This project is provided as-is for educational and research purposes.

## ⚠️ Medical Disclaimer

**This application is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or feedback, please open an issue on GitHub.

---

**Made with ❤️ using React, Express, and Gemini AI**

![Dr. Davinci Logo](./favicon.svg)

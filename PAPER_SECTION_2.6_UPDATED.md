# Arsitektur Sistem Dr. Davinci - Medical AI Chatbot

## 2.6 Arsitektur Sistem Chatbot Medis (Updated)

Sistem Dr. Davinci mengimplementasikan arsitektur modern untuk chatbot medis yang mengintegrasikan teknologi web terkini dengan layanan AI generatif. Berikut adalah komponen-komponen utama yang bekerja secara terintegrasi:

### 2.6.1 Antarmuka Pengguna (Frontend)

Frontend Dr. Davinci dibangun menggunakan **React 19.2** dengan **TypeScript** untuk type safety dan maintainability yang optimal. Teknologi ini dipilih untuk:

- **Responsif Design**: Antarmuka beradaptasi dengan perangkat desktop, tablet, dan mobile
- **Real-time Communication**: Implementasi streaming pesan untuk pengalaman chat yang smooth
- **State Management**: React hooks untuk mengelola state kompleks seperti riwayat chat, session aktif, dan data pengguna
- **Styling**: Tailwind CSS untuk UI yang konsisten dengan animasi smooth yang meningkatkan UX
- **Aksesibilitas**: Implementasi WCAG compliance untuk memastikan aksesibilitas bagi semua pengguna

Komponen-komponen kunci meliputi:
- **AuthView**: Form signup/login dengan validasi password strength dan email validation
- **ChatInterface**: Area input gejala dengan support gambar dan voice input
- **SearchConsultations**: Modal pencarian dengan filter untuk riwayat konsultasi
- **DiagnosisResult**: Tampilan hasil diagnosis dengan referensi literatur medis

### 2.6.2 Modul Pemrosesan Bahasa Alami (NLP Engine)

Modul NLP di Dr. Davinci diimplementasikan melalui dua pendekatan hybrid:

**A. Local Symptom Extraction (`nlpService.ts`):**
- **Normalisasi Teks**: Input pengguna dinormalisasi dengan lowercase dan removal special characters
- **Keyword Matching**: Menggunakan regex dengan word boundaries untuk mendeteksi entitas gejala
- **Symptom Database**: Koleksi ~50 gejala umum dengan multiple keyword aliases untuk deteksi yang robust
- **Output**: Vektor fitur berupa symptom IDs yang terdeteksi dari input teks

Implementasi menggunakan pendekatan rule-based yang efficient dan interpretable:
```
Input: "Saya demam, sakit kepala, dan batuk selama 3 hari"
→ Normalisasi: "saya demam sakit kepala dan batuk selama 3 hari"
→ Symptom IDs: ["fever", "headache", "cough"]
```

**B. Advanced NLP via Gemini AI:**
- Integration dengan **Google Gemini API** untuk understanding konteks medis yang lebih dalam
- Mampu menangani input kompleks dan ambiguous dari pasien
- Memberikan respons natural language yang disesuaikan dengan konteks percakapan
- Grounding sources: Sistem menambahkan clinical references dari medical literature

### 2.6.3 Manajemen Dialog dan Konteks

Sistem Dr. Davinci menyimpan konteks percakapan di level **session-based**:

- **Session Management**: Setiap pengguna dapat memiliki multiple chat sessions
- **Message History**: Pesan disimpan dengan timestamp, sender (user/assistant), dan metadata
- **Context Preservation**: Bot dapat merujuk kembali ke gejala atau jawaban sebelumnya
- **Persistence**: Data disimpan di SQLite untuk akses jangka panjang dan analytics

Database schema untuk konteks:
```
chat_sessions:
  - id (unique session identifier)
  - user_id (foreign key)
  - title (auto-generated dari first symptom)
  - created_at, updated_at

messages:
  - id (unique message identifier)
  - session_id (foreign key)
  - role (user/assistant)
  - content (message text)
  - image_url (opsional untuk medical images)
  - extracted_symptoms (JSON array)
  - grounding_sources (clinical references)
  - timestamp
```

### 2.6.4 Mesin Inferensi (Inference Engine)

Dr. Davinci mengimplementasikan **dual-layer inference system**:

**Layer 1 - Local Inference (`inferenceService.ts`):**
- **Disease Matching**: Memetakan symptom set ke kemungkinan diagnosis
- **Scoring Algorithm**: Menggunakan weighted combination dari sensitivity dan specificity:
  - Sensitivity = matched_symptoms / total_disease_symptoms (0.7 weight)
  - Specificity = matched_symptoms / user_symptoms (0.3 weight)
  - Combined Score = (sensitivity × 0.7) + (specificity × 0.3)
- **Filtering**: Hanya hasil dengan score > 0.15 yang ditampilkan
- **Ranking**: Hasil diurutkan descending berdasarkan confidence score

**Layer 2 - AI-Powered Analysis (Gemini Integration):**
- Menerima symptoms ekstraksi dan hasil local inference
- Menggunakan advanced language understanding untuk clinical reasoning
- Menghasilkan diagnosis differential dengan explanations detail
- Memberikan rekomendasi clinical follow-up

Kombinasi kedua layer memberikan:
1. **Interpretability**: Local inference memberikan transparent reasoning
2. **Accuracy**: Gemini AI menambah nuanced understanding
3. **Safety**: Local layer sebagai sanity check untuk output AI

### 2.6.5 Basis Data Medis (Knowledge Base)

Dr. Davinci menggunakan **structured medical knowledge base** di `constants.ts`:

**A. Symptoms Database:**
- ~50 common medical symptoms dengan kategorisasi
- Setiap symptom memiliki multiple keyword aliases untuk robust detection
- Format:
```json
{
  "id": "fever",
  "name": "Fever",
  "keywords": ["fever", "demam", "panas", "tinggi temperatur"],
  "category": "vital_signs"
}
```

**B. Diseases Database:**
- ~30 penyakit umum dengan symptom profiles
- Setiap penyakit memiliki daftar symptoms yang associated
- Metadata termasuk severity, recommendations, dan references
- Format:
```json
{
  "id": "influenza",
  "name": "Influenza (Flu)",
  "symptoms": ["fever", "cough", "fatigue", "body_ache"],
  "description": "Acute viral respiratory infection...",
  "severity": "medium",
  "recommendations": ["Rest", "Hydration", "Antipyretics"]
}
```

**C. Grounding Sources:**
- Integrasi dengan clinical guidelines dari WHO, CDC, dan literatur medis terkini
- Setiap diagnosis disertai dengan evidence-based references
- Links ke official medical resources untuk user yang ingin belajar lebih lanjut

### 2.6.6 Backend dan Manajemen Infrastruktur

Backend Dr. Davinci dibangun dengan **Express.js** dan **TypeScript**, menyediakan:

**A. API Architecture:**
```
POST   /api/auth/signup      - Register pengguna baru
POST   /api/auth/login       - User authentication
POST   /api/auth/logout      - Session termination
GET    /api/history/sessions - Retrieve user's chat history
GET    /api/history/session/:id - Get specific session details
POST   /api/history/session  - Create new consultation session
POST   /api/history/message  - Save message dengan deduplication logic
```

**B. Database Layer (SQLite):**
- ACID compliance untuk data consistency
- Foreign key constraints untuk referential integrity
- Indexed queries untuk performance optimization
- Connection pooling dengan configurable busy timeout

**C. Security Implementation:**
- **Authentication**: Token-based auth dengan 30-day expiry
- **Password Security**: bcryptjs hashing dengan 12 salt rounds (OWASP standard)
- **Rate Limiting**: 5 attempts per 15 minutes untuk login/signup
- **Input Validation**: Strict validation untuk semua user inputs
- **SQL Injection Prevention**: Parameterized queries untuk semua DB operations
- **CORS Protection**: Configured untuk trusted origins only
- **Email Validation**: Required field dengan format checking
- **Username Uniqueness**: Database constraint untuk prevent duplicates

**D. Data Privacy:**
- Sensitive configuration (.env) excluded dari version control
- User passwords hashed dan tidak pernah tersimpan plain text
- Session tokens dengan automatic expiry
- Audit logs untuk semua access dan modifications

### 2.6.7 Alur Sistem Terintegrasi

Berikut adalah flow end-to-end dari input pengguna ke diagnosis output:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER INPUT                                               │
│ "Saya demam 38°C, batuk, dan sakit kepala sejak 2 hari"   │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────v────────────────────────────────────────────┐
│ 2. NLP PROCESSING (LOCAL)                                   │
│ - Normalisasi teks                                          │
│ - Keyword matching → Extract: [fever, cough, headache]     │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────v────────────────────────────────────────────┐
│ 3. INFERENCE - LOCAL ENGINE                                │
│ - Match symptoms ke disease database                        │
│ - Compute weighted scores                                  │
│ - Results: Influenza (0.89), Cold (0.72), ...             │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────v────────────────────────────────────────────┐
│ 4. AI ENHANCEMENT (GEMINI)                                  │
│ - Enriched analysis dengan clinical context                │
│ - Natural language explanation                             │
│ - Treatment recommendations                                │
│ - Evidence-based grounding sources                         │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────v────────────────────────────────────────────┐
│ 5. RESPONSE GENERATION                                      │
│ - Formatted diagnosis dengan confidence scores              │
│ - Actionable recommendations                               │
│ - Clinical references & links                              │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────v────────────────────────────────────────────┐
│ 6. DATA PERSISTENCE                                         │
│ - Save message to database                                  │
│ - Update session history                                   │
│ - Index untuk future searches                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.6.8 Stack Teknologi

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19.2, TypeScript, Tailwind CSS, Vite | UI/UX responsif dengan real-time streaming |
| **Backend** | Express.js, TypeScript | RESTful API dan business logic |
| **Database** | SQLite3 | Persistent storage dengan ACID compliance |
| **Security** | bcryptjs, crypto module | Password hashing dan token generation |
| **AI/LLM** | Google Gemini API | Advanced NLP dan clinical reasoning |
| **Build** | TypeScript compiler, Vite | Type-safe compilation dan bundling |
| **Deployment** | Node.js 18+ | Server runtime |

### 2.6.9 Keunggulan Arsitektur

1. **Hybrid Approach**: Kombinasi local inference (interpretable) + AI generatif (accurate)
2. **Privacy-First**: Data user tersimpan lokal, bukan cloud (optional untuk self-hosted)
3. **Scalability**: Modular design memudahkan horizontal scaling dan feature expansion
4. **Type Safety**: Full TypeScript implementation mengurangi runtime errors
5. **Performance**: Local NLP layer untuk fast responsiveness sebelum AI processing
6. **Auditability**: Structured logging dan clear separation of concerns untuk debugging
7. **Accessibility**: WCAG compliant UI dengan responsive design
8. **Security**: Industry-standard practices untuk data protection

Arsitektur Dr. Davinci dirancang untuk balance antara accuracy (via AI), interpretability (via local inference), dan user experience (via responsive frontend), menjadikannya solusi chatbot medis yang robust untuk clinical support.

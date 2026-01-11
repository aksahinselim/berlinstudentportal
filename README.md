# Berlin Student Portal

A digital platform designed for university students in Berlin to connect, share knowledge, and support each other. The site allows verified students to ask and answer questions anonymously within their own university community.

**Note:** This project was developed as a final assignment for a university course, demonstrating full-stack web development skills and modern best practices.

![Berlin Student Portal](./public/bsp-logo.jpg)

## 🎯 Project Overview

Berlin Student Portal is a Q&A platform where verified university students can:
- Ask questions anonymously within their university community
- Share knowledge and help fellow students
- Connect through verified student identities
- Access university-specific discussion channels

## 🌟 Features

- **User Verification**: Every student is verified through their university email and student ID photo check
- **Anonymous Q&A**: Ask and answer questions anonymously within your university community
- **Multi-University Support**: Students can join multiple universities and switch between them
- **University Channels**: Scoped discussions per university (36 Berlin universities supported)
- **File Attachments**: Share PDFs, images, and documents with posts and replies
- **Voting System**: Upvote/downvote questions and answers with local vote persistence
- **Real-time Search**: Client-side search across questions, tags, and content
- **Multi-language Support**: Interface available in English, German, and Turkish
- **Draft Posts**: Auto-save post drafts while composing
- **Admin Panel**: Admin interface for reviewing and approving verification requests
- **Email OTP**: Secure one-time password verification via email
- **Responsive Design**: Optimized for mobile, tablet, and desktop (360px to 1920px+)
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and reduced motion support

## 🛠 Tech Stack

### Frontend
- **Vue 3** (Composition API) - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional-grade animation library
- **VueUse Motion** - Composable Vue animations
- **Lucide Vue** - Beautiful & consistent icons
- **Vue Router** - Client-side routing
- **Pinia** - State management with persistence

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL 15** - Relational database
- **Prisma ORM** - Type-safe database client
- **TypeScript** - Type-safe backend development
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service for OTP verification
- **Multer** - File upload handling
- **AWS SDK** - S3/MinIO storage integration
- **Zod** - Schema validation
- **Express Rate Limit** - API rate limiting

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving

## 📋 Scope

This platform focuses on:
- Verified student-only access within Berlin universities
- Anonymous Q&A functionality for academic support
- University-specific discussion channels
- File attachment sharing for collaborative learning
- Multi-language support (EN, DE, TR)
- Mobile-first responsive design

## ⚠️ Limitations

- Email verification requires SMTP configuration
- File storage defaults to local (supports S3/MinIO/FTP)
- Admin panel requires manual verification approval
- No real-time chat or messaging system
- No notification system (email only)
- Single-region deployment (Berlin universities)

## 🎨 Design System

- **Primary Color**: `#E2382A` (Red accent for CTAs)
- **Black**: `#000000` (Text and headings)
- **White**: `#FFFFFF` (Background)
- **Font**: Arial (system font for fast loading)
- **Style**: Minimal, modern, premium

## 📦 Installation

### Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Node.js 18+** (for local development without Docker)
- **npm or pnpm** (for local development without Docker)

### 🐳 Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/berlin_student_portal.git
cd berlin_student_portal

# Create environment file
cp env.example .env

# Build and start all services
docker-compose up --build -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# PostgreSQL: localhost:5432
```

**Default Admin Login:**
- Email: `admin@example.invalid`
- Password: `password`

### 💻 Local Development (Without Docker)

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Start PostgreSQL (you'll need it running separately)
# Update backend/.env with your database credentials

# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:4000`

## 🔐 Environment Variables

Create a `.env` file in the root directory (frontend) and `backend/.env` (backend):

### Frontend `.env`:
```bash
VITE_API_URL=http://localhost:4000
```

### Backend `backend/.env`:
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/student_portal
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=student_portal

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
MAIL_FROM=Your App <your-email@example.com>

# OTP Configuration
OTP_TTL_MINUTES=10
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN_SECONDS=60

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Storage (local, s3, or ftp)
STORAGE_TYPE=local
```

**Note**: See `env.example` and `backend/env.example` for complete configuration options.

## 📁 Project Structure

```
berlin_student_portal/
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Auth & validation middlewares
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Backend entry point
│   ├── uploads/             # File uploads directory
│   ├── init.sql             # Database schema & seed data
│   ├── Dockerfile           # Backend Docker config
│   ├── package.json
│   └── tsconfig.json
├── src/                      # Vue.js frontend
│   ├── api/                 # API service layer
│   ├── assets/              # Static assets
│   ├── components/          # Reusable components
│   ├── i18n/                # Internationalization (EN, DE, TR)
│   ├── layouts/             # Layout components
│   ├── pages/               # Page components
│   ├── store/               # Pinia stores (auth, app, i18n, draft)
│   ├── types/               # TypeScript types
│   ├── utils/               # Helper functions
│   ├── App.vue
│   ├── main.ts
│   ├── router.ts
│   └── style.css
├── public/                  # Public assets
│   ├── bsp-logo.png
│   └── bsp-logo.jpg
├── docker-compose.yml       # Docker orchestration
├── Dockerfile               # Frontend Docker config
├── nginx.conf               # Nginx configuration
├── env.example              # Environment variables template
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Usage

### Demo Accounts

The app includes pre-configured demo accounts:

**Admin Account**
- Email: `admin@example.invalid`
- Password: `password`
- Status: Verified
- Admin: Yes

**Test User**
- Register with any university email
- Status: Pending (requires admin approval)

### Key Features Walkthrough

1. **Home Page**: Hero section with parallax animations and feature overview
2. **Registration**: Two-step registration with university email validation
3. **Login**: Simple authentication with demo accounts
4. **Verification**: Mock camera interface for student ID verification
5. **Feed**: University-scoped Q&A feed with filters, search, and tags
6. **Post Detail**: Full question view with replies and voting
7. **Profile**: Account status and preferences management
8. **Admin Panel**: Review and approve/reject verification requests

## 🎭 Animations

The app uses multiple animation techniques:

- **GSAP**: Parallax effects on hero section
- **VueUse Motion**: Page transitions and element reveals
- **CSS Transitions**: Smooth hover effects and micro-interactions
- **Reduced Motion Support**: Respects user's motion preferences

## 🔐 Authentication Flow

```
Register → Verification (Pending) → Admin Approval → Verified → Full Access
```

## 🌐 Routing

- `/` - Home page
- `/register` - User registration
- `/login` - User login
- `/verification` - Identity verification
- `/feed` - Q&A feed (requires auth)
- `/post/:id` - Post detail (requires auth)
- `/profile` - User profile (requires auth)
- `/admin` - Admin panel (requires admin role)
- `*` - 404 page

## 📱 Responsive Breakpoints

- **Mobile**: 360px - 767px
- **Tablet**: 768px - 1279px
- **Desktop**: 1280px+

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Color contrast compliant (WCAG 2.1 AA)
- Screen reader friendly
- Reduced motion support

## 🔄 State Management

The app uses Pinia with four stores:

- **auth.ts**: User authentication, profile management, and session handling
- **app.ts**: Universities, posts, replies, verifications, and voting state
- **i18n.ts**: Multi-language support and translation management
- **draft.ts**: Auto-save draft posts with localStorage persistence

All data is fetched from the backend API and cached in the store. Authentication tokens and user preferences are persisted in localStorage.

## 🎨 Theming

Tailwind CSS is configured with custom colors:

```js
colors: {
  primary: '#E2382A',
  black: '#000000',
  white: '#FFFFFF',
}
```

## 🗄️ Database

PostgreSQL database managed with Prisma ORM:

### Tables:
- **universities**: 36 Berlin universities with email domains
- **users**: User accounts with verification status and soft delete support
- **user_universities**: Many-to-many relationship for multi-university support
- **posts**: Questions and discussions with voting and tags
- **replies**: Answers to questions with voting
- **attachments**: File uploads linked to posts and replies
- **verifications**: Student ID verification requests with admin approval workflow
- **otps**: One-time passwords for email verification

Database schema is automatically created from `backend/init.sql` on first Docker run, with Prisma migrations available for schema management.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts/:id/vote` - Vote on post

### Replies
- `GET /api/replies` - Get replies for post
- `POST /api/replies` - Create new reply
- `POST /api/replies/:id/vote` - Vote on reply

### Universities
- `GET /api/universities` - Get all universities
- `GET /api/universities/:id` - Get university by ID

### Verifications
- `POST /api/verifications` - Submit verification
- `GET /api/verifications` - Get all verifications (admin)
- `PUT /api/verifications/:id/status` - Update verification status (admin)

## 🤝 Contributing

This project was developed as a university final assignment. While it includes a functional full-stack implementation, contributions and improvements are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### For Production Use:
- Configure proper SMTP credentials for email verification
- Set up secure environment variables
- Implement rate limiting and security headers
- Configure file storage (S3, MinIO, or FTP)
- Set up SSL/TLS certificates
- Implement proper monitoring and logging

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Academic Use**: This project was created as a university final assignment. Feel free to use it as a reference or learning material.

## 👥 Credits

- **Design & Development**: Berlin Student Portal Team
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Fonts**: Arial (System Font)
- **Framework**: Vue.js, Express.js, PostgreSQL
- **Purpose**: University Course Final Assignment

## 📧 Contact

Use the repository's Issues tab for project questions. Do not publish personal information, credentials, or student verification documents.

## 🐳 Docker Services

The application runs three Docker containers:
1. **Frontend** (Nginx + Vue.js) - Port 3000
2. **Backend** (Express.js + TypeScript) - Port 4000
3. **Database** (PostgreSQL 15) - Port 5432

All services are connected via a Docker network and can communicate using service names.

---

**Note**: This is a full-stack application with Vue.js frontend, Express.js backend, and PostgreSQL database. All components are containerized with Docker for easy deployment.


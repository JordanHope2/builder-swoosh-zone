# JobEqual Platform

A comprehensive job platform built with React, TypeScript, and Vite, featuring advanced analytics, messaging, subscription management, and role-based dashboards.

## 🚀 Features

### Core Platform

- **Multi-Role System**: Candidate, Recruiter, Company, and Admin dashboards
- **Real-time Messaging**: Advanced chat system with file sharing
- **Subscription & Billing**: Comprehensive pricing plans with Stripe integration
- **Job Discovery**: Swipe-based job matching with AI recommendations
- **Advanced Analytics**: Revenue analysis, user metrics, and security monitoring

### Technical Features

- **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Animations**: Framer Motion for smooth interactions
- **Security**: Input validation, XSS protection, CSRF tokens
- **Accessibility**: WCAG compliance, keyboard navigation, screen reader support
- **Internationalization**: Multi-language support (EN, DE, FR, IT, RM)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd jobequal-platform
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Fill in your environment variables:

- Supabase credentials
- Stripe keys for payments
- SMTP settings for emails
- OpenAI API key for AI features

### 3. Database Setup (Supabase)

#### Install Supabase CLI

```bash
npm install -g supabase
```

#### Initialize Supabase

```bash
supabase login
supabase init
supabase start
```

#### Run Migrations

```bash
supabase db reset
```

#### Generate Types

```bash
supabase gen types typescript --local > shared/types/supabase.ts
```

### 4. Development

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### 5. Build for Production

```bash
npm run build
```

## 🔧 VS Code Setup

### Recommended Extensions

The project includes VS Code configuration with recommended extensions:

- Prettier (code formatting)
- Tailwind CSS IntelliSense
- TypeScript support
- Supabase integration

### Auto Setup

Open the project in VS Code and install recommended extensions when prompted.

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Vercel Deploy

```bash
npm install -g vercel
vercel --prod
```

### Netlify Deployment

The project includes `netlify.toml` configuration:

1. Connect repository to Netlify
2. Set environment variables
3. Deploy automatically

## 📊 Database Schema

### Core Tables

- `users` - User accounts and profiles
- `companies` - Company information
- `jobs` - Job postings
- `applications` - Job applications
- `messages` - Chat messages
- `subscriptions` - Payment subscriptions
- `notifications` - User notifications

### Key Relationships

- Users can be candidates, recruiters, or company admins
- Companies have multiple job postings
- Jobs receive multiple applications
- Users can message each other
- Subscriptions determine feature access

## 🔐 Security Features

### Input Validation

- All user inputs are sanitized
- XSS protection on all text fields
- File upload validation
- SQL injection prevention

### Authentication

- JWT-based authentication via Supabase
- Role-based access control
- Session management
- Password strength requirements

### Data Protection

- GDPR compliance features
- Data encryption
- Secure API endpoints
- Rate limiting

## 🎨 Architecture

### Frontend Structure

```
client/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── ...             # Feature components
├── pages/              # Page components
├── contexts/           # React contexts
├── lib/               # Utilities and configurations
└── global.css         # Global styles
```

### Backend Structure

```
server/
├── routes/            # API routes
└── index.ts          # Server entry point
```

### Shared

```
shared/
├── api.ts            # API types
└── types/            # Shared TypeScript types
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Type Checking

```bash
npm run typecheck
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and type checking
4. Submit a pull request

## 📚 Documentation

### Key Components

- **Navigation**: Main navigation with notifications
- **Dashboard Systems**: Role-specific dashboards
- **Messaging**: Real-time chat functionality
- **Subscription**: Payment and billing management
- **Security**: Input validation and protection

### Styling

- Tailwind CSS for styling
- Custom JobEqual design system
- Dark/light theme support
- Responsive design

### State Management

- React Context for global state
- Local state for component-specific data
- Supabase for server state

## 🔗 Integrations

### Supabase

- Authentication
- Database
- Real-time subscriptions
- File storage

### Stripe

- Payment processing
- Subscription management
- Webhook handling

### External APIs

- OpenAI for AI features
- Email services for notifications
- File storage services

## 📈 Analytics & Monitoring

### Built-in Analytics

- User activity tracking
- Revenue metrics
- Security monitoring
- System health checks

### External Monitoring

- Sentry for error tracking
- Performance monitoring
- User analytics

## 🚀 Performance

### Optimizations

- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

### Caching

- Browser caching
- API response caching
- Static asset caching

## 📱 Mobile Support

### Responsive Design

- Mobile-first approach
- Touch-friendly interactions
- Progressive Web App features

### Accessibility

- Screen reader support
- Keyboard navigation
- High contrast mode
- Reduced motion support

---

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Dev server runs on port 8080
2. **Environment variables**: Ensure all required vars are set
3. **Database connection**: Check Supabase credentials
4. **Build errors**: Run `npm run typecheck` first

### Getting Help

- Check the GitHub issues
- Review the documentation
- Contact support team

---

**Built with ❤️ by the JobEqual Team**

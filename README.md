# 📦 Staff Product Rental Tracker

A modern, full-stack web application for managing staff product rentals in retail environments. Built with React 19, TypeScript, and Firebase, featuring real-time data synchronization, user authentication, and automated CI/CD deployment.


## 🌟 Features

### 🏪 Product Management
- **CRUD Operations** - Create, read, update, and delete products
- **Serial Number Tracking** - Unique serial number management with duplicate prevention
- **SKU-based Grouping** - Multiple products can share the same SKU with different serial numbers
- **Store Location Management** - Multi-location inventory tracking (CAR, SYD, MEL, BRI, PER)
- **Real-time Updates** - Instant synchronization across all users

### 👥 Rental Management
- **Book Out Products** - Staff can rent products with due dates
- **Check In Process** - Return workflow with automatic status updates
- **Rental History** - Complete audit trail of all rental activities
- **Current vs Historical** - Separate views for active and completed rentals
- **Smart Pre-filling** - Context-aware form population from product pages

### 🔐 User Authentication
- **Firebase Authentication** - Secure email/password login
- **User Registration** - Account creation with profile management
- **Role-based Access** - Admin and Staff role system
- **Protected Routes** - Secure access control throughout the application
- **User Profiles** - Editable user information and department tracking

### 📱 User Experience
- **Modern UI** - Clean interface with shadcn/ui components and Tailwind CSS
- **Real-time Notifications** - Instant feedback with toast messages
- **Loading States** - Smooth user experience with loading indicators
- **Form Validation** - Comprehensive input validation with Zod schemas

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with modern hooks and concurrent features
- **TypeScript** - Full type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS v4** - Latest utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Hook Form** - Performant form handling with validation
- **Zustand** - Lightweight state management solution
- **React Router DOM v7** - Modern client-side routing

### Backend & Database
- **Firebase Firestore** - NoSQL real-time database with offline support
- **Firebase Authentication** - Enterprise-grade user management
- **Firebase Hosting** - Global CDN deployment with automatic SSL
- **Firestore Security Rules** - Database-level access control
- **Composite Indexes** - Optimized query performance for complex filters

### Development & Testing
- **Vitest** - Fast unit testing framework with native TypeScript support
- **Testing Library** - Component testing utilities for React
- **ESLint** - Code quality and consistency enforcement
- **TypeScript Strict Mode** - Maximum type safety and error prevention


### CI/CD & Deployment
- **GitHub Actions** - Automated workflows for quality assurance
- **Continuous Integration** - Automated lint, test, and build verification
- **Preview Deployments** - Automatic preview environments for pull requests
- **Production Deployment** - Automated deployment to Firebase Hosting
- **Environment Management** - Secure secrets and configuration management

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Firebase account (optional for local development)
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/Staff_Rental.git
cd Staff_Rental

# Install dependencies
npm install

# Start development server (uses real Firebase)
npm run dev
```

### Firebase Setup (Optional)
If you want to use your own Firebase project:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Authentication
3. Copy your Firebase config and create `.env` file:
```bash
VITE_FB_API_KEY=your_api_key_here
VITE_FB_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FB_PROJECT_ID=your_project_id
VITE_FB_STORAGE_BUCKET=your_project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=123456789
VITE_FB_APP_ID=1:123456789:web:abcdef
```

### Development Commands
```bash
# Development
npm run dev                 # Start development server with hot reload

# Code Quality
npm run lint               # Run ESLint for code quality
npm run lint --fix         # Auto-fix ESLint issues

# Testing
npm test                   # Run tests in watch mode
npm run test:run          # Run tests once (CI mode)
npm run test:ui           # Run tests with UI dashboard

# Build & Deploy
npm run build             # Build for production
npm run preview           # Preview production build locally
```


## 🔧 Key Features Implementation

### Product Management
- **Unique Serial Numbers** - Enforced at database level with transactions
- **SKU Sharing** - Multiple items can share the same SKU
- **Real-time Status** - Instant updates across all clients
- **Transaction Safety** - Atomic operations ensure data consistency

### Rental System
- **Atomic Operations** - Rental creation and product updates are atomic
- **Product Snapshots** - Historical records preserve product details
- **Due Date Tracking** - Visual indicators for overdue items
- **Audit Trail** - Complete history of all activities

### Authentication & Security
- **Firebase Auth Integration** - Industry-standard authentication
- **Role-based Access Control** - Admin and Staff permissions
- **Route Protection** - Secure access throughout the app
- **Database Security** - Firestore rules enforce access control



### Planned Features
- **Advanced Search & Filtering** - Multi-field search capabilities
- **Reporting & Analytics** - Usage statistics and insights
- **Notification System** - Automated reminders and alerts
- **Batch Operations** - Bulk import/export functionality
- **Performance Monitoring** - Analytics integration


## ⚖️ Pros & Cons

### Pros
- **Modern Tech Stack** - React 19, TypeScript, Tailwind CSS v4, latest tooling
- **Real-time Sync** - Instant data updates across all users with Firebase
- **Type Safety** - Full TypeScript coverage prevents runtime errors
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Authentication** - Secure user management with role-based access
- **Test Coverage** - 62 comprehensive test cases ensure reliability
- **CI/CD** - Automated deployment with GitHub Actions
- **Developer Experience** - Hot reload, ESLint, and modern tooling
- **Scalable Architecture** - Clean separation of concerns and modular design
- **Production Ready** - Live deployment with global CDN

### Cons
- **Firebase Dependency** - Locked into Google's ecosystem
- **Bundle Size** - Large initial bundle (~935KB) due to Firebase SDK
- **Offline Limitations** - Limited offline functionality
- **Cost Scaling** - Firebase costs can increase with heavy usage
- **Missing Advanced Features** - No bulk operations or advanced reporting yet


## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Firebase](https://firebase.google.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [React Testing Library](https://testing-library.com/) for testing utilities

# 📦 Staff Product Rental Tracker

Full-stack web application for managing staff product rentals in retail environments. Built with React, TypeScript, and Firebase, featuring real-time data synchronization, user authentication, and automated CI/CD deployment.


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
- Firebase account
- Git

## 🚀 Getting Started

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd Staff_Rental

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands
```bash
# Run the application
npm run dev                 # Start development server

# Code Quality
npm run lint               # Run ESLint for code quality
npm run lint --fix         # Auto-fix ESLint issues

# Testing
npm test                   # Run tests in watch mode
npm run test:run          # Run tests once (CI mode)
npm run test:ui           # Run tests with UI dashboard

# Build & Deploy
npm run build             # Build for production
npm run preview           # Preview production build
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
- **Type Safety** - Full TypeScript coverage prevents runtime errors
- **Test Coverage** - 62 comprehensive test cases ensure reliability
- **CI/CD Ready** - Automated deployment with GitHub Actions
- **Developer Experience** - Hot reload, ESLint, and modern tooling
- **Scalable Architecture** - Clean separation of concerns and modular design
- **Production Ready** - Live deployment with global CDN

### Cons
- **Firebase Dependency** - Locked into Google's ecosystem
- **Bundle Size** - Large initial bundle (~935KB) due to Firebase SDK
- **Cost Scaling** - Firebase costs can increase with heavy usage
- **Mobile App** - Web-only solution, no native mobile apps
- **Advanced Features** - Missing some enterprise features (bulk operations, advanced reporting)

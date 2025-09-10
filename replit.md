# Overview

This is the Haydovchi Test Platform, a comprehensive test preparation web application built for driving test practice. The application provides users with multiple test formats including standardized bilets, topic-specific practice, and official real tests with timing and scoring systems. It features a modern React-based frontend with a clean, educational-focused design inspired by Linear and Notion, complete with user authentication, progress tracking, and detailed analytics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using functional components and hooks
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state and React Context for authentication
- **Styling**: Tailwind CSS with shadcn/ui component library using the "new-york" style variant
- **Theme System**: Custom light/dark theme implementation with CSS variables and system preference detection
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation for mobile and fixed sidebar for desktop

## Backend Architecture
- **Framework**: Express.js with TypeScript running in ESM mode
- **Database Layer**: Drizzle ORM with PostgreSQL support, configured for Neon Database
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **API Design**: RESTful endpoints with centralized error handling and request logging middleware
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development and database implementation for production

## Component System
- **Design System**: Comprehensive shadcn/ui components with custom styling overrides
- **Layout Components**: Responsive sidebar navigation, mobile drawer, and adaptive layouts
- **Test Interface**: Specialized components for question display, navigation, timing, and progress tracking
- **Charts**: Recharts integration for test result visualization with pie charts and progress indicators

## Authentication & Authorization
- **User Management**: Session-based authentication with user profile management
- **Protected Routes**: Context-based authentication state management with loading states
- **Form Handling**: React Hook Form with Zod validation schemas for type-safe form validation

## Build & Development
- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript**: Strict mode with path mapping for clean imports
- **Development**: Hot module replacement with error overlay for enhanced developer experience
- **Production**: Bundled Express server with static file serving for single-deployment architecture

# External Dependencies

## Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **connect-pg-simple**: PostgreSQL-backed session storage for user authentication

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible component primitives for all interactive elements
- **Lucide React**: Consistent icon library with tree-shaking support
- **Recharts**: Data visualization library for test analytics and progress charts

## Development & Build
- **Vite**: Frontend build tool with React plugin and TypeScript support
- **ESBuild**: Backend bundling for production deployment
- **PostCSS**: CSS processing with Autoprefixer for cross-browser compatibility

## Runtime & Utilities
- **React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation integration
- **date-fns**: Date manipulation and formatting utilities
- **class-variance-authority**: Type-safe CSS class composition for component variants
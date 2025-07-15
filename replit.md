# Job Application Management System

## Overview

This is a full-stack job application tracking system built with React and Express.js. The application helps users manage their job search process by tracking job URLs, applications, and personal preferences. It features a modern UI built with shadcn/ui components and Tailwind CSS, with Supabase for database storage, Cloudflare for file storage, and NextAuth for authentication.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component-based React application** using TypeScript
- **shadcn/ui design system** with comprehensive UI components
- **Responsive design** with mobile-first approach using Tailwind CSS
- **Custom hooks** for data fetching and mobile detection
- **Form management** with react-hook-form and Zod validation
- **Toast notifications** for user feedback

### Backend Architecture
- **Express.js REST API** with TypeScript
- **Modular route organization** in `server/routes.ts`
- **Storage abstraction layer** with both in-memory and database implementations
- **Request logging middleware** for API monitoring
- **Error handling middleware** for consistent error responses

### Database Schema
The application manages four main entities:
- **Users**: Basic user authentication (username/password)
- **User Preferences**: Qualifications, work experience, and job preferences
- **Job URLs**: Tracked job postings with metadata (company, position, location, status)
- **Applications**: Submitted job applications with tracking status

### Data Storage Strategy
- **Dual storage implementation**: In-memory storage for development/testing and database storage for production
- **Drizzle ORM integration** with PostgreSQL for type-safe database operations
- **Schema-first approach** with shared type definitions between client and server

## Data Flow

1. **Client requests** are made through TanStack Query hooks
2. **API endpoints** handle CRUD operations for all entities
3. **Storage layer** abstracts database operations with a common interface
4. **Form validation** occurs on both client (Zod schemas) and server sides
5. **Real-time updates** through query invalidation after mutations

## External Dependencies

### Core Framework Dependencies
- **React 18** with TypeScript for the frontend
- **Express.js** for the backend API
- **Vite** for build tooling and development server
- **Drizzle ORM** for database operations

### UI and Styling
- **@radix-ui** components for accessible UI primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **shadcn/ui** component library

### Database and Validation
- **@neondatabase/serverless** for PostgreSQL connectivity
- **Zod** for runtime type validation
- **react-hook-form** for form management

## Deployment Strategy

### Development Setup
- **Vite dev server** for hot module replacement
- **Express server** with TypeScript compilation via tsx
- **Database migrations** managed through Drizzle Kit
- **Environment variables** for database configuration

### Production Build
- **Client build** outputs to `dist/public` directory
- **Server build** bundles to `dist/index.js` using esbuild
- **Static file serving** from the Express server
- **Database migrations** applied via `db:push` command

### Build Process
1. Frontend assets are built with Vite and output to `dist/public`
2. Backend code is bundled with esbuild for Node.js execution
3. The production server serves both API routes and static assets
4. Database schema changes are applied through Drizzle migrations

## Changelog

```
Changelog:
- July 08, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
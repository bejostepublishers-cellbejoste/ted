# Creator-Brand Marketplace

## Overview

A two-sided marketplace platform connecting content creators with brands for collaboration opportunities. The platform facilitates deal discovery, secure messaging, payment processing, and subscription management. Built with a modern React frontend and Express backend, featuring a PostgreSQL database via Neon and Stripe integration for payments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite as the build tool

**Routing**: Wouter for client-side routing with the following key routes:
- Public pages: Home, Login, Signup
- Protected pages: Dashboard, Deal Management, Messages, Search, Subscription

**State Management**: TanStack Query (React Query) for server state management with automatic caching and refetching

**UI Component System**: 
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Design follows marketplace aesthetics inspired by professional platforms (Upwork, Fiverr) with Linear's clean dashboard approach

**Form Handling**: React Hook Form with Zod schema validation, ensuring type-safe form validation that matches backend schemas

**Key Design Patterns**:
- Role-based UI rendering (Creator vs Brand views)
- Polling-based real-time messaging (3-second intervals)
- Token-based authentication stored in localStorage
- Responsive design with mobile-first approach

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API with the following main route groups:
- `/api/auth` - User authentication (signup, login)
- `/api/deals` - Deal/opportunity management
- `/api/messages` - In-platform messaging
- `/api/payments` - Stripe payment processing
- `/api/subscription` - Subscription management

**Authentication & Authorization**:
- JWT-based authentication using jsonwebtoken
- Bearer token authentication via Authorization headers
- Password hashing with bcrypt
- Auth middleware validates tokens on protected routes

**Security Features**:
- Off-platform communication blocking via content filtering in messages
- Middleware prevents sharing of contact information (email, phone, social media handles)
- Raw body preservation for Stripe webhook signature verification

**Database Layer**:
- Drizzle ORM for type-safe database queries
- Repository pattern implemented via DatabaseStorage class
- Schema-first approach with Zod validation

### Database Schema

**Technology**: PostgreSQL via Neon serverless database with WebSocket connections

**Core Tables**:

1. **users** - User accounts with role differentiation
   - Stores: name, email, hashed password, role (creator/brand)
   - Subscription status tracking (hasSubscription, Stripe IDs)

2. **deals** - Collaboration opportunities
   - Links brands to creators
   - Tracks status flow: pending → accepted → paid → completed
   - Stores title, description, and amount

3. **messages** - In-platform communication
   - Associates messages with specific deals
   - Links to sender for attribution
   - Content filtering applied at creation

4. **subscriptions** - Subscription records
   - Tracks active/inactive status
   - Links to users for subscription verification

**Relationships**:
- One-to-many: User → Created Deals (as brand)
- One-to-many: User → Accepted Deals (as creator)
- One-to-many: Deal → Messages
- One-to-many: User → Subscriptions

**Migration Strategy**: Drizzle Kit for schema management with push-based migrations

### External Dependencies

**Payment Processing**: Stripe
- API Version: 2023-10-16
- Features used:
  - Payment Intents for one-time deal payments
  - Checkout Sessions for subscription management
  - Webhook integration for payment confirmations
- Required environment variables: `STRIPE_SECRET_KEY`

**Database**: Neon Serverless PostgreSQL
- WebSocket-based connections via `@neondatabase/serverless`
- Connection pooling for performance
- Required environment variables: `DATABASE_URL`

**Authentication**: 
- JWT (jsonwebtoken) for session management
- Bcrypt for password hashing
- Required environment variables: `SESSION_SECRET`

**Asset Management**:
- Static assets stored in `/attached_assets` directory
- AI-generated placeholder images for UI elements

**Development Tools**:
- Replit-specific plugins for development environment
- Vite runtime error overlay for debugging
- TypeScript for type safety across the stack

**UI Component Dependencies**:
- Radix UI primitives for accessible component foundation
- Tailwind CSS for utility-first styling
- Lucide React for iconography
- React Hook Form + Zod for form validation
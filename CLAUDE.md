# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development

- `pnpm run dev` - Start development server on port 3000
- `pnpm run build` - Build for production (runs TypeScript compilation + Vite build)
- `pnpm run preview` - Preview production build locally

### Code Quality

- `pnpm run lint` - Run ESLint with strict TypeScript rules
- `pnpm run typecheck` - Run TypeScript type checking for app code
- `pnpm run typecheck:node` - Run TypeScript type checking for Node.js config files

### Testing

- `pnpm run test` - Run Playwright E2E tests with UI
- `pnpm run test-ct` - Run Playwright component tests
- Single test: `pnpm run test -- --grep "test name"`

### Docker & SSL Setup

- `./setup-ssl.sh` - Generate mkcert SSL certificates for local development
- `docker compose up --build` - Build and run app with nginx and SSL
- Access via: https://music-manager.app (requires adding to hosts file)

## Architecture Overview

### Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with React Compiler (babel-plugin-react-compiler)
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand + TanStack Query for server state
- **API Communication**: Connect-RPC with gRPC-Web transport
- **Styling**: Tailwind CSS v4 with Radix UI components
- **Testing**: Playwright for E2E and component tests

### Core Architecture Patterns

#### API Layer

- Uses Connect-RPC for type-safe gRPC communication
- Generated clients from protobuf definitions (`@buf/dmytrolesyk_music-manager-api`)
- Transport configured in `src/lib/network/connectrpc.ts`
- React Query integration via `@connectrpc/connect-query`

#### State Management

- **Client State**: Zustand stores (e.g., `tracks-store.ts`)
- **Server State**: TanStack Query with Connect-RPC integration
- **URL State**: Custom hook `useTracksPageSearchParamsState` for pagination/search

#### Component Structure

- **Features**: Domain-specific components in `src/features/tracks/`
- **UI Components**: Reusable components in `src/ui/` (shadcn/ui style)
- **Routing**: File-based routing with `src/routes/` directory

### Key Directories

```
src/
├── features/tracks/           # Track management feature
│   ├── components/           # Track-specific components
│   ├── hooks/               # Custom hooks for tracks
│   ├── lib/                 # Queries, schemas, utilities
│   └── store/               # Zustand store
├── lib/network/             # API client and network utilities
├── routes/                  # TanStack Router routes
└── ui/                      # Reusable UI components
```

### Testing Strategy

- E2E tests in `tests/e2e/` using Playwright
- Component tests in `tests/component/` using Playwright CT
- Test containers for backend integration via `testcontainers`
- CI/CD setup with Docker and SSL certificates

### Development Environment

- Uses mkcert for local SSL certificates
- Docker setup with nginx for production-like testing
- Strict TypeScript configuration with `strictTypeChecked`
- ESLint with React Compiler rules

## Important Notes

- The app requires a backend API running on the configured `VITE_API_HOST`
- SSL setup is required for proper testing in CI/CD
- Uses pnpm as package manager (workspace configured)
- React Compiler is enabled for optimization

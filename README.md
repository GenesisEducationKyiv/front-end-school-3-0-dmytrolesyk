# Music Manager App

A modern music management application built with React 19, TypeScript, and Connect-RPC, featuring a containerized architecture with SSL support.

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with React Compiler
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand + TanStack Query
- **API Communication**: Connect-RPC with gRPC-Web
- **Styling**: Tailwind CSS v4 with Radix UI components
- **Testing**: Playwright for E2E and component tests
- **Containerization**: Docker with nginx and SSL

## Prerequisites

- **Node.js** 20+ and **pnpm**
- **Docker** and **Docker Compose**
- **mkcert** (for SSL certificates)

## Quick Start

### Option 1: Development Server (Recommended for development)

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Access your app:**
   - Development: http://localhost:3000

### Option 2: Docker Setup (Production-like environment)

1. **Generate SSL certificates:**
   ```bash
   chmod +x setup-ssl.sh
   ./setup-ssl.sh
   ```

2. **Start with Docker:**
   ```bash
   pnpm docker:dev
   ```

3. **Access your app:**
   - HTTPS: https://localhost
   - HTTP: http://localhost (redirects to HTTPS)

## Available Scripts

### Development
- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally

### Code Quality
- `pnpm lint` - Run ESLint with strict TypeScript rules
- `pnpm typecheck` - Run TypeScript type checking for app code
- `pnpm typecheck:node` - Run TypeScript type checking for Node.js config files

### Testing
- `pnpm test` - Run Playwright E2E tests with UI
- `pnpm test-ct` - Run Playwright component tests

### Docker
- `pnpm docker:build` - Build frontend Docker image
- `pnpm docker:up` - Start all services (frontend + backend)
- `pnpm docker:down` - Stop and remove all containers
- `pnpm docker:logs` - Show logs from all services
- `pnpm docker:dev` - Build, start, and follow logs (one command)

## Environment Configuration

The application uses environment variables for configuration:

### `.env` (Docker/Production)
```bash
VITE_API_HOST=https://localhost          # API endpoint for Docker setup
PLAYWRIGHT_BASE_URL=https://localhost    # Base URL for E2E tests against Docker
```

### `.env.example` (Development template)
```bash
VITE_API_HOST=http://localhost:8000      # API endpoint for dev server
PLAYWRIGHT_BASE_URL=http://localhost:3000 # Base URL for E2E tests against dev server
```

Copy `.env.example` to `.env` and modify as needed for your environment.

## Architecture

### Frontend Architecture
- **Component Structure**: Feature-based organization (`src/features/tracks/`)
- **State Management**: Zustand for client state, TanStack Query for server state
- **Routing**: File-based routing with TanStack Router
- **API Layer**: Connect-RPC with generated TypeScript clients from protobuf

### Docker Architecture
- **Multi-stage build**: Optimized Docker image with separate build and runtime stages
- **SSL termination**: nginx handles HTTPS with mkcert-generated certificates
- **Network isolation**: Separate frontend and backend networks for security
- **Production-ready**: Includes compression, caching, and security headers

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

## CI/CD Pipeline

The project includes comprehensive GitHub Actions workflows:

### Workflows
- **Build**: Validates code quality, runs tests, and builds Docker images
- **Playwright (Dev)**: Runs E2E tests against development server (manual trigger)
- **Playwright (Docker)**: Runs E2E tests against production-like Docker setup

### Reusable Actions
- **setup-node-pnpm**: Configures Node.js, pnpm with optimized caching
- **setup-docker-ssl**: Sets up Docker Buildx, installs mkcert, generates SSL certificates

### Features
- Automated SSL certificate generation in CI
- Docker image validation with backend integration
- Comprehensive test coverage (component + E2E)
- Artifact collection for debugging

## SSL Certificate Setup

### Why mkcert?
`mkcert` provides trusted local SSL certificates without browser warnings:
- ✅ Automatically installs certificates in system trust store
- ✅ Works seamlessly across all browsers
- ✅ Simple one-command setup

### Installation
```bash
# macOS
brew install mkcert

# Linux (Ubuntu/Debian)
sudo apt install libnss3-tools
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert

# Windows (Chocolatey)
choco install mkcert
```

### Generate Certificates
```bash
# Automatic setup
./setup-ssl.sh

# Manual setup
mkcert -install
mkdir -p ssl
mkcert -key-file ssl/music-manager.key -cert-file ssl/music-manager.crt localhost 127.0.0.1 ::1
```

## Development Workflow

### Local Development
1. Copy `.env.example` to `.env`
2. Run `pnpm install`
3. Start development: `pnpm dev`
4. Run tests: `pnpm test` or `pnpm test-ct`

### Docker Development
1. Generate SSL certificates: `./setup-ssl.sh`
2. Start containers: `pnpm docker:dev`
3. Access at https://localhost
4. View logs: `pnpm docker:logs`
5. Stop containers: `pnpm docker:down`

## Testing

### E2E Testing
- **Development server**: `pnpm test` (against http://localhost:3000)
- **Docker container**: Tests run automatically in CI against https://localhost
- **Component tests**: `pnpm test-ct`

### CI/CD Testing
- Automatic testing on push/PR to main branches
- Docker-based E2E testing with SSL
- Manual dev server testing available

## Troubleshooting

### Common Issues
1. **Port conflicts**: Stop services on ports 80, 443, 3000, 8000
2. **SSL certificate issues**: Run `mkcert -install` and regenerate certificates
3. **Docker build fails**: Ensure SSL certificates exist before building
4. **API connection issues**: Check VITE_API_HOST in your .env file

### Debugging Commands
```bash
# View Docker logs
pnpm docker:logs

# Check container status
docker ps

# Rebuild from scratch
pnpm docker:down && pnpm docker:dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test` and `pnpm test-ct`
5. Check code quality: `pnpm lint` and `pnpm typecheck`
6. Submit a pull request

## Security Notes

- SSL certificates are for development only
- Never commit sensitive data to version control
- The setup includes security headers for production use
- Backend API runs on separate network in Docker setup

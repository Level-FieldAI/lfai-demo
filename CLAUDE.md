# Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with autofix
- `npm run typecheck` - Run TypeScript compiler check (tsc -b)

# Code Style Guidelines
- TypeScript: Strict type checking with explicit return types
- React: Functional components with hooks
- Imports: Use path aliases (@/* points to ./src/*)
- Formatting: 2 spaces, 80 char line limit, single quotes, trailing commas
- Naming: PascalCase for components/types, camelCase for variables/functions
- Components: One per file, index.tsx for exports
- Types: Define interfaces with PascalCase prefixed with 'I'
- Error handling: Try/catch with toast notifications (use toast hook)
- State management: React hooks with context for global state
- ESLint: Follow recommended React hooks rules
- Prettier: Semi-colons, avoid parentheses in arrow functions

# Architecture
- API folder: Backend integration with Tavus
- Components: Organized by feature with reusable UI elements in /ui
- Config: Environment and application settings
- Types: Shared type definitions
- Daily.co integration for video functionality
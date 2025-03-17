# Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with autofix

# Code Style Guidelines
- TypeScript: Strict type checking with explicit return types
- React: Functional components with hooks
- Imports: Use path aliases (@/* points to ./src/*)
- Formatting: 2 spaces, 80 char line limit, single quotes
- Naming: PascalCase for components/types, camelCase for variables/functions
- Components: One per file, index.tsx for exports
- Types: Define interfaces with PascalCase prefixed with 'I'
- Error handling: Try/catch with toast notifications for user-facing errors
- State management: React hooks with appropriate local/global state

# Architecture
- API folder: Backend integration with Tavus
- Components: Organized by feature with reusable UI elements in /ui
- Config: Environment and application settings
- Types: Shared type definitions
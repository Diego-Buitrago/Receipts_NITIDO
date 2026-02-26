# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start development server (Vite)
yarn build        # Type-check and build for production
yarn lint         # Run ESLint
yarn preview      # Preview production build
```

## Tech Stack

- React 19 + TypeScript + Vite (SWC)
- TailwindCSS + PrimeReact (saga-green theme, Spanish locale)
- TanStack Query for server state
- React Router DOM v7 with lazy loading
- React Hook Form for forms
- Axios for HTTP requests

## Architecture

```
src/
├── api/           # Axios instance (axiosApi.ts) - baseURL: localhost:5000 in dev
├── app/           # Feature modules organized by domain (e.g., Receipts/)
│   └── [Feature]/pages/   # Feature-specific pages
├── components/    # Shared UI components (Template.tsx has reusable headers)
├── context/       # Auth state management using Context + useReducer pattern
├── interfaces/    # Shared TypeScript interfaces (AxiosError, BasicForm, etc.)
├── plugins/       # Service providers
│   ├── TanStackProvider.tsx  # QueryClient wrapper with devtools
│   └── ToastService.ts       # Singleton for PrimeReact Toast notifications
├── router/        # React Router config with PrivateRoute/PublicRoute guards
└── utils/         # Helpers: validations, formatters (Spanish messages)
```

## Key Patterns

- **ToastService**: Static singleton - use `ToastService.success()`, `ToastService.error()`, `ToastService.apiError(error)` for notifications
- **Auth**: Currently disabled in main.tsx; uses `AuthContext` + `authReducer` with token stored in cookies
- **Routes**: Lazy-loaded via `React.lazy()` - add new pages in `src/app/[Feature]/pages/`
- **API errors**: Use the `AxiosError` interface from `src/interfaces/general.ts`
- **Form validation**: Use functions from `src/utils/validations.ts` (Spanish error messages)

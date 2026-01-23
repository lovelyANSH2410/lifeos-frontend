# LifeOS Project Structure

This document outlines the industry-standard folder structure for the LifeOS frontend application.

## Directory Structure

```
lifeos/
├── src/                          # Source code directory
│   ├── components/               # React components
│   │   ├── common/              # Reusable UI components (buttons, inputs, etc.)
│   │   │   ├── SidebarItem.tsx
│   │   │   └── index.ts
│   │   ├── layout/              # Layout components (headers, sidebars, etc.)
│   │   └── features/            # Feature-specific components
│   │       ├── Dashboard.tsx
│   │       ├── EntertainmentView.tsx
│   │       ├── DateNightView.tsx
│   │       ├── MoneyView.tsx
│   │       ├── VaultView.tsx
│   │       ├── TravelView.tsx
│   │       ├── SubscriptionsView.tsx
│   │       ├── JournalView.tsx
│   │       └── index.ts
│   ├── hooks/                   # Custom React hooks
│   │   └── index.ts
│   ├── utils/                   # Utility functions (formatters, validators, etc.)
│   │   └── index.ts
│   ├── services/                # API services and external integrations
│   │   └── index.ts
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   ├── constants/               # Application constants
│   │   └── index.ts
│   ├── contexts/                # React Context providers
│   │   └── index.ts
│   ├── assets/                  # Static assets
│   │   ├── images/             # Image files
│   │   └── icons/              # Icon files
│   ├── styles/                  # Global styles
│   │   └── index.css
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── .env.local                   # Environment variables
```

## Import Aliases

The project uses the `@/` alias to reference the `src/` directory:

- `@/components` → `src/components`
- `@/types` → `src/types`
- `@/utils` → `src/utils`
- `@/hooks` → `src/hooks`
- `@/services` → `src/services`
- `@/constants` → `src/constants`
- `@/contexts` → `src/contexts`

## Best Practices

1. **Components**: 
   - Place reusable UI components in `components/common/`
   - Place feature-specific components in `components/features/`
   - Place layout components in `components/layout/`

2. **Types**: 
   - Keep all TypeScript interfaces and types in `types/index.ts`
   - For larger projects, consider splitting into multiple files (e.g., `types/user.ts`, `types/movie.ts`)

3. **Hooks**: 
   - Create custom hooks in `hooks/` directory
   - Export them from `hooks/index.ts` for easier imports

4. **Utils**: 
   - Keep pure utility functions in `utils/`
   - Group related utilities in separate files (e.g., `utils/date.ts`, `utils/format.ts`)

5. **Services**: 
   - Place API calls and external service integrations in `services/`
   - Create separate service files for different domains (e.g., `services/api.ts`, `services/auth.ts`)

6. **Constants**: 
   - Store application-wide constants in `constants/`
   - Use TypeScript enums or const objects for type safety

7. **Contexts**: 
   - Place React Context providers in `contexts/`
   - Export providers and hooks from `contexts/index.ts`

## Adding New Features

When adding a new feature:

1. Create feature-specific components in `components/features/`
2. Add related types to `types/index.ts`
3. Create API services in `services/` if needed
4. Add custom hooks in `hooks/` if the feature requires reusable logic
5. Update the feature's index.ts file for easier imports

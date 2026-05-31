# PhiloMind

Monorepo project powered by **Express.js** (backend) and **React Native / Expo** (frontend).

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Frontend | Expo SDK 56, React Native 0.85, React 19          |
| Styling  | TailwindCSS v4 + NativeWind v5 + react-native-css |
| Backend  | Express.js 5, TypeScript 5                        |
| Monorepo | npm workspaces                                    |
| Shared   | @philo-mind/shared (types, constants, utilities)  |

## Design

🎨 **UI/UX Design:** [Stitch Project](https://stitch.withgoogle.com/projects/16360193101983963529)

## Project Structure

```
philo-mind/
├── apps/
│   ├── backend/                 # Express.js API server
│   │   ├── src/
│   │   │   ├── config/          # App configuration
│   │   │   ├── controllers/     # Route controllers
│   │   │   ├── middleware/       # Express middleware
│   │   │   ├── models/          # Data models
│   │   │   ├── routes/          # Route definitions
│   │   │   ├── services/        # Business logic
│   │   │   ├── types/           # TypeScript types
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── validators/      # Input validation
│   │   │   ├── __tests__/       # Tests
│   │   │   └── index.ts         # Entry point
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                # React Native (Expo) app
│       ├── src/
│       │   ├── app/             # Expo Router pages
│       │   ├── components/      # Reusable UI components
│       │   ├── constants/       # App constants
│       │   ├── features/        # Feature modules
│       │   ├── hooks/           # Custom React hooks
│       │   ├── lib/             # Utilities (cn, etc.)
│       │   ├── navigation/      # Navigation config
│       │   ├── services/        # API services
│       │   ├── stores/          # State management
│       │   ├── tw/              # TailwindCSS components
│       │   ├── types/           # TypeScript types
│       │   ├── utils/           # Utility functions
│       │   ├── assets/          # App assets
│       │   ├── __tests__/       # Tests
│       │   └── global.css       # TailwindCSS global styles
│       ├── assets/              # Static assets (icons, images)
│       ├── metro.config.js      # Metro + NativeWind config
│       ├── postcss.config.mjs   # PostCSS for TailwindCSS v4
│       ├── nativewind-env.d.ts  # NativeWind type declarations
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/                  # Shared types & utilities
│       ├── src/
│       │   ├── types/
│       │   ├── constants/
│       │   ├── utils/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
├── package.json                 # Root monorepo config
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Installation

```bash
# Install all dependencies from root
npm install
```

### Development

```bash
# Start backend (Express.js)
npm run backend:dev

# Start frontend (Expo)
npm run frontend:dev

# Start for specific platform
npm run frontend:ios
npm run frontend:android
npm run frontend:web

# Build shared package
npm run shared:build
```

### Using TailwindCSS in Frontend

Import CSS-wrapped components from `@/tw`:

```tsx
import { View, Text, ScrollView } from "@/tw";
import { Image } from "@/tw/image";
import { cn } from "@/lib/utils";

export default function MyScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className={cn("p-4 gap-4", isSpecial && "bg-primary")}>
        <Text className="text-xl font-bold text-gray-900">Hello TailwindCSS!</Text>
      </View>
    </ScrollView>
  );
}
```

## Scripts Reference

| Script                     | Description                   |
| -------------------------- | ----------------------------- |
| `npm run backend:dev`      | Start backend with hot reload |
| `npm run backend:build`    | Build backend TypeScript      |
| `npm run frontend:dev`     | Start Expo dev server         |
| `npm run frontend:ios`     | Start on iOS simulator        |
| `npm run frontend:android` | Start on Android emulator     |
| `npm run frontend:web`     | Start web version             |
| `npm run shared:build`     | Build shared package          |
| `npm run clean`            | Remove all node_modules       |

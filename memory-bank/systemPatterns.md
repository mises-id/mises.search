# System Patterns: Mises Search

## Architecture
- React-based single page application
- TypeScript for type safety
- Component-based architecture
- Route-based page organization

## Key Components
1. **Search Providers**
   - cse.tsx (Custom Search Engine)
   - adsense.tsx (AdSense integration)
   - mises-search.ts (Custom Mises search)

2. **Core Structure**
   - App.tsx: Root component
   - Routes: Defined in src/routes/
   - Pages: Organized in src/pages/
   - Components: Modular components in src/components/

## Design Patterns
- Composition: Search providers composed into main search interface
- HOC: withCache.tsx suggests higher-order component pattern
- Separation of concerns: Clear division between UI, logic, and routes

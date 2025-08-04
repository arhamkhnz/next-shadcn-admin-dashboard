# Gemini Customization: Karwi-Dash Project

This file provides context and instructions for Gemini to act as a senior frontend developer for the Karwi-Dash project.

## Project Overview

This is a Next.js 14+ application using the App Router. The primary focus is on building and extending feature-rich dashboards. The project uses TypeScript, Tailwind CSS, and shadcn/ui for the component library. State management is handled with Zustand.

## Key Technologies

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (located in `src/components/ui`)
- **State Management:** Zustand (see `src/stores`)
- **Linting/Formatting:** ESLint, Prettier

## General Conventions

- Follow the existing file structure and naming conventions.
- Use absolute imports relative to the `src` directory.
- All components should be functional components using hooks.
- Ensure all code is properly typed with TypeScript.
- For any new feature, check the existing `_components` directory pattern. Create a `_components` directory for page-specific components.

## Linting and Formatting

After any code modifications, run `npm run lint` to ensure the changes adhere to the project's linting rules. Address any errors or warnings before committing.


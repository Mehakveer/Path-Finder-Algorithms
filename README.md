# Path-Finder-Algorithms

A small interactive visualizer of common path-finding algorithms (DFS, BFS, A* and Greedy) built with React + TypeScript + Vite. Select algorithms, adjust grid size and speed, generate mazes, and see runtime/metrics for each algorithm.

## Screenshots
![App UI](assets/screenshots/screenshot-home.png)


## Features
- Visual implementations of: BFS, DFS, A*, GREEDY
- Interactive grid with start/goal, walls, and maze generation
- Adjustable grid size and animation speed
- Per-algorithm execution time and result display

## Tech stack
- React + TypeScript
- Vite
- Tailwind CSS (utility classes used in components)
- Icons: lucide-react

## Quick Start / Prerequisites
- Node.js (LTS recommended)
- npm (or pnpm/yarn)

## Install
```bash
npm install
```

## Run (development)
```bash
npm run dev
# open the URL printed by Vite, usually http://localhost:5173
```

## Build / Preview
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This project can be deployed to GitHub Pages using the `gh-pages` package.

1. Install the dev dependency:

```bash
npm install --save-dev gh-pages
```

2. Ensure `package.json` contains these scripts (already added):

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. If you will host as a *project site* (https://<user>.github.io/<repo>/), set the `base` option in `vite.config.ts` to `'/REPO_NAME/'` (replace `REPO_NAME` with your GitHub repo name). Example:

```ts
export default defineConfig({
  base: '/Path-Finder-Algorithms/',
  // ...rest of config
})
```

4. Build and deploy:

```bash
npm run deploy
```

This will publish the `dist` folder to the `gh-pages` branch and make your site available at `https://<user>.github.io/<repo>/`.

Notes:
- If you prefer automation, use the `peaceiris/actions-gh-pages` GitHub Action to publish on push to `main`.
- If your project is a user/org site (published at `https://<user>.github.io/`), do NOT set the `base` option and deploy from the repository root.

## Project structure (important files)
- `index.html` — app entry
- `package.json`, `tsconfig.json`, `vite.config.ts` — tooling
- `src/`
  - `main.tsx` — React entry
  - `App.tsx` — top-level app
  - `components/`
    - `Sidebar.tsx` — UI controls and algorithm stats
    - `GridArea.tsx` — interactive grid
    - `Header.tsx`, `Dashboard.tsx`, etc.
  - `algorithms/` — implementations:
    - `bfs.ts`, `dfs.ts`, `astar.ts`, `greedy.ts`
    - `index.ts` — `runAlgorithm()` dispatcher
  - `hooks/`
    - `usePathfinding.ts` — core orchestration of algorithm runs
  - `types.ts` — shared types and `AlgorithmResult`

## How algorithms are run
- `runAlgorithm(type, grid, start, goal)` in `src/algorithms/index.ts` dispatches to the chosen implementation.
- Each algorithm returns an `AlgorithmResult` used by the UI to display `execTimeMs`, `found`, and path/visited nodes.

## Troubleshooting
- If you see runtime errors like `Cannot read properties of undefined (reading 'toFixed')`, it means an algorithm result is missing the numeric `execTimeMs`; the sidebar now guards the display to avoid crashes.
- If `npm install` fails due to cache/permission errors, fix npm cache ownership:
```bash
sudo chown -R "$(whoami)" ~/.npm
rm -rf ~/.npm/_cacache/tmp/*
npm cache verify || npm cache clean --force
npm install
```

## Adding a new algorithm
1. Add implementation file to `src/algorithms/`, export a function that matches existing signatures.
2. Add export/import and update `runAlgorithm` in `src/algorithms/index.ts`.
3. Add the algorithm name to `ALGORITHMS` in `src/components/Sidebar.tsx` to expose it in the UI.

## Contributing
See `CONTRIBUTING.md` for contribution guidelines.

## License
This project is released under the MIT License. See `LICENSE` for details.

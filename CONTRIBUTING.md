# Contributing

Thanks for wanting to contribute! This document explains the recommended workflow, code style, and expectations for contributions to Path-Finder-Algorithms.

## How to contribute
1. Fork the repository.
2. Create a descriptive branch: `git checkout -b feat/short-description` or `git checkout -b fix/short-description`.
3. Implement your changes with small, focused commits.
4. Run the app locally and verify there are no runtime errors.
5. Open a pull request to the main repository with a clear description of the change.

## Branch naming
- Use prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `test/`.
- Example: `feat/greedy-heuristic-improvement`.

## Commit messages
Follow conventional/semantic commit messages:
- Format: `type(scope): short summary`
- Examples:
  - `feat(algorithms): add diagonal movement support to A*`
  - `fix(sidebar): guard execTimeMs display to avoid toFixed on undefined`

## PR checklist
- [ ] Title follows `type(scope): summary` when appropriate.
- [ ] The change is limited in scope and well documented.
- [ ] No sensitive data is included.
- [ ] All new UI changes include screenshots or a short video.

## Code style
- Use TypeScript typing for exported functions and interfaces.
- Keep UI logic in `src/components/` and algorithm logic in `src/algorithms/`.
- Prefer small helper functions over long components.

## Tests & linting
- If you add logic that can be unit tested, include tests in a `__tests__` directory next to the module.
- Run linters (if configured) before opening a PR.

## Review process
- PRs will be reviewed and feedback provided. Address review comments and push changes to the same branch.
- Once approved, the PR can be merged.

## Code of conduct
Be respectful and constructive. Treat others with professionalism.

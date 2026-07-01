# Validation Checklist

Run validation in this order:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Rules:

- Stop at the first failing category.
- Fix only that category.
- Do not continue into unrelated work.

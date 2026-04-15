# Web App

Frontend del monorepo `cafe-system`, construido con Next.js.

## Comandos

```bash
pnpm dev:web
pnpm --filter @cafe-system/web build
pnpm --filter @cafe-system/web lint
```

## Rol dentro del monorepo

- Consume paquetes compartidos desde `packages/*`.
- Representa la capa de experiencia de usuario.
- Se integra con la API ubicada en `apps/api`.

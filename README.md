# Cafe System

Monorepo para la plataforma de cafeterias con dos bloques principales:

- `apps/web`: frontend en Next.js.
- `apps/api`: API en TypeScript planteada como monolito modular.

## Estructura

```text
cafe-system/
|- apps/
|  |- web/           # Aplicacion frontend
|  \- api/           # API monolitica modular
|- packages/
|  |- types/         # Tipos compartidos entre apps
|  |- utils/         # Utilidades compartidas
|  \- ui/            # Contratos o primitives de UI reutilizables
|- package.json
|- pnpm-workspace.yaml
\- tsconfig.base.json
```

## Arquitectura objetivo

### Frontend

`apps/web` queda aislado como una app Next.js dentro del workspace, pero con capacidad de consumir paquetes compartidos del monorepo.

### API

`apps/api` se organiza como un monolito modular:

- `src/modules`: modulos de negocio independientes.
- `src/shared`: piezas transversales como configuracion, tipos base y utilidades comunes.
- `src/server.ts`: punto de arranque de la API.

Cada modulo puede crecer internamente con una convencion como:

```text
src/modules/<feature>/
|- application/
|- domain/
|- infrastructure/
\- <feature>.module.ts
```

Esto te permite mantener una sola aplicacion desplegable, pero separando responsabilidades por contexto de negocio.

## Scripts

- `pnpm dev:web`: levanta el frontend.
- `pnpm dev:api`: levanta la API.
- `pnpm dev`: levanta ambas apps en paralelo.
- `pnpm build`: compila todo el workspace.
- `pnpm lint`: ejecuta lint en todos los paquetes.
- `pnpm check`: corre chequeos de tipos.

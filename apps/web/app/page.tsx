import { uiTokens } from "@cafe-system/ui";

export default function Home() {
  return (
    <main
      className="min-h-screen px-6 py-16 text-stone-100"
      style={{ backgroundColor: uiTokens.brand.dark }}
    >
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <span className="w-fit rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1 text-sm uppercase tracking-[0.2em] text-amber-200">
          Cafe System Monorepo
        </span>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-balance md:text-6xl">
            Frontend listo para convivir con una API monolitica modular.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-stone-300 md:text-lg">
            Este workspace separa la experiencia web de la capa backend sin
            perder cohesion. El frontend vive en <code>apps/web</code>, la API
            en <code>apps/api</code> y los contratos compartidos en{" "}
            <code>packages/*</code>.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6">
            <h2 className="text-lg font-bold text-amber-100">apps/web</h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Aplicacion Next.js para paneles, operacion y visualizacion del
              negocio.
            </p>
          </article>
          <article className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6">
            <h2 className="text-lg font-bold text-amber-100">apps/api</h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Monolito modular organizado por dominios, con modulos de negocio y
              piezas compartidas.
            </p>
          </article>
          <article className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6">
            <h2 className="text-lg font-bold text-amber-100">packages/*</h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Tipos, utilidades y contratos reutilizables para mantener
              consistencia entre capas.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

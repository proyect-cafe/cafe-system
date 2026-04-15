import type { AppModuleDescriptor } from "@cafe-system/types";

export function buildHealthcheck(modules: AppModuleDescriptor[]) {
  return {
    status: "ok",
    service: "@cafe-system/api",
    architecture: "modular-monolith",
    modules: modules.map((moduleItem) => moduleItem.name),
    timestamp: new Date().toISOString(),
  };
}

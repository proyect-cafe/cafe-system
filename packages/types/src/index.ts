export type ModuleName = "inventory" | "sales";

export interface AppModuleDescriptor {
  name: ModuleName;
  description: string;
}

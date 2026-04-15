import type { AppModuleDescriptor } from "@cafe-system/types";

import { inventoryModule } from "./inventory/inventory.module.js";
import { salesModule } from "./sales/sales.module.js";

export const modules: AppModuleDescriptor[] = [inventoryModule, salesModule];

import { MOCK_COMPONENTS, MOCK_SCENARIOS } from "@/lib/mock-data";

// Only expose fields the planner needs. Prices and stock remain catalog-owned data,
// while the model is limited to selecting known IDs instead of inventing products.
export const plannerCatalog = MOCK_COMPONENTS.map((part) => ({
  id: part.id,
  name: part.name,
  category: part.category,
  stock: part.stock,
  specs: part.specs,
}));

export const runnableDemoScenarios = MOCK_SCENARIOS.filter(
  (scenario) => scenario.nodes.length > 0 && scenario.connections.length > 0,
);

export const plannerCatalogIds = new Set(plannerCatalog.map((part) => part.id));

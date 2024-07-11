import { PageRegistry } from "./page-registry";
import {
  administration,
  calendar,
  chat,
  courses,
  organizationSettings,
  userManagement,
} from "./pages";

export function initializePageRegistry() {
  const registry = new PageRegistry();

  registry.add(courses);
  registry.add(chat);
  registry.add(calendar);
  registry.add(administration);
  registry.add(userManagement);
  registry.add(organizationSettings);

  return registry;
}

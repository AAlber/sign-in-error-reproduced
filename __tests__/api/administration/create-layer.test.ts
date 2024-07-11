import cuid from "cuid";
import { createUserWithRoleInstitutionAndLayersData } from "@/__tests__/helpers";
import { testApiHandler } from "@/__tests__/helpers/api";
import type { MockOrganization } from "@/__tests__/helpers/types";

const timeout = 60000;

describe("createLayer api", () => {
  let organization: MockOrganization;

  beforeAll(async () => {
    const data = await createUserWithRoleInstitutionAndLayersData();
    organization = data.institution;
  });

  it(
    "creates a layer",
    async () => {
      const result = await testApiHandler.layer.create({
        id: cuid(),
        institution_id: organization.id,
        isCourse: false,
        name: "name",
        parent_id: organization.id,
      });

      expect(result).toBeDefined();
    },
    timeout,
  );

  it(
    "creates a course layer",
    async () => {
      const layerId = cuid();

      const data = await testApiHandler.layer.create({
        id: layerId,
        institution_id: organization.id,
        isCourse: true,
        name: "name",
        parent_id: organization.id,
      });

      expect(data).toBeDefined();
      expect(data).toHaveProperty("course");
      expect(data.course.layer_id).toBe(layerId);
    },
    timeout,
  );
});

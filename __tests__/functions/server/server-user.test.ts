import cuid from "cuid";
import { createUserWithRoleInstitutionAndLayersData } from "@/__tests__/helpers";
import { getRolesOfUser } from "@/src/server/functions/server-administration-dashboard";
import { getRoleLayersWithCourses } from "@/src/server/functions/server-user";
import type { CourseLayerUserHasAccessTo } from "@/src/types/user.types";

describe("Server User Functions", () => {
  describe("getRoleLayersWithCourses", () => {
    it("Returns an empty array", () => {
      const mockData: CourseLayerUserHasAccessTo[] = [];
      const layers = getRoleLayersWithCourses(mockData);

      expect(Array.isArray(layers)).toBeTruthy();
      expect(layers.length).toBe(0);
    });

    it("Returns an empty array when passed an array of null/undefined", () => {
      const mockData = [null, undefined];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const layers = getRoleLayersWithCourses(mockData);

      expect(Array.isArray(layers)).toBeTruthy();
      expect(layers.length).toBe(0);
    });

    it("Returs correct number of layers with courses", () => {
      const mockData: CourseLayerUserHasAccessTo[] = [
        {
          role: "admin",
          layerId: "abc123",
          layer: {
            course: null,
          },
        },
        {
          role: "admin",
          layerId: "abc123",
          layer: {
            course: null,
          },
        },
        {
          role: "admin",
          layerId: "abc123",
          layer: {
            course: {
              id: cuid(),
              bannerImage: "",
              color: 1,
              icon: "🗿",
              description: "",
              layer_id: "abcabc",
              iconType: "emoji",
              name: "",
            },
          },
        },
      ];

      const layers = getRoleLayersWithCourses(mockData);
      expect(layers.length).toBe(1);
    });
  });

  describe("Integration Test - serverUser", () => {
    it("Gets a user with admin role", async () => {
      const { user } = await createUserWithRoleInstitutionAndLayersData({});
      const userRoles = await getRolesOfUser(
        user.id,
        user.currentInstitution as string,
      );

      expect(userRoles.some((role) => role.role === "admin")).toBeTruthy();
    });
  });
});

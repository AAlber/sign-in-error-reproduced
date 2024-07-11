import type { Prisma } from "@prisma/client";

export type Roles = {
  layerId: string;
  role: string;
}[];

export type LayerWithCourse = Prisma.LayerGetPayload<{
  include: {
    course: true;
  };
}>;

export type LayerWithCourseAndChildren = Omit<
  Prisma.LayerGetPayload<{
    include: {
      course: { select: { name: true; icon: true; layer_id: true } };
    };
  }> & {
    children: LayersWithCourseAndChildren;
  },
  "linkedCourseLayerId" | "isLinkedCourse"
>;

export type LayersWithCourseAndChildren = LayerWithCourseAndChildren[];

export type LayerTree = {
  id: string;
  children: LayersWithCourseAndChildren;
};

export type LayerWithMinimumCourseData = Omit<
  Prisma.LayerGetPayload<{
    include: {
      course: {
        select: {
          name: true;
          icon: true;
          layer_id: true;
        };
      };
    };
  }>,
  "linkedCourseLayerId" | "isLinkedCourse"
>;

export type LayersOfUser = Prisma.InstitutionGetPayload<{
  include: {
    layers: {
      select: {
        id: true;
        parent_id: true;
        name: true;
        position: true;
        start: true;
        isCourse: true;
        end: true;
        displayName: true;
        institution_id: true;
        course: {
          select: {
            name: true;
            icon: true;
            layer_id: true;
          };
        };
      };
    };
  };
}>;

export type LinkedCourse = {
  isCourse: true;
  isLinkedCourse: true;
  linkedCourseLayerId: string;
};

type WithoutLinkedCourse = {
  isCourse: true;
  isLinkedCourse?: false;
  linkedCourseLayerId?: never;
};

type IsCourse = LinkedCourse | WithoutLinkedCourse;

type IsNotCourse = {
  isCourse: false;
  isTemplateLayer?: false;
};

export type IsTemplateLayer = {
  isCourse: false;
  isTemplateLayer: true;
};

type IsNotCourseOrTemplate = IsNotCourse | IsTemplateLayer;

type CommonType = {
  /** The LayerID */
  id?: string;
  name: string;
  // TODO: fix, consistent casing
  parent_id: string;
  institution_id: string;
};

export type CreateLayerApiArgs = CommonType &
  (IsCourse | IsNotCourseOrTemplate);

export type CreateLayerOrCoursePropagateRolesArgs = {
  id: string;
  name: string;
  parentId: string;
  institutionId: string;
  isCourse: boolean;
  userId: string;
  start?: OrNull<Date>;
  end?: OrNull<Date>;
  /**
   * supply if you want this layer to be referenced to a 3rd party source. for example moodle courses.
   * To identify 3rd party easily, suggest to follow convention `3rdParty-type-externalId`
   * */
  externalId?: string;
};

export type UpdateLayerTimespanArgs = {
  layerId: string;
  start: OrNull<string>;
  end: OrNull<string>;
};

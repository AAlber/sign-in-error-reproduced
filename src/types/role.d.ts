type Role = "member" | "educator" | "moderator" | "admin";

type CoursesUserHasSpecialAccessTo = {
  id: string;
  name?: string;
  icon?: string;
  layer_id?: string;
};

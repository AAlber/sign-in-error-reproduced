import UserListItem from "./user-dropdown-list-item";

export default function UsersList({ users, layerId }) {
  return users.map((user) => {
    return <UserListItem key={user.id} user={user} layerId={layerId} />;
  });
}

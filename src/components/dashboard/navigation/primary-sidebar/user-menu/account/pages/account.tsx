import AdvancedAccountDetails from "./components/account/advanced-account-details";
import NameForm from "./components/account/name-form";
import ProfileImage from "./components/account/profile-image";

export default function AccountOverview() {
  return (
    <div className="flex w-full flex-col gap-8">
      <ProfileImage />
      <div className="flex flex-col gap-1">
        <NameForm />
        <AdvancedAccountDetails />
      </div>
    </div>
  );
}

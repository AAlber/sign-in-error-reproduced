import { useTranslation } from "react-i18next";
//Normal Example
const Example = () => {
  const { t } = useTranslation("page");

  return <div></div>;
};

//Reusable Example
const ReusableExample = (name: string) => {
  const { t } = useTranslation("page");

  return <div>{t(name)}</div>;
};

// import ReusableExample from "cool_file";

// const Component = () => {
//   return <ReusableExample name="cool_name" />
// }

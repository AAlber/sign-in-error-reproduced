import debounce from "lodash/debounce";
import { SearchIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Field = {
  query: string;
};

const SearchUser: React.FC<{
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}> = (props) => {
  const { setSearchQuery } = props;
  const { control, handleSubmit } = useForm<Field>();
  const { t } = useTranslation("page");

  const handleSearch = debounce(
    handleSubmit((v) => {
      setSearchQuery(v.query);
    }),
    400,
  );

  return (
    <div className="flex w-full items-center">
      <Controller
        control={control}
        name="query"
        render={({ field }) => {
          return (
            <input
              type="text"
              className="grow border-0 bg-transparent px-2 py-1 text-sm placeholder:text-muted focus:ring-0 dark:text-white"
              placeholder={t(
                "course_header_review_feedback_search_placeholder",
              )}
              onKeyUp={handleSearch}
              {...field}
            />
          );
        }}
      />
      <button className="px-2" onClick={handleSearch}>
        <SearchIcon className="h-4 w-4 text-muted-contrast" />
      </button>
    </div>
  );
};

export default SearchUser;

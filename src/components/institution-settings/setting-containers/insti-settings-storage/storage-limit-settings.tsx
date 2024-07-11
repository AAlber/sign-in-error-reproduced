import Form from "../../../reusable/formlayout";
import { Input } from "../../../reusable/shadcn-ui/input";

export default function StorageLimitSettings({
  courseStorageLimit,
  userStorageLimit,
  setCourseStorageLimit,
  setUserStorageLimit,
}: {
  courseStorageLimit?: number;
  userStorageLimit?: number;
  setCourseStorageLimit: (courseStorageLimit?: number) => void;
  setUserStorageLimit: (userStorageLimit?: number) => void;
}) {
  const updateLimit = (e, setCourseLimit: (limit?: number) => void) => {
    const val = e.target.value;
    if (!val || !parseInt(val)) setCourseLimit(undefined);
    const num = Number(e.target.value);
    if (num >= 0) {
      setCourseLimit(num);
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the 'e' and other non-digit characters from being entered
    if (
      event.key === "e" ||
      event.key === "." ||
      event.key === "+" ||
      event.key === "-" ||
      event.key === ","
    ) {
      event.preventDefault();
    }
  };
  return (
    <div className="my-4">
      <Form>
        <Form.Item
          label="user_storage_limit"
          description="user_storage_limit_description"
        >
          <Input
            value={userStorageLimit || ""}
            onChange={(e) => {
              /^[0-9]*$/.test(e.target.value) &&
                updateLimit(e, setUserStorageLimit);
            }}
            onKeyDown={handleKeyPress}
            type="number"
            maxLength={50}
            placeholder="50"
          />
        </Form.Item>
        <Form.Item
          label="course_storage_limit"
          description="course_storage_limit_description"
        >
          <Input
            value={courseStorageLimit || ""}
            onChange={(e) =>
              /^[0-9]*$/.test(e.target.value) &&
              updateLimit(e, setCourseStorageLimit)
            }
            type="number"
            maxLength={50}
            onKeyDown={handleKeyPress}
            placeholder="50"
          />
        </Form.Item>
      </Form>
    </div>
  );
}

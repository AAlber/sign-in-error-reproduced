import { Input } from "../../../reusable/shadcn-ui/input";
import { Label } from "../../../reusable/shadcn-ui/label";

interface EmailInputProps {
  email: string | undefined;
  setEmail: (value: string) => void;
}
export default function EmailInput({ email, setEmail }: EmailInputProps) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor="name">Email</Label>
      <Input
        id="label"
        className="col-span-2 h-8"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
}

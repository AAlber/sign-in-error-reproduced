import { Input } from "../../../reusable/shadcn-ui/input";
import { Label } from "../../../reusable/shadcn-ui/label";

interface NameInputProps {
  name: string | undefined;
  setName: (value: string) => void;
}

export default function NameInput({ name, setName }: NameInputProps) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor="Oname">Organization Name</Label>
      <Input
        id="label"
        className="col-span-2 h-8"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

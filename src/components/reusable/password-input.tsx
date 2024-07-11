import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { Button } from "./shadcn-ui/button";
import { Input } from "./shadcn-ui/input";

export default function PasswordInput({
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [hide, setHide] = useState(true);
  return (
    <div className="relative">
      <Input {...props} type={hide ? "password" : "text"} />
      <Button
        onClick={() => setHide(!hide)}
        variant="ghost"
        size="icon"
        className="absolute bottom-[0px] right-0"
      >
        {hide ? <Eye size={16} /> : <EyeOff size={16} />}
      </Button>
    </div>
  );
}

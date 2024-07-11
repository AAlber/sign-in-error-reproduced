import Image from "next/image";
import { accountGradients } from "../utils/theming";

export default function UserDefaultImage({
  dimensions,
  user,
  border = "border border-border",
}: {
  dimensions: string;
  user: any;
  border?: string;
}) {
  if (!user.id) {
    const random = Math.floor(Math.random() * 9);
    return (
      <div
        className={`${dimensions} rounded-full bg-gradient-to-tr ${accountGradients[random]?.color} flex items-center justify-center pb-[s] font-medium text-white `}
      ></div>
    );
  }

  const match = String(user.id).match(/\d/g);
  const color = parseInt(match?.[match.length - 1] ?? "1");

  if (user.image && user.image !== "newImage") {
    return (
      <Image
        priority
        className={`${dimensions} rounded-full object-cover`}
        src={user.image}
        alt="User Image"
        width={256}
        height={256}
      />
    );
  }
  return (
    <div
      className={`${dimensions} rounded-full bg-gradient-to-tr ${accountGradients[color]?.color} flex items-center justify-center pb-[s] `}
    ></div>
  );
}

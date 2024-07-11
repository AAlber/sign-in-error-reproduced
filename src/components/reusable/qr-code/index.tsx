import { useTheme } from "next-themes";
import QRCode from "qrcode.react";
import Skeleton from "../../skeleton";

type QrCodeProps = {
  url: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: boolean;
};

export default function QrCodeComponent(props: QrCodeProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      {props.loading ? (
        <Skeleton />
      ) : (
        <QRCode
          renderAs="svg"
          value={props.url}
          className={props.className}
          width={props.width}
          height={props.height}
          fgColor={isDark ? "#FFFFFF" : "#000000"}
          bgColor={isDark ? "#10131D" : "#FFFFFF"}
        />
      )}
    </>
  );
}

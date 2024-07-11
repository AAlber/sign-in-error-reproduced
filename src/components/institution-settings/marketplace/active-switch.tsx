import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import Switch from "@/src/components/reusable/settings-switches/switch";

export default function ActiveSwitch(props: {
  active: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <Switch
      checked={props.active}
      onChange={(checked) => {
        if (!hasActiveSubscription()) return toastNoSubscription();
        props.onToggle(checked);
      }}
    />
  );
}

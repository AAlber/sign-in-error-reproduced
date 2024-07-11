import SidebarTab from "../../sidebar-tab";
import type { ModalPage } from "..";
import { useModal } from "../zustand";

export default function TabNavigator({ steps }: { steps: ModalPage[] }) {
  const { step, setStep } = useModal();

  return (
    <ol className="flex flex-1 flex-col items-start justify-between gap-1 px-2">
      {steps.map((s, index) => (
        <SidebarTab
          key={index}
          active={index + 1 === step}
          icon={s.tabIcon!}
          name={s.tabTitle!}
          onClick={() => setStep(index + 1)}
          beta={s.beta}
        />
      ))}
    </ol>
  );
}

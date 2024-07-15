type TimelineStepProps = {
  isActive: boolean;
  stepName: string;
};

type TimelineProps = {
  active: string;
};

function TimelineStep({ isActive, stepName }: TimelineStepProps) {
  const activeColorStyle = isActive
    ? "border-blue-300 text-blue-500"
    : "border-grey text-slate-500";

  return (
    <div className={`text-sm border-2 px-2 rounded-full ` + activeColorStyle}>
      {stepName}
    </div>
  );
}

export function Timeline({ active }: TimelineProps) {
  return (
    <div className="flex flex-row items-center justify-center mt-2">
      <TimelineStep isActive={active === "experiment"} stepName="Experiment" />
      <hr className="border-1 w-4" />
      <TimelineStep isActive={active === "rollout"} stepName="Rollout" />
      <hr className="border-1 w-4" />
      <TimelineStep isActive={active === "firefox"} stepName="Firefox" />
    </div>
  );
}

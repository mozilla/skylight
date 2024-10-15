type TimelineStepProps = {
  isActive: boolean;
  stepName: string;
  href: string;
};

type TimelineProps = {
  active: string;
  isCompleted?: boolean;
};

function TimelineStep({ isActive, stepName, href }: TimelineStepProps) {
  const activeColorStyle = isActive
    ? "border-blue-300 text-blue-500 visited:text-blue-500 hover:text-blue-600 hover:border-blue-600"
    : "border-slate-200 text-slate-500 visited:text-slate-500 hover:text-slate-600 hover:border-slate-500";

  return (
    <a
      href={"#" + href}
      className={
        `no-underline text-sm border-2 px-2 rounded-full ` + activeColorStyle
      }
    >
      {stepName}
    </a>
  );
}

export function Timeline({ active, isCompleted = false }: TimelineProps) {
  return (
    <div className="flex flex-row items-center justify-center mt-2">
      <TimelineStep
        isActive={active === "experiment"}
        stepName="Experiment"
        href={isCompleted ? "complete_experiments" : "live_experiments"}
      />
      <hr className="border-1 w-4" />
      <TimelineStep
        isActive={active === "rollout"}
        stepName="Rollout"
        href={isCompleted ? "complete_rollouts" : "live_rollouts"}
      />
      {!isCompleted && (
        <>
          <hr className="border-1 w-4" />
          <TimelineStep
            isActive={active === "firefox"}
            stepName="Firefox"
            href="firefox"
          />
        </>
      )}
    </div>
  );
}

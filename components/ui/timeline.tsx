type TimelineProps = {
  active: string;
};

export function Timeline({ active }: TimelineProps) {
  return (
    <div className="flex flex-row items-center justify-center mt-2">
      <p
        className={
          `text-sm border-2 px-2 rounded-full ` +
          (active === "experiment"
            ? "border-blue-300 text-blue-500"
            : "border-grey text-slate-500")
        }
      >
        Experiment
      </p>
      <hr className="border-1 w-4" />
      <p
        className={
          `text-sm border-2 px-2 rounded-full ` +
          (active === "rollout"
            ? "border-blue-300 text-blue-500"
            : "border-grey text-slate-500")
        }
      >
        Rollout
      </p>
      <hr className="border-1 w-4" />
      <p
        className={
          `text-sm border-2 px-2 rounded-full ` +
          (active === "in tree"
            ? "border-blue-300 text-blue-500"
            : "border-grey text-slate-500")
        }
      >
        In Tree
      </p>
    </div>
  );
}

type Status =
  | "planning"
  | "implementing"
  | "testing"
  | "completed"
  | "archived";

const steps: Status[] = ["planning", "implementing", "testing", "completed"];

const labels: Record<Status, string> = {
  planning: "Planning",
  implementing: "Implementing",
  testing: "Testing",
  completed: "Completed",
  archived: "Archived",
};

const stepColors: Record<Status, string> = {
  planning: "bg-blue-200 text-blue-600",
  implementing: "bg-amber-200 text-amber-600",
  testing: "bg-red-200 text-red-600",
  completed: "bg-lime-200 text-lime-600",
  archived: "bg-slate-300 text-slate-700",
};

export default function ProjectProgress({ current }: { current: Status }) {
  if (current === "archived") {
    return (
      <div className="w-full bg-slate-300 text-slate-700 text-center py-3 rounded-lg font-medium">
        Archived
      </div>
    );
  }

  const currentIndex = steps.indexOf(current);

  return (
    <div className="flex w-full overflow-hidden rounded-lg">
      {steps.map((step, index) => {
        const isPassedOrCurrent = index <= currentIndex;

        return (
          <div
            key={step}
            className={`
              relative flex-1 text-center py-3 text-sm font-medium
              ${
                isPassedOrCurrent
                  ? stepColors[step]
                  : "bg-slate-200 text-slate-500"
              }
              ${index !== 0 ? "-ml-2" : ""}
            `}
            style={{
              clipPath:
                index === steps.length - 1
                  ? "none"
                  : "polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)",
            }}
          >
            {labels[step]}
          </div>
        );
      })}
    </div>
  );
}

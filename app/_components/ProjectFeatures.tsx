import { getProjectFeatures } from "../_lib/data-service";

const colorVariants: Record<string, string> = {
  green: "bg-lime-100 text-lime-700 border border-lime-200",
  blue: "bg-blue-100 text-blue-700 border border-blue-200",
  purple: "bg-purple-100 text-purple-700 border border-purple-200",
  red: "bg-red-100 text-red-700 border border-red-200",
  orange: "bg-orange-100 text-orange-700 border border-orange-200",
  pink: "bg-pink-100 text-pink-700 border border-pink-200",
  teal: "bg-teal-100 text-teal-700 border border-teal-200",
  yellow: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  gray: "bg-zinc-100 text-zinc-700 border border-zinc-200",
};

export default async function ProjectFeatures({
  projectId,
}: {
  projectId: number;
}) {
  const features = await getProjectFeatures(projectId);

  if (!features.length) return null;

  return (
    <div className="mt-5">
      <h3 className="mb-3 text-sm font-semibold text-zinc-700 uppercase tracking-wide">
        Features
      </h3>

      <ul className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <li key={feature.id}>
            <span
              className={`
                inline-flex
                items-center
                text-xs
                font-medium
                px-3
                py-1
                rounded-full
                ${colorVariants[feature.color] ?? colorVariants.gray}
              `}
            >
              {feature.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

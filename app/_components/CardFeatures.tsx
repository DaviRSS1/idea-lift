import { getProjectFeatures } from "../_lib/data-service";

export default async function CardFeatures({
  projectID,
}: {
  projectID: string;
}) {
  const features = await getProjectFeatures(Number(projectID));

  const featureColors: Record<(typeof features)[number]["color"], string> = {
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

  return (
    <>
      {features.map((feature: (typeof features)[number]) => (
        <div
          key={feature.id}
          className={`p-4 rounded-xl shadow-sm ${featureColors[feature.color]}`}
        >
          <h3 className="font-medium">{feature.title}</h3>
          <p className="text-sm opacity-80">{feature.description}</p>
        </div>
      ))}
    </>
  );
}

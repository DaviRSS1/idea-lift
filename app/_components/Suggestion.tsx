import Image from "next/image";
import { getUserById } from "../_lib/data-service";
import { Suggestions } from "../_types/suggestions";

export default async function Suggestion({
  suggestion,
}: {
  suggestion: Suggestions;
}) {
  const user = await getUserById(suggestion.authorId);
  return (
    <div className="flex-1 pt-1">
      <div className="flex items-center gap-2 mb-1">
        <Image
          src={user.avatar}
          alt={`avatar from ${user.name}`}
          width={30}
          height={30}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Suggestion #{suggestion.id.toString().slice(-4)}
        </span>
      </div>
      <p className="text-slate-700 leading-relaxed text-lg">
        {suggestion.content}
      </p>
    </div>
  );
}

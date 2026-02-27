import { getProjectSuggestions } from "../_lib/data-service";
import { ChevronUp, ChevronDown } from "lucide-react";
import Suggestion from "./Suggestion";

export default async function Suggestions({
  projectID,
}: {
  projectID: string;
}) {
  const suggestions = await getProjectSuggestions(Number(projectID));

  if (suggestions.length === 0) {
    return;
  }

  return (
    <div className="flex flex-col gap-4">
      {suggestions.map((suggestion: (typeof suggestions)[number]) => (
        <div
          key={suggestion.id}
          className="group flex gap-5 p-5  border border-slate-200 rounded-2xl shadow-sm hover:border-lime-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col items-center justify-start ">
            <button
              className="p-1 rounded-md hover:bg-orange-50 hover:text-orange-600 text-slate-400 transition-colors"
              aria-label="Upvote"
            >
              <ChevronUp size={24} strokeWidth={2.5} />
            </button>

            <span className="text-lg font-bold text-slate-700 tabular-nums">
              {suggestion.upvotesCount}
            </span>

            <button
              className="p-1 rounded-md hover:bg-blue-50 hover:text-blue-600 text-slate-400 transition-colors"
              aria-label="Downvote"
            >
              <ChevronDown size={24} strokeWidth={2.5} />
            </button>
          </div>

          <Suggestion suggestion={suggestion} />
        </div>
      ))}
    </div>
  );
}

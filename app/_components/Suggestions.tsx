import { getProjectSuggestions } from "../_lib/data-service";
import SuggestionDiv from "./SuggestionDiv";

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
        <SuggestionDiv suggestion={suggestion} key={suggestion.id} />
      ))}
    </div>
  );
}

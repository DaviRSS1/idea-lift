import { Suggestions } from "../_types/suggestions";
import Suggestion from "./Suggestion";
import { getUserById } from "../_lib/data-service";

type SuggestionProps = {
  suggestion: Suggestions;
};

export default async function SuggestionDiv({ suggestion }: SuggestionProps) {
  const user = await getUserById(suggestion.authorId);

  return <Suggestion suggestion={suggestion} user={user} />;
}

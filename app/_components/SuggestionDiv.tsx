import { Suggestions } from "../_types/suggestions";
import Suggestion from "./Suggestion";
import { getUserById } from "../_lib/data-service";
import { auth } from "../_lib/auth";

type SuggestionProps = {
  suggestion: Suggestions;
};

export default async function SuggestionDiv({ suggestion }: SuggestionProps) {
  const session = await auth();

  const [author, currentUser] = await Promise.all([
    getUserById(suggestion.authorId),
    session?.user?.id
      ? getUserById(Number(session.user.id))
      : Promise.resolve(null),
  ]);

  return (
    <Suggestion
      suggestion={suggestion}
      author={author}
      currentUser={currentUser}
    />
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Suggestions } from "../_types/suggestions";
import { User } from "../_types/user";
import { voteSuggestionAction } from "../_lib/actions";
import toast from "react-hot-toast";
import { ChevronUp, ChevronDown } from "lucide-react";
import { VoteValue } from "../_lib/data-service";
import SpinnerMini from "./SpinnerMini";

type SuggestionProps = {
  suggestion: Suggestions;
  user: User;
};

export default function Suggestion({ suggestion, user }: SuggestionProps) {
  const [score, setScore] = useState(suggestion.upvotesCount ?? 0);
  const [userVote, setUserVote] = useState<VoteValue>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchUserVote() {
      try {
        setIsInitialLoading(true);
        const res = await fetch(
          `/api/getUserVote?suggestionId=${suggestion.id}&userId=${user.id}`,
        );
        const data = await res.json();
        setUserVote((data.vote as VoteValue) ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitialLoading(false);
      }
    }
    fetchUserVote();
  }, [suggestion.id, user.id]);

  const handleVote = async (delta: 1 | -1) => {
    if (isLoading || isInitialLoading) return;

    const newVote: VoteValue = userVote === delta ? 0 : delta;
    const scoreDiff = newVote - userVote;

    setScore((prev) => prev + scoreDiff);
    setUserVote(newVote);

    try {
      setIsLoading(true);
      const result = await voteSuggestionAction(
        suggestion.id,
        user.id,
        newVote,
      );
      setScore(result.newScore);
    } catch {
      setScore((prev) => prev - scoreDiff);
      setUserVote(userVote);
      toast.error("Erro ao votar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-5 p-5 border border-slate-200 rounded-2xl shadow-sm hover:border-lime-200 hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex flex-col items-center justify-start gap-1 min-w-10">
        <button
          onClick={() => handleVote(1)}
          disabled={isInitialLoading || isLoading}
          className={`p-1.5 rounded-lg transition-all ${
            userVote === 1
              ? "bg-lime-100 text-lime-700 shadow-sm"
              : "text-slate-400 hover:bg-slate-50 disabled:opacity-50"
          }`}
        >
          <ChevronUp size={24} strokeWidth={userVote === 1 ? 3 : 2} />
        </button>

        <div className="h-8 flex items-center justify-center">
          {isInitialLoading ? (
            <SpinnerMini />
          ) : (
            <span
              className={`text-lg font-bold tabular-nums ${
                userVote === 1
                  ? "text-lime-600"
                  : userVote === -1
                    ? "text-red-600"
                    : "text-slate-700"
              }`}
            >
              {score}
            </span>
          )}
        </div>

        <button
          onClick={() => handleVote(-1)}
          disabled={isInitialLoading || isLoading}
          className={`p-1.5 rounded-lg transition-all ${
            userVote === -1
              ? "bg-red-100 text-red-700 shadow-sm"
              : "text-slate-400 hover:bg-slate-50 disabled:opacity-50"
          }`}
        >
          <ChevronDown size={24} strokeWidth={userVote === -1 ? 3 : 2} />
        </button>
      </div>

      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={user.avatar}
            alt={user.name}
            width={32}
            height={32}
            className="rounded-full border border-slate-100"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Sugestão #{suggestion.id.toString().slice(-4)}
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed text-lg">
          {suggestion.content}
        </p>
      </div>
    </div>
  );
}

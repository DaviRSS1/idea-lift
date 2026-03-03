import Link from "next/link";
import Logo from "./Logo";
import { FiArrowRight } from "react-icons/fi";

export default function Welcome() {
  return (
    <div className=" flex items-center justify-center bg-slate-50">
      <div className="max-w-lg w-full flex flex-col items-center text-center gap-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-slate-800 leading-tight">
            Where great ideas
            <br />
            become great projects
          </h1>
          <p className="text-slate-500 leading-relaxed text-base">
            Collect suggestions from your team, manage projects and turn the
            best ideas into reality — all in one place.
          </p>
        </div>

        <div className="w-full grid grid-cols-3 gap-3 text-left">
          {[
            {
              icon: "📁",
              label: "Organize projects",
              desc: "Keep everything structured and accessible",
            },
            {
              icon: "🙋",
              label: "Collect ideas",
              desc: "Let your team vote on what matters most",
            },
            {
              icon: "🏢",
              label: "Work together",
              desc: "Invite your company and collaborate",
            },
          ].map((f) => (
            <div
              key={f.label}
              className="border border-slate-200 rounded-xl p-4 bg-white"
            >
              <span className="text-xl">{f.icon}</span>
              <p className="text-sm font-medium text-slate-700 mt-2">
                {f.label}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white font-medium rounded-xl transition-colors text-sm shadow-sm shadow-lime-200"
        >
          Sign in with Google <FiArrowRight size={14} />
        </Link>

        <p className="text-xs text-slate-400">
          Free to use · No credit card required
        </p>
      </div>
    </div>
  );
}

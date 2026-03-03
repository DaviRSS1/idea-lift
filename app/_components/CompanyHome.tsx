import Image from "next/image";
import Link from "next/link";
import { FaRegBuilding } from "react-icons/fa";

type Company = {
  id: number;
  name: string;
  domain?: string;
  logo?: string;
  location?: string;
};

type Member = {
  id: number;
  userId: number;
  companyId: number;
  role: string;
};

export default function CompanyHome({
  company,
  members,
}: {
  company: Company | null;
  members: Member[] | null;
}) {
  return (
    <div>
      {company ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            Company
          </h3>
          <Link
            href="/company"
            className="block border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-semibold text-slate-500 bg-slate-50 shrink-0">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    width={36}
                    height={36}
                    alt={company.name}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  company.name?.[0]
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {company.name}
                </p>
                {company.domain && (
                  <p className="text-xs text-slate-400">{company.domain}</p>
                )}
              </div>
            </div>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>{members?.length ?? 0} members</span>
              {company.location && <span>{company.location}</span>}
            </div>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            Company
          </h3>
          <Link
            href="/company"
            className="flex items-center gap-3 border border-dashed border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors"
          >
            <FaRegBuilding size={18} className="text-slate-300" />
            <p className="text-sm text-slate-400 italic">
              Not in a company yet.
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}

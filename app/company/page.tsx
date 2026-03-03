import { auth } from "@/app/_lib/auth";
import {
  getCompanies,
  getCompanyData,
  getCompanyRequests,
  getUserById,
} from "@/app/_lib/data-service";
import { supabase } from "@/app/_lib/supabase";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner";
import ButtonEditCompany from "../_components/ButtonEditCompany";
import MembersList from "../_components/MembersList";
import AddMemberForm from "../_components/AddMemberForm";
import NoCompanyForm from "../_components/NoCompanyForm";
import ButtonLeaveCompany from "../_components/ButtonLeaveCompany";
import CompanyRequests from "../_components/CompanyRequests";

export const metadata: Metadata = {
  title: "Company",
};

export default async function CompanyPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="p-10 text-slate-500 italic space-y-3">
        <p>You must to be logged in to see this section.</p>
        <Link
          href="/login"
          className="inline-block px-4  py-2 rounded-lg bg-lime-200 text-sm font-medium hover:bg-lime-300 transition text-lime-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const currentUser = await getUserById(Number(session.user.id));

  if (!currentUser?.companyId) {
    const companies = await getCompanies();
    return <NoCompanyForm companies={companies} />;
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", currentUser.companyId)
    .single();

  if (!company) {
    return <div className="p-10 text-slate-500 italic">Company not found.</div>;
  }

  const [{ members, isOwner }, requests] = await Promise.all([
    getCompanyData(currentUser.companyId, currentUser.id),
    getCompanyRequests(currentUser.companyId),
  ]);

  const ownerCount = members?.filter((m) => m.role === "owner").length ?? 0;
  const managerCount = members?.filter((m) => m.role === "manager").length ?? 0;
  const employeeCount =
    members?.filter((m) => m.role === "employee").length ?? 0;

  const currentMemberRole = members?.find(
    (m) => m.userId === currentUser.id,
  )?.role;

  return (
    <div className="space-y-10">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Go back
      </Link>

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {company.logo ? (
            <Image
              src={company.logo}
              width={48}
              height={48}
              alt={company.name}
              className="rounded-xl"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-xl font-semibold text-slate-500">
              {company.name?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold">{company.name}</h1>
            {company.domain && (
              <p className="text-sm text-slate-500 mt-0.5">{company.domain}</p>
            )}
          </div>
        </div>

        <div>
          {isOwner && <ButtonEditCompany company={company} />}
          {!isOwner && (
            <ButtonLeaveCompany
              userId={currentUser.id}
              companyId={currentUser.companyId}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-3 space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold  uppercase tracking-wide">
              About
            </h3>
            {company.description ? (
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            ) : (
              <p className="text-slate-400 italic">No description provided.</p>
            )}
          </div>

          {(company.website || company.location) && (
            <div className="flex flex-wrap gap-6">
              {company.website && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                    Website
                  </p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {company.website.replace("https://", "")}
                  </a>
                </div>
              )}
              {company.location && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                    Location
                  </p>
                  <p className="text-sm text-slate-700">{company.location}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col-span-2 space-y-4">
          <h3 className="mb-3 text-sm font-semibold  uppercase tracking-wide">
            Team overview
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Owners", value: ownerCount },
              { label: "Managers", value: managerCount },
              { label: "Employees", value: employeeCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className=" border border-slate-200 rounded-xl p-4 text-center"
              >
                <p className="text-2xl font-semibold ">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(currentMemberRole === "owner" || currentMemberRole === "manager") && (
        <CompanyRequests
          requests={requests}
          companyId={currentUser.companyId}
        />
      )}

      <section className="space-y-4">
        <h3 className="text-sm font-semibold  uppercase tracking-wide">
          Members
        </h3>
        <Suspense fallback={<Spinner />}>
          <MembersList
            members={members ?? []}
            isOwner={isOwner}
            currentUserId={currentUser.id}
          />
        </Suspense>
        {isOwner && <AddMemberForm companyId={currentUser.companyId} />}
      </section>
    </div>
  );
}

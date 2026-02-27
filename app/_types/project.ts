export type Project = {
  id: number;
  title: string;
  description: string | null;
  visibility: "public" | "private";
  companyId: number;
  createdBy: number;
  projectIcon: string | null;
  status: "active" | "archived" | "completed";
};

export type User = {
  id: number;
  name: string;
  email: number;
  role: "manager" | "employee" | "owner";
  avatar: string;
  companyId: number;
};

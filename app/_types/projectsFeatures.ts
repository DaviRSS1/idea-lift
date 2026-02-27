export type ProjectFeatures = {
  id: number;
  title: string;
  description: string;
  userId: number;
  projectId: number;
  color:
    | "green"
    | "blue"
    | "purple"
    | "red"
    | "orange"
    | "pink"
    | "teal"
    | "yellow"
    | "gray";
};

import { Project } from "./project";
import { FeatureInput } from "./projectsFeatures";

export type ProjectFull = Project & {
  features: FeatureInput[];
  members: {
    id: number;
    userId: number;
    projectId: number;
    user: {
      id: number;
      email: string;
    };
  }[];
};

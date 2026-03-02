export type FeatureColor =
  | "green"
  | "blue"
  | "purple"
  | "red"
  | "orange"
  | "pink"
  | "teal"
  | "yellow"
  | "gray";

export type FeatureInput = {
  title: string;
  description: string;
  color: FeatureColor;
};

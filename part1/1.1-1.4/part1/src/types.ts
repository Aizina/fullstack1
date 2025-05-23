export type PartType = {
  name: string;
  exercises: number;
};

export type HeaderProps = {
  course: string;
};

export type ContentProps = {
  parts: PartType[];
};

export type PartProps = {
  part: PartType;
};

export  type TotalProps = {
  parts: PartType[];
};
export interface PartType {
  id: number;
  name: string;
  exercises: number;
}

export interface CourseType {
  name: string;
  parts: PartType[];
}

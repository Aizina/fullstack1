import type { CoursePart } from "../types";

interface Props {
  parts: CoursePart[];
}

const Total = ({ parts }: Props) => {
  const totalExercises = parts.reduce((sum, p) => sum + p.exerciseCount, 0);
  return <p>Number of exercises {totalExercises}</p>;
};

export default Total;

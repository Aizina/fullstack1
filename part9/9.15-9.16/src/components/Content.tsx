import type { CoursePart } from "../types";
import Part from "./Part";

interface Props {
  parts: CoursePart[];
}

const Content = ({ parts }: Props) => (
  <div>
    {parts.map((p) => (
      <Part key={p.name} part={p} />
    ))}
  </div>
);

export default Content;

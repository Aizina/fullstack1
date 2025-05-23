import React from 'react';
import { CourseType, PartType } from './types'; // Adjust the import path as necessary

interface HeaderProps {
  courseName: string;
}

const Header: React.FC<HeaderProps> = ({ courseName }) => <h1>{courseName}</h1>;

interface PartProps {
  part: PartType;
}

const Part: React.FC<PartProps> = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

interface ContentProps {
  parts: PartType[];
}

const Content: React.FC<ContentProps> = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

const Total: React.FC<ContentProps> = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p>Total number of exercises: {total}</p>;
};


interface CourseProps {
  course: CourseType;
}

const Course: React.FC<CourseProps> = ({ course }) => (
  <div>
    <Header courseName={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);

export default Course;

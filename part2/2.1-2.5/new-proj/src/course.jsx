import React from 'react';

// Header Component
const Header = ({ courseName }) => <h1>{courseName}</h1>;

// Part Component
const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

// Content Component
const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

// Total Component
const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p>Total number of exercises: {total}</p>;
};

// Course Component
const Course = ({ course }) => (
  <div>
    <Header courseName={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);

export default Course;

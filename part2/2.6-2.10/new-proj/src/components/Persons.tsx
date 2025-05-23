import React from 'react';

interface Person {
  name: string;
  number: string;
}

interface PersonsProps {
  persons: Person[];
}

const Persons: React.FC<PersonsProps> = ({ persons }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.name}>
        {person.name} {person.number}
      </li>
    ))}
  </ul>
);

export default Persons;

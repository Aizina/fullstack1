import React from 'react';
import DeleteButton from './DeleteButton';

interface Person {
  id: number;
  name: string;
  number: string;
}

interface PersonsProps {
  persons: Person[];
  deletePerson: (id: number) => void;
}

const Persons: React.FC<PersonsProps> = ({ persons, deletePerson }) => (
  <ul>
    {persons.map(person => (
      <li key={person.name}>
        {person.name} {person.number} <DeleteButton person={person} deletePerson={deletePerson} />
      </li>
    ))}
  </ul>
);

export default Persons;
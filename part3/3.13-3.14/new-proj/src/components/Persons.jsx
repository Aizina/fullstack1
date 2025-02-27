import React from 'react';
import DeleteButton from './DeleteButton';


const Persons = ({ persons, deletePerson }) => (
  <ul>
    {persons.map(person => 
      <li key={person.name}>{person.name} {person.number} <DeleteButton person={person} deletePerson={deletePerson} /></li>
    )}
   
  </ul>
);

export default Persons;

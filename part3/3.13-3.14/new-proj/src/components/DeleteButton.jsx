import React from 'react';

const DeleteButton = ({ person, deletePerson }) => {
  return (
    <button type="button" onClick={() => deletePerson(person.id)}>
      Delete
    </button>
  );
};

export default DeleteButton;
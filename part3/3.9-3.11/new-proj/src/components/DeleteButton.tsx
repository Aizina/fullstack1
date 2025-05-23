import React from 'react';

interface DeleteButtonProps {
  person: { id: number; name: string; number: string };
  deletePerson: (id: number) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ person, deletePerson }) => {
  return (
    <button type="button" onClick={() => deletePerson(person.id)}>
      Delete
    </button>
  );
};

export default DeleteButton;
import React from 'react'

interface PersonFormProps {
  addPerson: (_event: React.FormEvent<HTMLFormElement>) => void;
  newName: string;
  handleNameChange: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  newNumber: string;
  handleNumberChange: (_event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonForm: React.FC<PersonFormProps> = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default PersonForm
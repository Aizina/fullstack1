import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import DataService from './components/Data'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import './components/Notifications.css'

interface Person {
  id: number;
  name: string;
  number: string;
}

type MessageType = 'success' | 'error' | null;

const App: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<MessageType>(null)

  useEffect(() => {
    DataService.getAll().then((initialPersons: Person[]) => {
      setPersons(initialPersons)
    })
  }, [])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => setNewName(event.target.value)
  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => setNewNumber(event.target.value)
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)

  const showMessage = (msg: string, type: MessageType) => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const addPerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        DataService.update(existingPerson.id, updatedPerson)
          .then((returnedPerson: Person) => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            showMessage(`Updated ${returnedPerson.name}'s number`, 'success')
          })
          .catch(error => {
            showMessage(`Error: The person "${existingPerson.name}" was already deleted from the server: ${error.message}`, 'error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      DataService.create(newPerson)
        .then((returnedPerson: Person) => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          showMessage(`Added ${returnedPerson.name}`, 'success')
        })
        .catch(error => {
          showMessage(`Error adding ${newPerson.name}: ${error.message}`, 'error')
        })
    }
  }

  const deletePerson = (id: number) => {
    const person = persons.find(p => p.id === id)
    if (person && window.confirm(`Delete ${person.name}?`)) {
      DataService.toDelete(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        showMessage(`Deleted ${person.name}`, 'success')
      }).catch(error => {
        showMessage(`Error deleting ${person.name}: ${error.message}`, 'error')
      })
    }
  }

  const personsToShow = searchTerm === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App

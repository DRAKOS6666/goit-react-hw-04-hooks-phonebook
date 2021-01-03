import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ContactForm from '../ContactForm/ContactForm';
import ContactList from '../ContactList/ContactList';
import Filter from '../Filter/Filter';

import './App.scss';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const contactsInLocalStorage = localStorage.getItem('contacts');
    if (contactsInLocalStorage) {
      try {
        setContacts(JSON.parse(contactsInLocalStorage));
        return;
      } catch (error) {
        console.log('LocalStoage parse Error');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const findContact = event => setFilter(event.target.value);

  const isUnique = name => !contacts.some(contact => contact.name === name);

  const addContact = ({ name, number }) => {
    if (name !== '' && isUnique(name)) {
      const id = uuidv4();
      const newContact = { name, number, id };
      setContacts(prevState => [...prevState, newContact]);
    }
    if (!isUnique(name)) {
      alert(`${name} is already in contact`);
    }
  };

  const deleteContact = id => {
    setContacts(prevState => prevState.filter(contact => contact.id !== id));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const numberOfContacts =
    filteredContacts.length < contacts.length && filteredContacts.length !== 0
      ? filteredContacts.length
      : null;

  return (
    <div className="wrapper">
      <h1>Phonebook</h1>
      <ContactForm addContact={addContact} />

      <h2>Contacts ({contacts.length})</h2>
      {contacts.length > 0 ? (
        <>
          <Filter
            onFindItem={findContact}
            numberOfContacts={numberOfContacts}
          />
          <ContactList
            contacts={filteredContacts}
            deleteContact={deleteContact}
          />
        </>
      ) : (
        <h3>Please add contacts...</h3>
      )}
    </div>
  );
}

// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

morgan.token('req-body', (req) => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) => {
    let log = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ');
    if (req.method === 'POST') {
      log += ' ' + tokens['req-body'](req, res);
    }
    return log;
  })
);

const personsFilePath = path.join(__dirname, 'persons.json');

async function getPersons() {
  try {
    const data = await fs.readFile(personsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading persons file:', err);
    return [];
  }
}

async function savePersons(persons) {
  try {
    await fs.writeFile(personsFilePath, JSON.stringify(persons, null, 2));
  } catch (err) {
    console.error('Error writing persons file:', err);
    throw err;
  }
}

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await getPersons();
    res.json(persons);
  } catch (err) {
    next(err);
  }
});

app.get('/info', async (req, res, next) => {
  try {
    const persons = await getPersons();
    const length = persons.length;
    const requestTime = new Date();
    res.send(`
      <p>Phonebook has info for ${length} people</p>
      <p>${requestTime}</p>
    `);
  } catch (err) {
    next(err);
  }
});

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const persons = await getPersons();
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const persons = await getPersons();
    const index = persons.findIndex(person => person.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'person not found' });
    }
    persons.splice(index, 1);
    await savePersons(persons);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.post('/api/persons', async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.name || !body.number) {
      return res.status(400).json({ error: 'name and number are required' });
    }
    const persons = await getPersons();
    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
      return res.status(400).json({ error: 'name must be unique' });
    }
    const person = {
      id: uuidv4(),
      name: body.name,
      number: body.number
    };
    persons.push(person);
    await savePersons(persons);
    res.json(person);
  } catch (err) {
    next(err);
  }
});

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const persons = await getPersons();
    const id = req.params.id;
    const body = req.body;
    const index = persons.findIndex(person => person.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'person not found' });
    }
    const updatedPerson = { ...persons[index], number: body.number };
    persons[index] = updatedPerson;
    await savePersons(persons);
    res.json(updatedPerson);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use(express.static('dist'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

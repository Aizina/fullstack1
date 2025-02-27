// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import Person from './models/person.js';


const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

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

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err.message));

  console.log('MONGODB_URI:', process.env.MONGODB_URI);

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (err) {
    next(err);
  }
});

app.get('/info', async (req, res, next) => {
  try {
    const persons = await Person.find({});
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
    const person = await Person.findById(req.params.id);
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
    await Person.findByIdAndDelete(req.params.id);
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
    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });
    const savedPerson = await newPerson.save();
    console.log(`Added ${newPerson.name} number ${newPerson.number} to phonebook`);
    res.json(savedPerson);
  } catch (err) {
    next(err);
  }
});

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

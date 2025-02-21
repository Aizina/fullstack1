const express = require('express');
const morgan = require('morgan');
const app = express();
const { persons } = require('./persons'); 
app.use(express.json());

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan((tokens, req, res) => {
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
}));

const generateId = () => {
    let newId;
    do {
        newId = String(Math.floor(Math.random() * 1000000));
    } while (persons.some(person => person.id === newId));
    return newId;
};

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const length = persons.length;
    const requestTime = new Date();
    response.send(`
        <p>Phonebook has info for ${length} people</p>
        <p>${requestTime}</p>
    `);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    if (!id) {
        return response.status(400).json({ error: 'id required' });
    }
    const index = persons.findIndex(person => person.id === id);
    if (index === -1) {
        return response.status(404).json({ error: 'person not found' });
    }
    persons.splice(index, 1);
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if (!body.name || !body.phone) {
        return response.status(400).json({ error: 'name and number are required' });
    }
    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ error: 'name must be unique' });
    }
    const person = {
        id: generateId(),
        name: body.name,
        phone: body.phone
    };
    persons.push(person);
    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
morgan(':method :url :status :res[content-length] - :response-time ms :body')


let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
    visible: true
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
    visible: true
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
    visible: true
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    visible: true
  }
]

app.get('/api/persons', (request, response) => {
  if (persons) {
    response.json(persons)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  if (persons) {
    const now = new Date()
    response.send(
      `Phonebook has info for ${persons.length} people 
      <br></br>
       ${now.toString()}`
      )
  }
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  persons = persons.filter(person => person.id !== id)
  response.json(person)
})

const randomInt = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'missing name or number'
    })
  }

  if (persons.map(person => person.name).includes(body.name)) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }

  const person = {
    id: String(randomInt()),
    name: body.name,
    number: body.number,
    visible: true
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

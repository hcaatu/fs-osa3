require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
morgan(':method :url :status :res[content-length] - :response-time ms :body')


app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    if (people) {
      response.json(people)
    } else {
      response.status(404).end()
    }
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    next(error)
  })
})

 // todo
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(person => {
    response.status(204).end()
  })
  .catch(error => next(error))
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

  // check if name exists already

  const person = new Person({
    name: body.name,
    number: body.number,
    visible: true
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
    visible: true
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

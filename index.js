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

app.get('/info', (request, response, next) => {
  Person.find({}).then(people => {
    if (people) {
      const now = new Date()
      response.send(
        `Phonebook has info for ${people.length} people 
        <br></br>
        ${now.toString()}`
      )
    }
  })
  .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(people => {
    if (people) {
      response.json(people)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
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

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(person => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const randomInt = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'missing name or number'
    })
  }

  // check if name exists already
  Person.find({}).then(people => {

    const person = new Person({
      name: body.name,
      number: body.number,
      visible: true
    })

    if (people.map(person => person.name).includes(person.name)) {
      return response.status(400).json({
        error: 'name already exists'
      })
    }
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })

  })
  .catch(error => next(error))
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

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
app.use(express.static('build'))
app.use(cors())



app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(people => {
      res.status(200).json(people.map(person => person.toJSON()))
    })
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({
    name,
    number
  })


  person.save()
    .then(newPerson => {
      res.status(201).json(newPerson)
    })
    .catch(error => next(error))

})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
    .then(person => {

      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body
  const person = {
    name,
    number
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(people => {
      const persons = people.map(person => person.toJSON())
      const info = (
        `<div>
              <p>Phonebook has info for ${persons.length} people</p>
              <p>${new Date()}</p>
            </div>`
      )

      res.send(info)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  if (
    error.name === 'CastError' &&
      (error.kind === 'ObjectId' || error.path === '_id')
  ) {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
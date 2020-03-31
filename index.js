const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
  {
    name: "Arto Hellas",
    number: "123-908-6785",
    id: 1
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: "Ada Lovelace",
    number: "901-800-8776",
    id: 5
  }
]

const generateId = () => (
  Math.round(Math.random() * 500)
)

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.get('/api/persons', (req, res) => {
  res.status(200).json(persons)
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name) {
    return res.status(400).json({
      error: 'Name is missing'
    })
  }

  if (!number) {
    return res.status(400).json({
      error: 'number is missing'
    })
  }

  const personExist = persons.find(
    person => person.name.toLowerCase() === name.toLowerCase()
  )

  if (personExist) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
  }

  const newPerson = {
    name,
    number,
    id: generateId()
  }

  persons = persons.concat(newPerson)
  res.status(201).json(newPerson)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if(!person) {
    return res.status(400).json({
      error: `person with id ${id} doesn't exist`
    })
  } else {
    res.status(200).json(person)
  }
  
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  persons = persons.filter(person => person.id !== id)
  
  res.status(204).end()
})

app.get('/info', (req, res) => {
  const info = (
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`
  )
  
  res.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
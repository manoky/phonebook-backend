const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}



const password = process.argv[2]
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('DB connected'))
    .catch(error => console.log(error))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
    Person.find({})
        .then(resp => {
            console.log(resp)
            mongoose.connection.close()
        })
        .catch(error => console.log(error))
}

if (process.argv.length > 3) {
    const name =  process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name,
        number
    })

    person.save()
        .then(resp => {
            console.log(`added ${resp.name} ${resp.number} to phonebook`)
            mongoose.connection.close()
        })
        .catch(error => console.log(error))
}



const express = require('express')
const mongoose = require('mongoose')
const {dbUser, dbPass} =require('./config')

const app = express()

const PORT = process.env.PORT || 8080

app.use(express.json())

app.get('/', (req, res) => {
  return res.json({message: 'All right!'})
})

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPass}@cluster0.49f07.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true}
    )
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT} port`)
    })
  } catch (e) {
    console.error(e)
  }
}

start()

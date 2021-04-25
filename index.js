const express = require('express')
const mongoose = require('mongoose')
const { dbUser, dbPass } = require('./config')
const authRouter = require('./routes/authRouter')

const app = express()

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use('/auth', authRouter)

app.get('/', (req, res) => {
  return res.json({ message: 'All right!' })
})

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${ dbUser }:${ dbPass }@cluster0.49f07.mongodb.net/authRoleDB?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
        useCreateIndex: true
      }).then(() => console.log('DB connected...'))
    app.listen(PORT, () => {
      console.log(`Server started on ${ PORT } port`)
    })
  } catch (e) {
    console.error(e)
  }
}

start()

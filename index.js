import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import StudentDAO from "./dao/studentDAO.js"
import SignDAO from "./dao/signupDAO.js"
import BranchDAO from "./dao/branchDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
  process.env.RESTREVIEWS_DB_URI,
  {
    wtimeoutMS: 5000,
  }
  )
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    StudentDAO.injectDB(client);
    SignDAO.injectDB(client);
    BranchDAO.injectDB(client); 
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })
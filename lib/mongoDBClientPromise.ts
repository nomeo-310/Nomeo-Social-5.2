import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_DB_URI as string
const options = {}

let globalWithMongo = global as typeof globalThis & {_mongoClientPromise: Promise<MongoClient>}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {

  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise;
import { MongoClient } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>

const url = process.env.MONGODB_URI;

const options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

if(!process.env.MONGODB_URI){
    throw new Error('Please add your MongoDb Atlas connection string to  .env.local')
}

client = new MongoClient(url, options);
clientPromise = client.connect();

clientPromise.then(() => console.log('Connect to MongoDb Atlas'))

export default clientPromise
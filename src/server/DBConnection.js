import { MongoClient } from "mongodb";

const dbName = "Gallery";
let dbClient = null;
let db = null;

export const insertDocument = function (data, collectionToInsert) {
  const collection = db.collection(collectionToInsert);
  collection.insert(data, function (err, result) {
    console.log("Inserted documents into the collection");
  });
};

export const getDocuments = function (
  collectionToGet,
  filter = { room: "lobby" }
) {
  const collection = db.collection(collectionToGet);
  return collection
    .find(filter)
    .sort({ time: -1 })
    .limit(100)
    .toArray()
    .then((docs) => docs);
};

export const ConnectToDb = () => {
  // Connection URL
  const url = process.env.dbConnectionString;

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    console.log("Connected successfully to server");
    dbClient = client;
    db = client.db(dbName);
  });
};

export const CloseConnection = () => {
  dbClient.close();
};

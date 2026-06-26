const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

function collection() {
  return getDB().collection("messages");
}

async function creer(doc) {
  const resultat = await collection().insertOne(doc);
  return { _id: resultat.insertedId, ...doc };
}

async function parAnnonce(annonceId) {
  return collection()
    .find({ annonceId: new ObjectId(annonceId) })
    .sort({ createdAt: -1 })
    .toArray();
}

module.exports = { creer, parAnnonce };

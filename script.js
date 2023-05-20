const axios = require("axios"); //We use axios so we can fetch in the back-end
const mongoose = require("mongoose");
require("dotenv").config();
const Pokemon = require("./models/Pokemon");

// db connection

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

async function processPokemon() {
  console.log("processing...");
  let pokemonToProcess = true;
  let url = "https://pokeapi.co/api/v2/pokemon";
  while (pokemonToProcess) {
    const { data } = await axios.get(url);
    await Pokemon.insertMany(data.results); //data.results are the pokemon
    if (!data.next) {
      pokemonToProcess = false;
    } else {
      url = data.next;
    }
  }
  console.log("complete...");
}

async function main() {
  await Pokemon.deleteMany({}); //start with a clean collection
  await processPokemon();
  mongoose.connection.close(); //This ends the script
}

main();

import axios from "axios";
import dotenv from 'dotenv';

const API_URL = "https://api.api-ninjas.com/v1/animals";
const API_KEY = dotenv.config().parsed.API_NINJA_KEY;

export async function buscarAnimal(nombre) {
  const res = await axios.get(API_URL, {
    params: { name: nombre },
    headers: {
      "X-Api-Key": API_KEY
    }
  });

  return res.data; 
}

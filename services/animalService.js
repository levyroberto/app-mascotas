import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL =  process.env.MOCKAPI_BASE_URL;

export async function obtenerTipoPorNombre(nombreTipo) {
  const url = `${BASE_URL}/animals`;

  const res = await axios.get(url, {
    params: { type: nombreTipo }
  });

  return res.data[0] || null;
}

export async function obtenerRazasPorTipo(typeId) {
  const url = `${BASE_URL}/raza`;

  const res = await axios.get(url, {
    params: { typeId }
  });

  return res.data;
}

export async function validarRaza(tipo, raza) {
  const tipoEncontrado = await obtenerTipoPorNombre(tipo);

  if (!tipoEncontrado) return false;

  const razas = await obtenerRazasPorTipo(tipoEncontrado.id);

  const match = razas.some(
    (r) => r.name && r.name.toLowerCase() === raza.toLowerCase()
  );

  return match;
}
import Mascota from "../models/mascota/index.js";

class MascotaService {

  async listarPorTipoYEdad() {
    const mascotas = await Mascota.find();

    const grupos = {};

    mascotas.forEach(m => {
      if (!grupos[m.tipo]) {
        grupos[m.tipo] = [];
      }
      grupos[m.tipo].push(m);
    });

    const resultado = Object.entries(grupos).map(([tipo, lista]) => {
      const ordenadas = lista.sort((a, b) => b.edad - a.edad);

      const promedio =
        lista.reduce((sum, x) => sum + x.edad, 0) / lista.length;

      return {
        tipo,
        edadPromedio: Number(promedio.toFixed(2)),
        mascotas: ordenadas.map(m => ({
          id: m._id,
          nombre: m.nombre,
          edad: m.edad,
          usuarioId: m.usuarioId
        }))
      };
    });

    resultado.sort((a, b) => b.edadPromedio - a.edadPromedio);

    return resultado;
  }
}

export default new MascotaService();

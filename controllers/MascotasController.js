import Mascota from '../models/mascota/index.js';
import { buscarAnimal } from '../services/animalService.js';
import Usuario from '../models/usuario/index.js';

class ControllerMascotas {
    obtenerTodas = async (req, res) => {
        try {
          const mascotas = await Mascota.obtenerTodosConUsuarios();
          res.json(mascotas);
        } catch (error) {
          res.status(500).json({ message: 'Error al obtener mascotas', error: error.message });
        }
      };

  obtenerPorId = async (req, res) => {
    try {
      const mascota = await Mascota.obtenerPorId(req.params.id);
      if (!mascota || (!mascota.id && !mascota._id)) {
        return res.status(404).json({ message: 'Mascota no encontrada' });
      }
      res.json(mascota);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener mascota', error: error.message });
    }
  };

  obtenerPorUsuario = async (req, res) => {
    try {
      const mascotas = await Mascota.obtenerPorUsuario(req.params.usuarioId);
      res.json(mascotas);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener mascotas por usuario', error: err.message });
    }
  };

  guardar = async (req, res) => {
    try {
      const { tipo, raza, edad, cantidadVacunas, usuarioId } = req.body;
  
      if (!tipo || !raza) {
        return res.status(400).json({ message: "Tipo y raza son obligatorios." });
      }
  
      if (typeof raza !== "string" || raza.trim() === "") {
        return res.status(400).json({ message: "Raza inválida." });
      }
  
      const animales = await buscarAnimal(raza);
  
      if (!animales || animales.length === 0) {
        return res.status(400).json({ message: "Raza no encontrada en la API externa." });
      }
  
      const animal = animales[0];
  
      const tipoReal = animal.taxonomy.family;
      const razaReal = animal.name;
  
      if (razaReal.toLowerCase() !== raza.toLowerCase().trim()) {
        return res.status(400).json({ message: "La raza no coincide con la API externa." });
      }
  
      if (tipoReal.toLowerCase() !== tipo.toLowerCase().trim()) {
        return res.status(400).json({
          message: `La familia/tipo '${tipo}' no coincide con la API externa (${tipoReal}).`
        });
      }
  
      const mascota = await Mascota.guardar({
        tipo, 
        raza,
        edad,
        cantidadVacunas,
        usuarioId
      });

      await Usuario.agregarMascota(
        mascota.usuarioId,
        mascota.id  
      );
      
      res.status(201).json(mascota);
    } catch (err) {
      res.status(500).json({ message: "Error al guardar mascota", error: err.message });
    }
  };

  actualizar = async (req, res) => {
    try {
      const actualizada = await Mascota.actualizar(req.params.id, req.body);
      if (!actualizada) {
        return res.status(404).json({ message: 'Mascota no encontrada' });
      }
      res.json(actualizada);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar mascota', error: error.message });
    }
  };

  borrar = async (req, res) => {
    try {
      const borrada = await Mascota.borrar(req.params.id);
      if (!borrada) {
        return res.status(404).json({ message: 'Mascota no encontrada' });
      }
      await Usuario.borrarMascota(borrada.usuarioId, borrada.id);
      res.json({ message: 'Mascota eliminada', borrada });
    } catch (error) {
      res.status(500).json({ message: 'Error al borrar mascota', error: error.message });
    }
  };
}

export default ControllerMascotas;

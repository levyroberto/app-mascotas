import Usuario  from '../models/usuario/index.js';
import Mascota from '../models/mascota/index.js';
import jwt from 'jsonwebtoken';
import getEmailService from '../services/emailServiceSingleton.js';

class ControllerUsuarios {
  obtenerTodos = async (req, res) => {
    try {
      const usuarios = await Usuario.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  };

  obtenerPorId = async (req, res) => {
    try {
      const usuario = await Usuario.obtenerPorId(req.params.id);
      if (!usuario || (!usuario.id && !usuario._id)) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  };

  guardar = async (req, res) => {
    try {
      const { nombreCompleto, direccion, email, password } = req.body;
  

      const errors = {};

      if (!nombreCompleto || nombreCompleto.trim() === "") {
        errors.nombreCompleto = "El nombre es obligatorio";
      }
      
      if (!email || email.trim() === "") {
        errors.email = "El email es obligatorio";
      }
      
      if (!password || password.trim() === "") {
        errors.password = "La contraseña es obligatoria";
      }
      
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
  
      const nuevo = await Usuario.guardar({ 
        nombreCompleto, 
        direccion, 
        email, 
        password,
        isActive: false
      });


      const token = jwt.sign(
        { id: nuevo._id },
        process.env.JWT_EMAIL_SECRET,
        { expiresIn: '1d' }
      );

      const link = `${process.env.BASE_URL}/api/usuarios/activar/${token}`;
      
      const emailService = getEmailService();

      await emailService.enviar(email, "Activa tu cuenta", `
        <div style="font-family:Arial,Helvetica,sans-serif; padding:20px; max-width:500px; margin:auto; background:#ffffff; color:#333; border-radius:8px;">
      
          <h2 style="text-align:center; color:#222;">Bienvenido, ${nombreCompleto}</h2>
      
          <p style="font-size:16px; line-height:1.5;">
            Tu cuenta está casi lista. Solo falta un paso más:
          </p>
      
          <div style="text-align:center; margin:30px 0;">
            <a href="${link}"
               style="
                 display:inline-block;
                 padding:12px 24px;
                 background:#4CAF50;
                 color:white;
                 font-size:16px;
                 font-weight:bold;
                 text-decoration:none;
                 border-radius:6px;
               ">
              Activar cuenta
            </a>
          </div>
          <p style="font-size:12px; color:#777; margin-top:20px;">
            Este enlace expira en 24 horas.
          </p>
      
        </div>
        `);

      return res.status(201).json({ message: 'Usuario creado. Revisa tu email para activarlo.' });

    } catch (error) {
      if (typeof error === "object" && !error.message) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ general: error.message });
    }
  };

  activarCuenta = async (req, res) => {
    try {
      const { token } = req.params;
  
      const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
  
      const userAfter = await Usuario.activarCuenta(
        decoded.id
      );
  
      if (!userAfter) {
        return res.send(`
          <div style="font-family:Arial; padding:40px; text-align:center;">
            <h1 style="color:#d9534f;">Usuario no encontrado</h1>
            <p>No se pudo activar la cuenta.</p>
          </div>
        `);
      }
  
      return res.send(`
        <div style="
          font-family:Arial;
          padding:40px;
          text-align:center;
          max-width:400px;
          margin:auto;
        ">
          <h1 style="color:#28a745;">✔ Cuenta activada correctamente</h1>
          <p>Ya podés volver a la aplicación e iniciar sesión.</p>
        </div>
      `);
  
    } catch (err) {
      return res.send(`
        <div style="font-family:Arial; padding:40px; text-align:center;">
          <h1 style="color:#d9534f;">Enlace inválido o expirado</h1>
          <p>Solicitá un nuevo correo de activación.</p>
        </div>
      `);
    }
  };
  

  actualizar = async (req, res) => {
    try {
      const actualizado = await Usuario.actualizar(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  };

  borrar = async (req, res) => {
    try {
      const borrado = await Usuario.borrar(req.params.id);
      if (!borrado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado', borrado });
    } catch (error) {
      res.status(500).json({ message: 'Error al borrar usuario', error: error.message });
    }
  };

  obtenerMascotasDelUsuario = async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await ModeloMongoUsuarios.obtenerPorId(id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

      const mascotas = await Mascota.obtenerPorUsuario(id);

      res.json({
        usuario: {
          id: usuario._id,
          nombreCompleto: usuario.nombreCompleto,
          email: usuario.email,
        },
        mascotas,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener mascotas del usuario', error: error.message });
    }
  };
}

export default ControllerUsuarios;

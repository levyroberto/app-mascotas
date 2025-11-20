import Usuario  from '../models/usuario/index.js';
import Mascota from '../models/mascota/index.js';
import jwt from 'jsonwebtoken';
import EmailService from '../services/emailService.js';

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
  
      if (!nombreCompleto || nombreCompleto.trim() === "") {
        return res.status(400).json({ message: "El nombre es obligatorio" });
      }
  
      if (!email || email.trim() === "") {
        return res.status(400).json({ message: "El email es obligatorio" });
      }

      if (!password || password.trim() === "") {
        return res.status(400).json({ message: "La contraseña es obligatoria" });
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

      await EmailService.enviar(
        email,
        "Activa tu cuenta",
        `
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
      
          <p style="font-size:14px; color:#555;">
            Si el botón no funciona, podés copiar y pegar este enlace en tu navegador:
          </p>
      
          <p style="font-size:13px; word-break:break-all; color:#444;">
            ${link}
          </p>
      
          <p style="font-size:12px; color:#777; margin-top:20px;">
            Este enlace expira en 24 horas.
          </p>
      
        </div>
        `
      );
      

      return res.status(201).json({
        message: 'Usuario creado. Revisa tu email para activarlo.'
      });
  
    } catch (error) {
      res.status(400).json({ message: error.message });
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
        return res.status(404).json({
          message: "Usuario no encontrado. No se pudo activar la cuenta."
        });
      }
  
      return res.json({ message: "Cuenta activada correctamente." });
  
    } catch (err) {
      return res.status(400).json({
        message: "Token inválido o expirado.",
        error: err.message
      });
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

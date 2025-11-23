import { expect } from "chai"
import dotenv from 'dotenv'
dotenv.config();
import supertest  from "supertest"
import generador from "./generador/persona.js"
import generadorMascota from './generador/mascota.js'

const request  = supertest('http://localhost:3000')

const credencialesUsuario = {
    email: "robertolevyadtr@gmail.com",
    password: "123"  
};

/* 
    =============================
        Resgistro de Usuario
    =============================
*/
describe('*** Test del servicio Registro ***', () => {

    it('deberia registrar un usuario', async () => {
        
        // 1. Generamos
        const usuarioNuevo = generador.get();

        // 2. Enviamos
        const response = await request.post('/api/usuarios').send(usuarioNuevo);
        console.log(response.body);

        // 3. Verificamos Status
        expect(response.status).to.eql(201);

        // 4. Verificamos EL MENSAJE (que es lo que tu API devuelve)
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eql('Usuario creado. Revisa tu email para activarlo.');
    });  
    
    describe('Validaciones de Notificaciones', () => {
        
        it('debería confirmar explícitamente el envío del correo', async () => {
            const usuarioParaEmail = generador.get();
            const response = await request.post('/api/usuarios').send(usuarioParaEmail);
            
            // Validamos específicamente que la respuesta mencione "email" o "correo"
            expect(response.status).to.eql(201);
            expect(response.body.message).to.include('Revisa tu email');
        });

    });
})
    
/* 
    =============================
           Logeo de Usuario
    =============================
*/
describe('*** Test del servicio Logeo ***', () => {
        
    it('debería loguearse con credenciales válidas y retornar un token', async () => {
        // Usamos las credenciales correctas que definiste arriba
        const response = await request.post('/api/auth/login').send(credencialesUsuario);
            
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property('token'); // Verificamos que venga el token
    });

    it('debería fallar con contraseña incorrecta', async () => {
        const credencialesMalas = {
            email: credencialesUsuario.email, // Email correcto
            password: "password_super_falso_123" // Contraseña mal
        };

        const response = await request.post('/api/auth/login').send(credencialesMalas);
            
        // Tu controlador devuelve 401 Unauthorized en este caso
        expect(response.status).to.eql(401);
        expect(response.body.message).to.eql('Credenciales inválidas');
    });
        
    it('debería fallar con un usuario que no existe', async () => {
         const usuarioFantasma = {
            email: "este_email_no_existe_en_tu_db@test.com", 
            password: "123"
        };

        const response = await request.post('/api/auth/login').send(usuarioFantasma);
            
        expect(response.status).to.eql(401);
        expect(response.body.message).to.eql('Credenciales inválidas');
    });
});
/* 
    =============================
         Registro de Mascota
    =============================
*/
describe('*** Test servicio mascota ***', () => {

    let token;

    before(async () => {
        const response = await request
            .post('/api/auth/login')
            .send(credencialesUsuario);

        token = response.body.token;
    });

    it('Debería registrar una mascota para el usuario de las credenciales', async () => {

        // 1) OBTENER USUARIO
        const resUsuarios = await request
            .get('/api/usuarios/')
            .set('Authorization', `Bearer ${token}`);

        const miUsuario = resUsuarios.body.find(
            u => u.email === credencialesUsuario.email
        );

        // *** ESTA línea es la que falta ***
        const miId = miUsuario._id;

        // 2) GENERAR MASCOTA
        const nuevaMascota = generadorMascota.get();
        nuevaMascota.usuarioId = miId;

        // 3) ENVIAR
        const response = await request
            .post('/api/mascotas')
            .set('Authorization', `Bearer ${token}`)
            .send(nuevaMascota);

        // 4) VALIDAR
        expect(response.status).to.eql(201);
        expect(response.body.usuarioId).to.eql(miId);
        expect(response.body.nombre).to.eql(nuevaMascota.nombre);
    });
});
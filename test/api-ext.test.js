import { expect } from "chai"
import dotenv from 'dotenv'
dotenv.config();
import supertest  from "supertest"
import generador from "./generador/persona.js"
import generadorMascota from './generador/mascota.js'

const request   = supertest('http://localhost:3000')

const credencialesUsuario = {
    email: "sa.gonzalez98@hotmail.com",
    password: "12345"  
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

    let token; // Aquí guardaremos el token del usuario "sa.gonzalez98"

    // 1. PRIMERO: Nos logueamos con ESE usuario para obtener su token
    before(async () => {
        const response = await request.post('/api/auth/login').send(credencialesUsuario);
        token = response.body.token; 
    });

    it('Debería registrar una mascota para el usuario de las credenciales', async () => {
        
        // 2. BUSCAMOS SU ID:
        // Como el login no nos da el ID, usamos el token para pedir la lista de usuarios
        // y buscamos el que coincida con nuestro email.
        const resUsuarios = await request.get('/api/usuarios')
            .set('Authorization', `Bearer ${token}`);
        
        // Buscamos en el array de usuarios el que tenga el email "sa.gonzalez98@hotmail.com"
        const miUsuario = resUsuarios.body.find(u => u.email === credencialesUsuario.email);
        const miId = miUsuario._id; // ¡Este es el ID que necesitamos!

        // 3. GENERAMOS LA MASCOTA:
        const nuevaMascota = generadorMascota.get();
        nuevaMascota.usuarioId = miId; // Le asignamos el ID que acabamos de encontrar

        // 4. ENVIAMOS LA PETICIÓN DE REGISTRO DE MASCOTA:
        const response = await request.post('/api/mascotas')
                .set('Authorization', `Bearer ${token}`)
                .send(nuevaMascota);

            expect(response.status).to.eql(201);

        // 5. VALIDAMOS:
        expect(response.status).to.eql(201); // Que se haya creado
        expect(response.body.usuarioId).to.eql(miId); // Que pertenezca a nuestro usuario
        expect(response.body.nombre).to.eql(nuevaMascota.nombre); // Que el nombre sea correcto
    });

});

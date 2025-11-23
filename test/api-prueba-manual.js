import axios from "axios"

//tiene que ser un usuario que crees desde la app funcionando... el usuario que viene en el mongo no sirve
const misCredenciales = {
    email: "sa.gonzalez98@hotmail.com",
    password: "12345"         
};

const probarUsuarios = async () => {
    try {
        // --- PASO 1: LOGIN (Para conseguir el Token) ---
        console.log("1. Iniciando sesión...");
        const urlLogin = 'http://localhost:3000/api/auth/login';
        
        // Hacemos POST con email y contraseña
        const respuestaLogin = await axios.post(urlLogin, misCredenciales);
        const token = respuestaLogin.data.token;

        console.log("-> Login exitoso. Token recibido.");

        // --- PASO 2: GET USUARIOS (Enviando el Token) ---
        console.log("2. Pidiendo lista de usuarios...");
        const urlUsuarios = 'http://localhost:3000/api/usuarios';

        const respuestaUsuarios = await axios.get(urlUsuarios, {
            headers: {
                // Aquí está la clave: Enviamos el token en el encabezado
                Authorization: `Bearer ${token}`
            }
        });

        console.log("\n--- RESULTADO: LISTA DE USUARIOS ---");
        console.log(respuestaUsuarios.data);

    } catch (error) {
        console.log("\n--- ERROR ---");
        if (error.response) {
            // El servidor respondió con un error (401, 403, 404, etc.)
            console.log(`Estado: ${error.response.status}`);
            console.log("Mensaje:", error.response.data);
            
            if(error.response.status === 401) {
                console.log("TIP: Verifica que el email y contraseña sean correctos.");
            }
            if(error.response.status === 403) {
                console.log("TIP: Tu usuario existe pero no está activo (revisa el campo 'isActive' en Mongo).");
            }
        } else {
            // Error de conexión (servidor apagado, url mal escrita)
            console.log("Error de conexión:", error.message);
        }
    }
}

probarUsuarios();
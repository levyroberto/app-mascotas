import { faker} from '@faker-js/faker'

const get = () => {
    //Elegimos aleatoriamente entre 'dog' y 'cat'
    const tipoSeleccionado = faker.helpers.arrayElement(['dog', 'cat']);

    //Segun el tipo, pedimos la raza correcta
    const razaSeleccionada = (tipoSeleccionado === 'dog') 
        ? faker.animal.dog() 
        : faker.animal.cat();

    return {
        nombre: faker.animal.petName(),
        tipo: tipoSeleccionado,
        raza: razaSeleccionada
    };
}

//console.log(get())

export default{
    get
}
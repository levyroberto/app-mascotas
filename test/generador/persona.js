import { faker} from '@faker-js/faker'

const get = () => {
    
    return {
        nombreCompleto: faker.person.firstName(),
        direccion: " ", 
        email: faker.internet.email(),
        password: "1234"
    };
}

//console.log(get())

export default{
    get
}
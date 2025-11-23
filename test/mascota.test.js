import { expect } from "chai"
import generador from './generador/mascota.js'

describe('*** Test Generador Mascotas ***', () => {

    it('La mascota debe tener nombre, tipo y raza', () =>{
        const mascota = generador.get()
        console.log(mascota)
        expect(mascota).to.include.keys('nombre', 'tipo', 'raza')
    })
})
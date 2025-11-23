import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import dotenv from 'dotenv';
dotenv.config();

before(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

after(async () => {
  await mongoose.disconnect();
});

describe('Test usuarios', () => {
  it('GET usuario por ID', async () => {
    const request = supertest(app);
    const res = await request.get('/api/usuarios/6914f4446bc62499251284ac');

    console.log(res.status);
    console.log(res.body);
  });
});

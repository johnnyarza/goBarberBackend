import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import User from '../../src/app/models/User';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able to register withou name', async () => {
    const response = await request(app).post('/users').send({
      email: 'teste@gmail.com',
      password: '12345678',
    });
    expect(response.status).toBe(400);
  });

  it('should be able to register', async () => {
    const response = await request(app).post('/users').send({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '12345678',
    });

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
  });

  it('should be return a hashed password after user register', async () => {
    const user = (
      await User.create({
        name: 'Teste',
        email: 'teste@gmail.com',
        password: '12345678',
      })
    ).dataValues;

    const compareHash = await bcrypt.compare('12345678', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should not be able to register with duplicated email ', async () => {
    await request(app).post('/users').send({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '12345678',
    });

    const response = await request(app).post('/users').send({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '12345678',
    });
    expect(response.status).toBe(400);
  });

  it('should be able to create a session', async () => {
    await request(app).post('/users').send({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '12345678',
    });

    const response = await request(app).post('/sessions').send({
      email: 'teste@gmail.com',
      password: '12345678',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to update a user', async () => {
    await request(app).post('/users').send({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '12345678',
    });

    const authResponse = await request(app).post('/sessions').send({
      email: 'teste@gmail.com',
      password: '12345678',
    });

    const { token } = authResponse.body;

    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Teste',
        email: 'testeA@gmail.com',
        oldPassword: '12345678',
        password: '12345678',
        confirmPassword: '12345678',
        avatar_id: 'd4509f24-6139-40e1-ae67-58b36477fb31',
      });

    expect(response.body).toHaveProperty('email', 'testeA@gmail.com');
  });

  it('should be able to create a appointment', async () => {
    await request(app).post('/users').send({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '12345678',
    });

    const authResponse = await request(app).post('/sessions').send({
      email: 'teste@gmail.com',
      password: '12345678',
    });

    const { token } = authResponse.body;

    const response = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        provider_id: 'be315d42-7970-4398-ae6d-87c00aa31892',
        date: '2021-01-30T22:18:20-03:00',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should be get a atuh error', async () => {
    await request(app).post('/users').send({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '12345678',
    });

    const authResponse = await request(app).post('/sessions').send({
      email: 'teste@gmail.com',
      password: '12345678',
    });

    const { token } = authResponse.body;

    const response = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}a`)
      .send({
        provider_id: 'be315d42-7970-4398-ae6d-87c00aa31892',
        date: '2021-01-30T22:18:20-03:00',
      });

    expect(response.status).toBe(401);
  });

  it('should be able to get available list', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJlMzE1ZDQyLTc5NzAtNDM5OC1hZTZkLTg3YzAwYWEzMTg5MiIsImlhdCI6MTYxMTc0Njk2NSwiZXhwIjoxNjEyMzUxNzY1fQ.yJlD38m4PQ93onbcGDX-Cgevfn-hBDM0YLYD1SGU5Gc';

    const response = await request(app)
      .get('/providers/be315d42-7970-4398-ae6d-87c00aa31892/available')
      .query({ date: '1611845948336' })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
  });
});

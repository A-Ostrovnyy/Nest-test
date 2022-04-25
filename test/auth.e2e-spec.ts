import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { disconnect } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';
import {
  WRONG_PASSWORD_ERROR,
  UNAUTHORIZED_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../src/auth/auth.constants';

const loginDto: AuthDto = {
  login: 'test@test.com',
  password: '123123123',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - fail wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '12' })
      .expect(401, {
        statusCode: 401,
        message: WRONG_PASSWORD_ERROR,
        error: UNAUTHORIZED_ERROR,
      });
  });

  it('/auth/login (POST) - fail wrong email', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: '123@foo.com' })
      .expect(401, {
        statusCode: 401,
        message: USER_NOT_FOUND_ERROR,
        error: UNAUTHORIZED_ERROR,
      });
  });

  afterAll(() => {
    disconnect();
  });
});

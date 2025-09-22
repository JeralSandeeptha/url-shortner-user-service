import request from 'supertest';
import { app } from '../src/app.ts';

describe('GET /server/health', () => {
  it('returns 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/server/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});



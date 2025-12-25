import request from 'supertest';
import { createApp } from '../src/app';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { closeHttpConnections } from '../src/clients/base/httpClient';
import type { Application } from 'express';

describe('Basic functionality', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  afterAll(() => {
    closeHttpConnections();
  });

  it('should return 200 for GET /master-ser/health', async () => {
    const response = await request(app).get('/tenant-ser/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data.status', 'UP');
  });

  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
  });

});
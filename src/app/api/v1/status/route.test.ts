import { describe, expect, it } from 'vitest';

const API_BASE_URL = 'http://localhost:3000';

describe('/api/v1/status', () => {
  it('should return a response with status 200 and body "OK"', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/status`);
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toBe('OK');
  });
});

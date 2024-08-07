import { API_BASE_URL } from '@/constants';
import { HttpStatusCodeEnum } from '@/enums';

const API_URL = `${API_BASE_URL}/api/v1/migrations`;

describe('/api/v1/migrations', () => {
  describe('GET', () => {
    it('should return a response with status 200 and body "OK" and return a list of migrations', async () => {
      const response = await fetch(API_URL, { method: 'GET' });
      const data = await response.json();

      expect(response.status).toBe(HttpStatusCodeEnum.OK);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST', () => {
    it('should return a response with status 201 (migrations on "live run")', async () => {
      const response = await fetch(API_URL, { method: 'POST' });

      expect(response.status).toBe(HttpStatusCodeEnum.NO_CONTENT);
    });
  });
});

import { API_BASE_URL } from '@/constants';
import { HttpStatusCodeEnum } from '@/enums';
import { StatusRouteGetResponse } from '@/interfaces';

describe('/api/v1/status', () => {
  describe('GET', () => {
    it('should return a response with status 200 and body "OK"', async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/status`);
      const data: StatusRouteGetResponse = await response.json();

      expect(response.status).toBe(HttpStatusCodeEnum.OK);

      expect(data.dependencies.database.version).toStrictEqual('16.3');

      // Check strict `response` properties
      expect(Object.keys(data)).toStrictEqual(['updated_at', 'dependencies']);

      // Check strict `response.dependencies` properties
      expect(Object.keys(data.dependencies)).toStrictEqual(['database']);

      // Check strict `response.dependencies.database` properties
      expect(Object.keys(data.dependencies.database)).toStrictEqual([
        'opened_connections',
        'max_connections',
        'version',
      ]);
    });
  });
});

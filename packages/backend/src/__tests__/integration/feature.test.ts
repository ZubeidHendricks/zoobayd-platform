import request from 'supertest';
import { app } from '../../app';
import { Feature, User } from '../../models';
import { generateToken } from '../../utils/auth';

describe('Feature API', () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    testUser = await User.create({
      email: 'test@example.com',
      roles: ['admin']
    });
    authToken = generateToken(testUser);
  });

  beforeEach(async () => {
    await Feature.deleteMany({});
  });

  describe('POST /api/features/:featureId/access', () => {
    it('should check feature access correctly', async () => {
      const feature = await Feature.create({
        name: 'Test Feature',
        status: 'active'
      });

      const res = await request(app)
        .get(`/api/features/${feature.id}/access`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('hasAccess');
    });
  });

  describe('POST /api/features/:featureId/track', () => {
    it('should track feature usage', async () => {
      const feature = await Feature.create({
        name: 'Test Feature',
        status: 'active'
      });

      const res = await request(app)
        .post(`/api/features/${feature.id}/track`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          metrics: {
            duration: 300,
            operations: 5
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
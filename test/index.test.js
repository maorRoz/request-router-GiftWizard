const sinon = require('sinon');
const { expect } = require('chai');
const express = require('express');
const request = require('supertest');

const requestRouter = require('../index');
const ExecutionService = require('../models/ExecutionService');
const loadBalancer = require('../loadBalancer');

describe('Request Router Tests', () => {
  describe('addService', () => {
    it('addService', () => {
      let expectedService;
      const serviceToAdd = new ExecutionService(() => undefined);
      sinon.stub(loadBalancer, 'subscribe').callsFake((service) => { expectedService = service; });
      requestRouter.addService(serviceToAdd);
      expect(serviceToAdd).to.deep.equal(expectedService);
    });

    afterEach(() => loadBalancer.subscribe.restore());
  });

  describe('requestRouter', () => {
    let app;
    let expectedStoreId;
    const sentStoreId = '123';
    before(() => {
      app = express();
      app.use('/', requestRouter.requestRouter);

      app.get('/*', (req, res) => {
        res.sendStatus(200);
      });
    });

    beforeEach(() => {
      sinon.stub(loadBalancer, 'handle').callsFake((storeId) => { expectedStoreId = storeId; });
    });

    it('storeId Header', async () => {
      const url = '/api/v1/';
      await request(app).get(url).set('storeId', sentStoreId);
      expect(sentStoreId).to.equal(expectedStoreId);
    });

    it('storeId url param', async () => {
      const url = `/api/v1/campaigns?storeId=${sentStoreId}`;
      await request(app).get(url);
      expect(sentStoreId).to.equal(expectedStoreId);
    });

    it('storeId url query', async () => {
      const url = `/api/v1/storeId/${sentStoreId}/giftCard`;
      await request(app).get(url);
      expect(sentStoreId).to.equal(expectedStoreId);
    });

    afterEach(() => loadBalancer.handle.restore());
  });
});

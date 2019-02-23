const sinon = require('sinon');
const { expect } = require('chai');
const express = require('express');
const request = require('supertest');

const requestRouter = require('../index');
const ExecutionService = require('../models/ExecutionService');
const loadBalancer = require('../loadBalancer');

let app;

const cleanService = (service = { stores: [] }) => {
  requestRouter.removeService(service);
  service.stores = [];
};

const validateService = (service, executeMethod, stores, numberOfCalls) => {
  expect(service.stores).to.deep.equal(stores);
  return stores.length > 0
    ? stores.forEach((store, index) => expect(executeMethod.withArgs(store).callCount).to.equal(numberOfCalls[index]))
    : expect(executeMethod.notCalled).to.equal(true);
};


const headerRequest = (storeId) => {
  const url = '/api/v1/';
  return request(app).get(url).set('storeId', storeId);
};

const queryRequest = (storeId) => {
  const url = `/api/v1/campaigns?storeId=${storeId}`;
  return request(app).get(url);
};

const paramRequest = (storeId) => {
  const url = `/api/v1/storeId/${storeId}/giftCard`;
  return request(app).get(url);
};

describe('Request Router Fullflow Tests', () => {
  let service1;
  let service2;
  let service3;
  let spy1;
  let spy2;
  let spy3;
  const storeId1 = '1';
  const storeId2 = '2';
  const storeId3 = '3';
  before(() => {
    app = express();
    app.use('/', requestRouter.requestRouter);

    app.get('/*', (req, res) => {
      res.sendStatus(200);
    });
  });

  describe('Only one subscriber', () => {
    beforeEach(() => {
      spy1 = sinon.spy();
      service1 = new ExecutionService(spy1);
      requestRouter.addService(service1);
    });
    it('One Id has been called once', async () => {
      await headerRequest(storeId1);
      await paramRequest(storeId1);
      await queryRequest(storeId1);
      validateService(service1, spy1, [storeId1], [3]);
    });

    it('Two differnet Ids has been called multiple times', async () => {
      await headerRequest(storeId1);
      await paramRequest(storeId2);
      await paramRequest(storeId1);
      await queryRequest(storeId1);
      await headerRequest(storeId2);
      validateService(service1, spy1, [storeId1, storeId2], [3, 2]);
    });
  });

  describe('Many subscribers', () => {
    beforeEach(() => {
      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      service1 = new ExecutionService(spy1);
      service2 = new ExecutionService(spy2);
      service3 = new ExecutionService(spy3);
      loadBalancer.subscribe(service1);
      loadBalancer.subscribe(service2);
      loadBalancer.subscribe(service3);
    });

    it('One Id has been called once', async () => {
      await headerRequest(storeId1);
      validateService(service1, spy1, [storeId1], [1]);
      validateService(service2, spy2, [], []);
      validateService(service3, spy3, [], []);
    });

    it('Many Ids has been called multiple times', async () => {
      await headerRequest(storeId1);
      await queryRequest(storeId1);
      await queryRequest(storeId2);
      await headerRequest(storeId3);
      await paramRequest(storeId3);
      await headerRequest(storeId2);
      await paramRequest(storeId3);
      validateService(service1, spy1, [storeId1], [2]);
      validateService(service2, spy2, [storeId2], [2]);
      validateService(service3, spy3, [storeId3], [3]);
    });
  });

  afterEach(() => {
    cleanService(service1);
    cleanService(service2);
    cleanService(service3);
  });
});

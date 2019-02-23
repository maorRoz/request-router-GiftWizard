const sinon = require('sinon');
const { expect } = require('chai');

const ExecutionService = require('../models/ExecutionService');
const loadBalancer = require('../loadBalancer');

const cleanService = (service = { stores: [] }) => {
  loadBalancer.unsubscribe(service);
  service.stores = [];
};

const validateService = (service, executeMethod, stores, numberOfCalls) => {
  expect(service.stores).to.deep.equal(stores);
  return stores.length > 0
    ? stores.forEach((store, index) => expect(executeMethod.withArgs(store).callCount).to.equal(numberOfCalls[index]))
    : expect(executeMethod.notCalled).to.equal(true);
};

describe('Load Balancer Tests', () => {
  let service1;
  let service2;
  let service3;
  let spy1;
  let spy2;
  let spy3;
  const storeId1 = '1';
  const storeId2 = '2';
  const storeId3 = '3';
  describe('Only one subscriber', () => {
    beforeEach(() => {
      spy1 = sinon.spy();
      service1 = new ExecutionService(spy1);
      loadBalancer.subscribe(service1);
    });
    it('One Id has been called once', () => {
      loadBalancer.handle(storeId1);
      validateService(service1, spy1, [storeId1], [1]);
    });

    it('Two differnet Ids has been called once', () => {
      loadBalancer.handle(storeId1);
      validateService(service1, spy1, [storeId1], [1]);
      loadBalancer.handle(storeId2);
      validateService(service1, spy1, [storeId1, storeId2], [1, 1]);
    });

    it('One Id has been called twice', () => {
      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId1);
      validateService(service1, spy1, [storeId1], [2]);
    });

    it('Two differnet Ids has been called multiple times', () => {
      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId2);
      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId2);
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

    it('One Id has been called once', () => {
      loadBalancer.handle(storeId1);
      validateService(service1, spy1, [storeId1], [1]);
      validateService(service2, spy2, [], []);
      validateService(service3, spy3, [], []);
    });

    it('One Id has been called multiple times', () => {
      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId1);
      validateService(service1, spy1, [storeId1], [2]);
      validateService(service2, spy2, [], []);
      validateService(service3, spy3, [], []);
    });

    it('Many Ids has been called once', () => {
      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId2);
      loadBalancer.handle(storeId3);
      validateService(service1, spy1, [storeId1], [1]);
      validateService(service2, spy2, [storeId2], [1]);
      validateService(service3, spy3, [storeId3], [1]);
    });

    it('Many Ids has been called multiple times', () => {
      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId2);
      loadBalancer.handle(storeId3);
      loadBalancer.handle(storeId3);
      loadBalancer.handle(storeId2);
      loadBalancer.handle(storeId3);
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

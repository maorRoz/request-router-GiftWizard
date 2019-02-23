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
  stores.forEach((store, index) => expect(executeMethod.withArgs(store).callCount).to.equal(numberOfCalls[index]));
};

describe('Load Balancer Tests', () => {
  let service1;
  let service2;
  let service3;
  const storeId1 = '1';
  const storeId2 = '2';
  describe('Only one subscriber', () => {
    it('One Id has been called once', () => {
      const spy1 = sinon.spy();
      service1 = new ExecutionService(spy1);
      loadBalancer.subscribe(service1);
      loadBalancer.handle(storeId1);
      validateService(service1, spy1, [storeId1], [1]);
    });

    it('Two differnet Ids has been called once', () => {
      const spy1 = sinon.spy();
      service1 = new ExecutionService(spy1);
      loadBalancer.subscribe(service1);

      loadBalancer.handle(storeId1);
      validateService(service1, spy1, [storeId1], [1]);
      loadBalancer.handle(storeId2);
      validateService(service1, spy1, [storeId1, storeId2], [1, 1]);
    });

    it('One Id has been called twice', () => {
      const spy1 = sinon.spy();
      service1 = new ExecutionService(spy1);
      loadBalancer.subscribe(service1);

      loadBalancer.handle(storeId1);
      loadBalancer.handle(storeId1);
      validateService(service1, spy1, [storeId1], [2]);
    });
  });

  afterEach(() => {
    cleanService(service1);
    cleanService(service2);
    cleanService(service3);
  });
});

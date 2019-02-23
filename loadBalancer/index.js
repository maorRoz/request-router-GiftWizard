const { EventEmitter } = require('events');

const eventEmitter = new EventEmitter();

let services = [];

const subscribe = service => services.push(service);

const unsubscribe = (serviceToRemove) => {
  serviceToRemove.stores.forEach(store => eventEmitter.removeAllListeners(store));
  services = services.filter(service => service !== serviceToRemove);
};

const findMostAvailableService = () => services
  .reduce((mostAvailableService, currentService) => currentService.compareAvailability(mostAvailableService));

const addStore = (storeId) => {
  const assignedHandler = findMostAvailableService();
  assignedHandler.stores.push(storeId);
  eventEmitter.addListener(storeId, assignedHandler.execute);
};

const handle = (storeId, req) => {
  const isAssigned = eventEmitter.listenerCount(storeId) > 0;
  if(!isAssigned && services.length > 0){
    addStore(storeId);
  }

  eventEmitter.emit(storeId, req);
};

module.exports = {
  handle,
  subscribe,
  unsubscribe
};

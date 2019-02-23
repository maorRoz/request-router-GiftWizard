module.exports = class ExecutionService{
  constructor(execute){
    this.execute = execute;
    this.stores = [];
  }

  compareAvailability(service){
    return this.stores.length < service.stores.length ? this : service;
  }
};

# request-router-GiftWizard


Application:

commands: the program can be manually tested and executed with "npm run/yarn start" which execute a dummy API gateway for that purpose.

So I created some kind of a custom express middleware (using Express library) to build the desired Request Router module.

-The request router main module (in the ./index.js file) take each API request and extract from it the storeId according to the 
3 kind of methods that were presented in the instruction of the assignment, and passes the request with the storeId to the loadBalancer module.

-I've used the loadBalancer module to handle and wrap the eventEmitter which subscribe services to certain stores with events system.
This means, that whenever a store initiates a request for the first time, after the most available service has been found,
 it getting subscribed to every event with that storeId from now on. 

- I created an 'ExecutionService' class for each Execution Service in the system since it felt the right way of
 handling the states of each service in the system.

Tests:

commands: the unit tests can be executed by "npm run/yarn test". the system tests can be executed by "npm run/yarn system_tests"

- I created a unit tests with mocked loadBalancer for the request router main module
- I created a unit tests for the loadBalancer itself
- I created a 'full flow' unit tests which doesn't mock the loadBalancer and therefore test
 also the integration between the main module and the loadBalancer
- I created some kind of simple system load tests using 'artillery' library with 20 users for 60 seconds, in which each user send every kind of valid method with storeId in it

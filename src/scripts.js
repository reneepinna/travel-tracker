// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';
const dayjs = require('dayjs');

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png';
import { getCostThisYear, getUserTrips, sortTripGroup } from './model';
import { getApiData } from './apiCalls';
import { displayCostThisYear, displayUserData, displayUserTrips } from './dom-updates';

function initializeStore() {
  const store = {};

  return {
    viewStore: function () {
      console.log(store);
    },
    setKey: function (key, value) {
      store[key] = value;
    },
    getKey: function (key) {
      return store[key];
    },
  };
}

let store;

window.addEventListener('load', () => {
  store = initializeStore();
  initializeData(23);
});

function initializeData(userID) {
  Promise.all([
    getApiData(`http://localhost:3001/api/v1/travelers/${userID}`),
    getApiData('http://localhost:3001/api/v1/trips', 'trips'),
    getApiData('http://localhost:3001/api/v1/destinations', 'destinations'),
  ])
    .then(values => {
      const [user, trips, destinations] = values;
      store.setKey('user', user);
      store.setKey('userTrips', getUserTrips(trips, userID));
      store.setKey('destinations', destinations);
    })
    .then(emp => {
      store.setKey('tripGroups', sortTripGroup(store.getKey('userTrips')));
      store.setKey('costThisYear', getCostThisYear(store.getKey('userTrips'), store.getKey('destinations')))
      displayDashboard();
    });
}

function displayDashboard() {
  displayCostThisYear(store.getKey('costThisYear'))
  displayUserData(store.getKey('user'));
  displayUserTrips(store.getKey('tripGroups'), store.getKey('destinations'));
}

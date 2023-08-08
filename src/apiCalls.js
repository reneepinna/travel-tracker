import { store, displayDashboard, initializeData } from './scripts';
import { getUserTrips, sortTripGroup } from './model';
import { displayLoginError } from './dom-updates';

const getErrorBox = document.querySelector('.get-error');
const formErrorBox = document.querySelector('.form-error');

export function getApiUserData(url) {
  return fetch(url)
    .then(response => {
      if (response.status === 404) {
        throw new Error(`No user with that username was found`);
      }
      return response.json();
    })
    .then(user => {
      store.setKey('user', user);
      initializeData(store.getKey('user').id)
    })
    .catch(error => displayLoginError(error));
}

export function getApiData(url, key) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => data[key] || data)
    .catch(error => error);
}

export function setApiData(body) {
  return fetch('http://localhost:3001/api/v1/trips', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(resp => updateTrips())
    .catch(error => (formErrorBox.innerText = error));
}

export function updateTrips() {
  getApiData('http://localhost:3001/api/v1/trips', 'trips').then(trips => {
    store.setKey('trips', trips);
    store.setKey('userTrips', getUserTrips(trips, store.getKey('user').id));
    store.setKey('tripGroups', sortTripGroup(store.getKey('userTrips')));
    displayDashboard();
  });
}

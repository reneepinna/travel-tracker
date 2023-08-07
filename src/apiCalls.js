import { store , displayDashboard} from "./scripts";
import { getUserTrips, sortTripGroup } from "./model";

const getErrorBox = document.querySelector('get-error')

export function getApiData(url, key) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Oops, something went wrong! :/')
      }
      return response.json()
    })
    .then(data => data[key] || data)
    .catch(error => getErrorBox.innerText = error)
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
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(resp => updateTrips())
    .catch(error => console.log(error));
}

export function updateTrips() {
  getApiData('http://localhost:3001/api/v1/trips', 'trips')
    .then(trips => {
      store.setKey('trips', trips);
      store.setKey('userTrips', getUserTrips(trips, store.getKey('user').id));
    })
    .then(emp => {
      store.setKey('tripGroups', sortTripGroup(store.getKey('userTrips')));
      displayDashboard();
    });
}

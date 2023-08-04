export function getApiData(url, key) {
  return fetch(url)
    .then(response => response.json())
    .then(data => data[key] || data);
}

export function setApiData(
  id,
  userID,
  destinationID,
  travelers,
  date,
  duration,
) {
  return fetch('http://localhost:3001/api/v1/trips', {
    method: 'POST',
    body: JSON.stringify({
      id,
      userID,
      destinationID,
      travelers,
      date,
      duration,
      status: 'pending',
      suggestedAvtivities: [],
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => console.log(response.json()))
}

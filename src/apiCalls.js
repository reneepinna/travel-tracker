export function getApiData(url, key) {
  return fetch(url)
    .then(response => response.json())
    .then(data => data[key] || data);
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
        throw new Error('oops something went wrong');
      }
      return response.json();
    })
    .catch(error => console.log(error));
}

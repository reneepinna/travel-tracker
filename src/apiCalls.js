export function getApiData(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => data)
}


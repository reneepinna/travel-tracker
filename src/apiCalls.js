export function getApiData(url, key) {
  return fetch(url)
    .then(response => response.json())
    .then(data => data[key] || data)
}


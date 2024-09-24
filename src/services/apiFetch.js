import { BASE_URI, TOKEN_NAME } from "../config";

async function apiFetch(endpoint, { method, headers, body, isFile } = {}) {
  const token = localStorage.getItem(TOKEN_NAME);

  if(token) {
    headers = {
      Authorization: `Bearer ${token}`,
      ...headers
    }
  }

  if(body && !isFile) {
    headers = {
      "Content-Type": "application/json",
      ...headers
    }
  }

  const config = {
    method: method || (body ? "POST" : "GET"),
    headers,
    body: isFile ? body : (body ? JSON.stringify(body) : null)
  }

  const response = await fetch(`${BASE_URI}/${endpoint}`, config);

  let data;
  if(!response.ok) {
    try {
      data = await response.json();
    }catch(error) {
      console.error(error);

      throw new Error(response.statusText);
    }

    throw new Error(JSON.stringify(data.message));
  }

  try {
    data = await response.json();
  }catch(error) {
    data = response.statusText;
  }

  return data;
}

export default apiFetch;

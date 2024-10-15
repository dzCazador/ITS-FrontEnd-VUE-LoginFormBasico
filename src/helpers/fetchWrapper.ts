import { useAuthStore } from '@/stores/authStore'

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}

/**
 * A function to create and send HTTP requests with the specified method.
 *
 * @param method - The HTTP method to use for the request.
 * @returns A function that takes a URL, an optional request body, and an optional request options object.
 *          The returned function sends the HTTP request and returns a Promise that resolves with the response data.
 *          If the response status is not OK (200-299), the Promise is rejected with an error message.
 *          If the user is authenticated and the URL is an API URL, the function includes an authorization header with the JWT token.
 */
function request(method: string) {
  return (url: string, body?: any, { credentials }: { credentials?: RequestCredentials } = {}) => {
    const requestOptions: RequestInit = {
      method,
      headers: authHeader(url)
    }
    if (body) {
      requestOptions.headers = {
        ...requestOptions.headers,
        'Content-Type': 'application/json'
      }
      requestOptions.body = JSON.stringify(body)
    }
    if (credentials) {
      requestOptions.credentials = credentials
    }

    return fetch(url, requestOptions).then(handleResponse)
  }
}

//Funciones auxiliares

/**
 * A function to generate an authorization header for HTTP requests.
 *
 * @param url - The URL of the request.
 * @returns An object containing the authorization header if the user is logged in and the URL is an API URL.
 *          Otherwise, an empty object is returned.
 *
 * @remarks
 * This function checks if the user is logged in and if the provided URL starts with the API URL.
 * If both conditions are met, it generates an authorization header with the JWT token.
 * If the user is not logged in or the URL is not an API URL, an empty object is returned.
 */
function authHeader(url: string): Record<string, string> {
  const { auth } = useAuthStore()
  const isLoggedIn = !!auth.user?.jwtToken
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL)

  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${auth.user?.jwtToken}` }
  } else {
    return {}
  }
}

async function handleResponse(response: Response): Promise<any> {
  const text = await response.text()
  const data: any = text ? JSON.parse(text) : null

  if (!response.ok) {
    const { auth, logout } = useAuthStore()
    if ([401, 403].includes(response.status) && auth.user) {
      logout()
    }

    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }

  return data
}

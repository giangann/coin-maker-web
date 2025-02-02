import Axios from 'axios'

export const baseURL = `${import.meta.env.VITE_API_URL}`
// const refetchTokenURL = ${baseURL}/${V1}/user/refresh-token

async function authRequestInterceptor(config: any) {
  const _token = await localStorage.getItem('user-token')
  // Fix stupid axios typescript
  if (_token && _token !== 'undefined' && config.headers) {
    const token = _token
    config.headers.authorization = `Bearer ${token}`
    config.headers.common['Accept-Language'] = localStorage.getItem('language')

    // console.log(`Bearer ${token}`)
  }
  return config
}

export const request = Axios.create({
  baseURL,
})

request.interceptors.request.use(authRequestInterceptor)

import HttpRequest from '@/libs/axios'
import config from '@/config'

// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const baseUrl = 'http://localhost:8081'
const axios = new HttpRequest('http://118.31.246.22:8081/')
// const axios = new HttpRequest('http://127.0.0.1:8081/')

export default axios
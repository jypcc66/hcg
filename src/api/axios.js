import axios from 'axios'
import Cookies from 'js-cookie'
const instance = axios.create({
  baseURL:'/dev/web/admin/',
  headers: {sessionKey:Cookies.get('token')}
})
instance.interceptors.request.use(
  // 请求拦截器
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  // 响应拦截器
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    if(error.response.status == 401){
        location.href = "/login"
    }else{
      return Promise.reject(error)
    }
    
  }
)

const POST = (url,data) => {
  return instance.post(url,data).then(res => {
    if(res.status === 200){
      return res.data
    }
  })
}

const GET = (url,params) => {
  return instance({
    method: 'GET',
    url: url,
    params: params
  }).then(res => {
    if(res.status === 200){
      return res.data
    }
  })
}

export default{
  POST,
  GET
}
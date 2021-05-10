import axios from 'axios'
import {Message} from 'element-ui';

// 请求超时时间
axios.defaults.timeout = 10000;
// post请求头
// axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
// request interceptor
axios.interceptors.request.use(
  config => {
    //请求前拦截

    return config
  }, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
)

axios.interceptors.response.use(success => {
  // 后端有全局异常捕获，后端异常前端接到仍是200，错误信息错误码在data中
  if (success.status && success.status === 200 && success.data.code !== 200) {
    Message.error({message: success.data.desc})
    Message.error({message: '服务端异常( ╯□╰ )'})
  }
  return success.data;
}, error => {

    if (error.response.data.desc) {
      Message.error({message: error.response.data.desc})
    } else {
      Message.error({message: '未知错误!'})
    }

  return error.data;
})

let base = '';

export const jsonPost = (url, body, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    data: body
  });
}

export const getRequest = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      params: params,
      url: `${base}${url}`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}


export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
}
export const formPost = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

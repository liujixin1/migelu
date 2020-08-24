import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let loading //定义loading变量
function startLoading() { //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)"
    })
}
function endLoading() { //使用Element loading-close 方法
    loading.close()
}
// create an axios instance
const service = axios.create({
    // baseURL: 'http://api.app.mhsys.cn/', // url = base url + request url 正式
    baseURL: 'http://mglapp.api.hihill.cn/index.php/', // url = base url + request url 测试

    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        startLoading()
        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['X-Token'] = getToken()
        }
        return config
    },
    error => {
        endLoading()
            // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        endLoading()
        const res = response.data
        console.log(res)
            // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 0) {
            loading.close()
            console.log(`code!=0`)
                // Message({
                //   message: res.msg || 'Error',
                //   type: 'error',
                //   duration: 5 * 1000
                // })
                // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.code === 4001) {
                loading.close()
                    // to re-login
                    // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                    //   confirmButtonText: 'Re-Login',
                    //   cancelButtonText: 'Cancel',
                    //   type: 'warning'
                    // }).then(() => {
                store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                    // })
            } else if (res.code == 1001) {
                Message({
                    message: res.message || res.msg || 'Error',
                    type: 'error',
                    duration: 3 * 1000
                })
            } else if (res.code == 1003) {
                Message({
                    message: res.message || res.msg || 'Error',
                    type: 'error',
                    duration: 3 * 1000
                })
            } else if (res.code == 4002) {
                Message({
                    message: res.message || res.msg || 'Error',
                    type: 'error',
                    duration: 3 * 1000
                })
            }
            // return Promise.reject(new Error(res.msg || 'Error'))
            return Promise.reject(res)
        } else {
            return res
        }
    },
    error => {
        loading.close()
        console.log('err' + error) // for debug
        Message({
            message: '系统繁忙，请稍后再试',
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
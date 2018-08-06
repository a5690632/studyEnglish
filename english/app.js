const util = require('utils/util.js');



const onLineBaseUrl = ""; //正式版线上接口


const INTERFACE = { //接口定义
    local: {
        login: "https://www.devpmis.cn/wxapp/api/v1/login",
        send_code: "https://www.devpmis.cn/wxapp/api/v1/sendVerifyCode",
        auto_login:"https://www.devpmis.cn/wxapp/api/v1/auto_login",
        index: "https://www.devpmis.cn/wxapp/api/v1/homepage",
        booksuite:"https://www.devpmis.cn/wxapp/api/v1/searchByCategory",
        booklist: "https://www.devpmis.cn/wxapp/api/v1/bookList",
        book: "https://www.devpmis.cn/wxapp/api/v1/book",
        course: "https://www.devpmis.cn/wxapp/api/v1/page",
        logout: "https://www.devpmis.cn/wxapp/api/v1/logout",
        vip_help:"https://www.devpmis.cn/wxapp/api/v1/vip_info",
        user_message:"https://www.devpmis.cn/wxapp/api/v1/getMyInfo",
        concent_us:"https://www.devpmis.cn/wxapp/api/v1/contact_us",
        
    }
}
App({
    is_login:false,
    user:{},//用户信息
    Cookie:"",
    requestStack: [], // 请求栈，防止同时执行多条查询
    onLaunch() {
       
    },
    request(requestOpt) {
        // 封装request请求
        // 逐个调用请求栈，防止同时执行多条查询
        this.requestStack.push(requestOpt)
        this.runRequestStack(this.requestStack[0])
    },
    runRequestStack(opt) {
        //防止按钮多次提交
        if (opt.button && this.globalData.isRequest) {
            console.log("阻止重复提交请求")
            return
        }
        this.globalData.isRequest = true

    
        const defaultOpt = {
            url: '', // 请求地址
            loading: true, // 是否显示Loading提示窗
            method: 'GET', // 请求方法，必须大写！！
            data: {} // 请求数据
        }
      
        opt = Object.assign(defaultOpt, opt)
        var header={}
        header.Cookie=this.Cookie
        
        if (opt.loading) {
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        }
        wx.request({
            header: header, 
            url: opt.url,
            method: opt.method,
            data: opt.data,
            success: (res) => {
                // 删除本次回调栈
                if(!this.Cookie){
                   this.Cookie=res.header["Set-Cookie"]
                }
                this.requestStack.splice(0, 1)
                if (this.requestStack.length != 0) {
                    // 如果回调栈还有回调，继续执行
                    this.runRequestStack(this.requestStack[0])
                }
                if (res.data.status == -101) {
                    ////console.log('后台未登录或登录超时')
                    // 后台未登录或登录超时
                    wx.redirectTo({
                        url:"/pages/login/login"
                    })
                } else if (res.data.status !== 1) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        
                        showCancel: false,
                        success: () => {
                            this.runCallback(opt.fail, res)
                        }
                    })
                } else {
                    this.runCallback(opt.success, res)
                }
            },
            fail: (res) => {
                // 删除本次回调栈
                this.requestStack.splice(0, 1)
                if (this.requestStack.length != 0) {
                    // 如果回调栈还有回调，继续执行
                    this.runRequestStack(this.requestStack[0])
                }
            },
            complete: res => {
                if (opt.loading) {
                    wx.hideLoading()
                }
                setTimeout(() => {
                    this.globalData.isRequest = false
                }, 300)
            }
        })

    },
    runCallback(callback, opt = '') {
        // 封装执行回调，参数必须为函数
        if (typeof callback === 'function') {
            callback(opt)
        } else {
            console.log('回调函数必须为函数')
        }
    },


    globalData: {
        isRequest: false, //当前是否在发送请求
    },
    //分享文案
    interface: INTERFACE.local
})
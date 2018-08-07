const app = getApp()

Page({
    data: {
        phone: "", //手机号
        verification_code: "", //验证码
        send_status: false, //发送状态
        time: 30, //倒计时
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载

    },
    verification() {
        //发送验证码
        var self = this
        var phone = /^1[3456789]\d{9}$/
        if (this.data.phone == "") {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '电话不能为空',
            })
        } else if (!phone.test(this.data.phone)) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请输入正确的电话',
            })
        } else {
            this.setData({
                send_status: true
            })
            var time = 30;
            var timer = null;
            timer = setInterval(function () {
                if (time > 0) {
                    time = time - 1;
                    self.setData({
                        time: time
                    })
                } else {
                    self.setData({
                        send_status: false
                    })
                    clearInterval(timer);
                }
            }, 1000);
            app.request({
                url: app.interface.send_code,
                data: {
                    mobile: this.data.phone,
                },
                success: (res) => {
                    wx.showToast({
                        title: res.data.msg
                    })

                }
            })
        }
    },
    enter_phone(event) {
        //输入手机
        this.setData({
            phone: event.detail.value
        })
    },
    enter_code(event) {
        //输入验证码
        this.setData({
            verification_code: event.detail.value
        })
    },
    login() {
        //登陆
        app.request({
            url: app.interface.login,
            data: {
                mobile: this.data.phone,
                verifyCode: this.data.verification_code,
            },
            methods:"POST",
            success(res) {
                app.is_login=true
                wx.setStorageSync('token', res.data.data.token)
                app.request({
                    url:app.interface.user_message,
                    success:(res)=>{
                       wx.setStorageSync("user",res.data.data)
                       wx.switchTab({
                        url:"/pages/index/index"
                        })  
                    }
                })
              
            }
        })
    },
    onShareAppMessage: function () {
        // 用户点击右上角分享

        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    }
})
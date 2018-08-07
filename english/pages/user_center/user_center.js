// pages/user_center/user_center.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {
            status: "",
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (wx.getStorageSync("user")) {
            this.setData({
                user: wx.getStorageSync("user").userinfo
            })
        } else {
            app.request({
                url: app.interface.user_message,
                success: (res) => {
                    wx.setStorageSync("user", res.data.data)
                    this.setData({
                        user: res.data.data.userinfo
                    })
                }
            })


        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {


    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    help() {
        app.request({
            url: app.interface.concent_us,
            success: (res) => {
                wx.showModal({
                    showCancel: false,
                    title: res.data.data.title,
                    content: res.data.data.content
                })
            }
        })
    },
    login_out() {
        //注销
        app.request({
            url: app.interface.logout,
            data: {
                token: wx.getStorageSync('token')
            },
            success: (data) => {
                wx.showToast({
                    title: data.data.msg
                })
                wx.removeStorageSync("token")
                this.setData({
                    user: {}
                })
                wx.redirectTo({
                    url: "/pages/login/login"
                })
            }
        })
    },
    login() {
        wx.redirectTo({
            url: "/pages/login/login"
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
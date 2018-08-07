const app = getApp()

Page({
    data: {
            categoryList: [], //功能区
            suiteList: [], //书
    },
    onLoad: function (options) {
    
        // 生命周期函数--监听页面加载
        if (wx.getStorageSync('token')) {
            if(!app.is_login){
                app.request({
                    url: app.interface.auto_login,
                    data: {
                        token: wx.getStorageSync('token')
                    },
                    success:(res)=> {
                        app.is_login=true
                        wx.showToast({
                            title: res.data.msg
                        })
                        app.request({
                            url: app.interface.index,
                            success: (res) => {
                                res.data.data.suiteList.forEach(e => {
                                    e.logo="https://www.readinglib.cn/wxapp"+e.logo
                                });
                                this.setData({
                                    categoryList: res.data.data.categoryList, //功能区
                                    suiteList: res.data.data.suiteList, //书
                                })
                               
                            },
                        })
                    }
                })
            }else{
                app.request({
                    url: app.interface.index,
                    success: (res) => {
                        res.data.data.suiteList.forEach(e => {
                            e.logo="https://www.readinglib.cn/wxapp"+e.logo
                        });
                        
                    },
                })
            }
        } 
        else {
            wx.redirectTo({
                url: "/pages/login/login"
            })
        }
    },
  
    onShow: function () {
        // 生命周期函数--监听页面显示
      
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    enter_booksuite(event){
        wx.navigateTo({
            url: `/pages/booksuite/booksuite?id=${event.currentTarget.id}&name=${event.currentTarget.dataset.name}`
        })
    },
    enter_booklist(event) {
        wx.navigateTo({
            url: `/pages/booklist/booklist?id=${event.currentTarget.id}&name=${event.currentTarget.dataset.name}`
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
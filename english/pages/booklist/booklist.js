const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookList: [],
        ismore: true, //是否还有
        page: "1", //当前页
        suiteId: "", //id
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        var id = options.id
        this.setData({
            suiteId:options.id
        })
        wx.setNavigationBarTitle({
            title:options.name
        })
        app.request({
            url: `${app.interface.booklist}?suiteId=${options.id}`,
            data: {
                currentPage:1,
            },
            method: "POST",
            success: (res) => {
                this.setData({
                    bookList: res.data.data.bookList,
                    suiteId: id,
                })
            }
        })
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.ismore) {
            app.request({
                button: true,
                url: `${app.interface.booklist}?suiteId=${this.data.suiteId}`,
                data: {
                    currentPage: Number(this.data.page) + 1,
                },
                method: "POST",
                success: res => {
                    if (res.data.data.bookList.length <= 0) {
                        this.setData({
                            is_more: false
                        });
                    }
                    let booklist = this.data.bookList.concat(res.data.data.bookList);
                    let page = Number(this.data.page) + 1;
                    this.setData({
                        bookList: booklist,
                        page: page
                    });
                }
            });
        }
    },
    help() {
        app.request({
            url: app.interface.vip_help,
            success: (res) => {
                wx.showModal({
                    showCancel: false,
                    title: res.data.data.title,
                    content: res.data.data.content,
                })
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    enter_book(event) {
        wx.navigateTo({
            url: `/pages/book/book?id=${event.currentTarget.id}&name=${event.currentTarget.dataset.name}`
        })
    },
})
const app = getApp()

Page({
    data: {
        pageList: [], //页
        book: {}, //书的信息'
        is_more: true,
        page: "1",
        id:"",
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id
        this.setData({
            id:id
        })
        wx.setNavigationBarTitle({
            title:options.name
        })
    
        app.request({
            button: true,
            url: `${app.interface.book}/${id}`,
            data:{
                currentPage:1
            },
            method:"POST",
            success: (res) => {
                res.data.data.pageList.forEach(element => {
                    if(element.img.substr(0,4)!=='http'){
                        element.img="https://www.readinglib.cn/wxapp"+element.img
                    }
                });
                this.setData({
                    pageList: res.data.data.pageList,
                    book: res.data.data.book
                })
            }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.is_more) {
            app.request({
                button: true,
                url: `${app.interface.book}/${this.data.id}`,
                data: {
                    currentPage: Number(this.data.page) + 1,
                },
                method:"POST",
                success: res => {
                    if (res.data.data.pageList.length<=0) {
                        this.setData({
                            is_more: false
                        });
                    }
                    res.data.data.pageList.forEach(element => {
                        if(element.img.substr(0,4)!=='http'){
                            element.img="https://www.readinglib.cn/wxapp"+element.img
                        }
                    });
                    let pageList = this.data.pageList.concat(res.data.data.pageList);
                    let page =Number(this.data.page) + 1;
                    this.setData({
                        pageList: pageList,
                        page: page
                    });
                }
            });
        }
    },
    /**
     * 用户点击右上角分享
     */
    enter_course(event) {
        wx.navigateTo({
            url: `/pages/course/course?id=${event.currentTarget.id}&name=${event.currentTarget.id}`
        })
    },
})
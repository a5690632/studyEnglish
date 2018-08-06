// pages/my_resources/my_resources.js
const app = getApp()

Page({
    data: {
        booklist: [],//书
        ismore: true,//是否还有
        page: "1",//当前页
        categoryId:"",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
       
        this.setData({
            categoryId:options.id
        })
        wx.setNavigationBarTitle({
            title:options.name
        })
        app.request({
            url: `${app.interface.booksuite}?categoryId=${options.id}`,
            data:{
                currentPage:1,
            },
            method:"POST",
            success: res => {
                res.data.data.suiteList.forEach(element => {
                    element.logo="https://www.devpmis.cn/wxapp"+element.logo
                });
              
                this.setData({
                    booklist: res.data.data.suiteList,
                    page_detail:res.data.page
                });
            }
        });
    },
    // 下拉刷新
    onReachBottom() {
        if (this.data.ismore) {
            app.request({
                button: true,
                url: `${app.interface.booksuite}?categoryId=${this.data.categoryId}`,
                data: {
                    currentPage: Number(this.data.page) + 1,
                },
                method:"POST",
                success: res => {
                    if (res.data.data.suiteList.length<=0) {
                        this.setData({
                            ismore: false
                        });
                    }
                    res.data.data.suiteList.forEach(element => {
                        element.logo="https://www.devpmis.cn/wxapp"+element.logo
                    });
                    let booklist = this.data.booklist.concat(res.data.data.suiteList);
                    let page =Number(this.data.page)+ 1;
                    this.setData({
                        booklist: booklist,
                        page: page
                    });
                }
            });
        }
    },
    //跳转 书
    enter_booklist(event) {
        wx.navigateTo({
            url: `/pages/booklist/booklist?id=${event.currentTarget.id}`
        });
    },
    
});

const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()
Page({
    data: {
        itemList: [],
        status: 1,
        page_detail: [], //页详情
        index: 0, //当前播放

    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var id = options.id
        this.getdata(id, this.created_audio)
        wx.setNavigationBarTitle({
            title: options.name
        })
    },
    created_audio() {
        //创建audio

        innerAudioContext.src = this.data.itemList[0].audio
        innerAudioContext.play()
        innerAudioContext.onEnded(() => {
            if (this.data.index < this.data.itemList.length - 1) {
                innerAudioContext.src = this.data.itemList[this.data.index + 1].audio
                this.setData({
                    index: Number(this.data.index + 1)
                })
            } else {
                this.next()
            }
        })

    },
    choose_play(event) {

        innerAudioContext.src = event.currentTarget.dataset.audio
        innerAudioContext.play()
        this.setData({
            index: event.currentTarget.dataset.index
        })
    },
    prev() {
        if (this.data.page_detail.prevId == null) {
            wx.showToast({
                title: "已经是最后一页了"
            })
        } else {
            this.getdata(this.data.page_detail.prevId, () => {
                innerAudioContext.src = this.data.itemList[0].audio;
                this.setData({
                    index: 0
                })
            })
        }
    },
    next() {
        if (this.data.page_detail.nextId == null) {
            wx.showToast({
                title: "已经是最后一页了"
            })
        } else {
            this.getdata(this.data.page_detail.nextId, () => {
                innerAudioContext.src = this.data.itemList[0].audio;
                this.setData({
                    index: 0
                })
            })
        }
    },
    getdata(id, callback) {
        app.request({
            url: `${app.interface.course}/${id}`,
            success: (res) => {
                res.data.data.page.img = "https://www.readinglib.cn/wxapp" + res.data.data.page.img
                res.data.data.itemList.forEach(element => {
                    element.audio = "https://www.readinglib.cn/wxapp" + element.audio
                });
                this.setData({
                    itemList: res.data.data.itemList,
                    page_detail: res.data.data.page,
                    page: res.data.page
                })
                typeof callback == "function" ? callback() : console.log('回调函数必须为函数')
            }
        })
    },
    play() {
        innerAudioContext.play()
        this.setData({
            status:1
        })
    },
    pause() {
        innerAudioContext.pause()
        this.setData({
            status:0
        })
    },
    help() {
        app.request({
            url:app.interface.concent_us,
            success:(res)=>{
                wx.showModal({
                    showCancel:false,
                    title: res.data.data.title,
                    content:res.data.data.content
                })
            }
        })
    },
})
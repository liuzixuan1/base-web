/**
 * Created by yk on 2017/2/13.
 */
import axios from "@/libs/api.request";
import nopic from "@/assets/images/nopic.jpg";
export default {
  data() {
    return {
      modstatus: false,
      save_loading: false,
      imgurl: nopic,
      getTokenUrl: this.$config.serverName.payServer + "/evasion-audit/payobjectionquerydetail/getToken.json",
      getdownloadUrl: this.$config.serverName.uploadServer + "rest/tbps/file/download",
      access_token: "13043314e1a6424cacd46d6a947923f0",
      getUserUrl:
          this.$config.serverName.userServer +
          "user/getUserOrgListByUserId.json",
      getQueryByPicId:this.$config.serverName.pictureServer+"api/picture/queryByPicId"
    }
  },
  methods: {
    getUser() {
      return JSON.parse(Cookies.get(this.$user))
    },
    getUserInfo() {
      return axios.request({
        url: this.getUserUrl,
        method: "get",
        params: {
          userId:this.$store.state.user.userId
        }
      });
    },
    getUrlToBigImg(picUrl) {
      
      //根据海量图高清连接返回图片
      return axios
        .request({
          url: picUrl,
          method: "get",
          code: true,
          toast:true
        })
        // .then(res => {
        //   if(res.data&&res.data.code){
        //     this.$set(this.InspectorThroughImage[index],"bigimg",this.InspectorThroughImage[index].bigPositivePic||this.InspectorThroughImage[index].bigBackPic);
        //   }else{
        //     this.$set(this.InspectorThroughImage[index],"bigimg",res.data);
        //   }
          
        //   //return res.data;
        // });

    },
    formatImg(fileUrl) {
      //根据文件URL返回文件图片
      console.log(fileUrl);
      let suffix = this.matchType(fileUrl);
      if (suffix == 'image') {
        console.log(this.getDownloadImage(fileUrl));
        return this.getDownloadImage(fileUrl);
      } else {
        return require("@/assets/images/fileIcon/" + suffix + ".png");
      }
    },
    getDownloadfile(item) {
      axios
        .request({
          url: this.getdownloadUrl,
          method: "get",
          code: true,
          params: {
            method: "download",
            access_token: this.access_token,
            path: item.fileUrl
          }

        })
        .then(res => {
          this.download(res.data, item);
        });

    },
    getDownloadImage(fileUrl) {
      axios
        .request({
          url: this.getdownloadUrl,
          method: "get",
          responseType: "arraybuffer",
          code: true,
          params: {
            method: "download",
            access_token: this.access_token,
            path: fileUrl
          }

        })
        .then(res => {
          return 'data:image/png;base64,' + btoa(
            new Uint8Array(res.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
        });

    },
    async getQueryByPicIdImg(picId) {
      return axios
        .request({
          url: this.getQueryByPicId+"?cols=bigPositivePic&picId="+picId,
          method: "post",
          code: true

        })
      
    },
    download(data, row) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      // 获取文件名
      // download 属性定义了下载链接的地址而不是跳转路径
      link.setAttribute('download', row.fileName)
      document.body.appendChild(link)
      link.click()
    },
    getFileType(fileName) {
      //文件类型, '1：视频,2：音频,3：图像,4：文本文件,5：其他',
      let type = this.matchType(fileName);
      let fileType = 5;
      switch (type) {
        case "image":
          fileType = 3;
          break;
        case "txt":
          fileType = 4;
          break;
        case "video":
          fileType = 1;
          break;
        case "radio":
          fileType = 2;
          break;
        default:
          fileType=5;
          break;
      }
      return fileType;

    },
    getFileSuffix(fileName) {
      var suffix = '';
      try {
        var flieArr = fileName.split('.');
        suffix = flieArr[flieArr.length - 1];
      } catch (err) {
        suffix = '';
      }
      return suffix;
    },
    matchType(fileName) {
      // 后缀获取
      var suffix = this.getFileSuffix(fileName);
      // 获取类型结果
      var result = '';

      // fileName无后缀返回 false
      if (!suffix) {
        result = false;
        return result;
      }
      // 图片格式
      var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
      // 进行图片匹配
      result = imglist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'image';
        return result;
      };
      // 匹配txt
      var txtlist = ['txt'];
      result = txtlist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'txt';
        return result;
      };
      // 匹配 excel
      var excelist = ['xls', 'xlsx'];
      result = excelist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'excel';
        return result;
      };
      // 匹配 word
      var wordlist = ['doc', 'docx'];
      result = wordlist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'word';
        return result;
      };
      // 匹配 pdf
      var pdflist = ['pdf'];
      result = pdflist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'pdf';
        return result;
      };
      // 匹配 ppt
      var pptlist = ['ppt'];
      result = pptlist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'ppt';
        return result;
      };
      // 匹配 视频
      var videolist = ['mp4', 'm2v', 'mkv'];
      result = videolist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'video';
        return result;
      };
      // 匹配 音频
      var radiolist = ['mp3', 'wav', 'wmv'];
      result = radiolist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = 'radio';
        return result;
      }
      // 其他 文件类型
      result = 'other';
      return result;
    },
    getToken() {
      //获取令牌
      return axios
        .request({
          url: this.getTokenUrl,
          method: "get"
          // toast: true,    //默认为false，如果需要开启请求成功提醒，设置为true
        })
    },
  }
}

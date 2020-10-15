/**
 * Created by yk on 2017/2/13.
 */
import Bus from './bus.js'
import Cookies from 'js-cookie'
import { mapMutations } from 'vuex'
import {
  editButton,
  deleteButton,
  editRootButton,
	fileButton
} from './common'
export default {
  data () {
    return {
      currenttab:"query",
      total: 0,
      test: '',
      tabs: [],
      tableData: [],
			loadingTable:false,
			communityList:[],
      currentpage: 1,
      pagesize: 8,
      yesnoname: ['是', '否'],
			imgName:'',
			visible:false,
    }
  },
  created () {
		
    Bus.$on(this.getDataValue, () => {
      this.getData(this.getDataCallback)
    })
    Bus.$on(this.module+"finish", (name,show) => {
      this.removeTab(name)
      if(!show){
        this.currenttab='query'
      }else{
        this.currenttab=show
      }
      
    })
    Bus.$on(this.module+"editroot", (obj) => {
      this.editroot(obj)
    })
  },
  computed: {
		uploadAction(){
			return this.$http.defaults.baseURL+"base/upload"
		},
    pageTagsList () {
      return this.$store.state.app.tagNavList
    },
    getDataValue () {
      return 'get' + this.module
    },
    deleteaction () {
      return this.module + '/delete'
    },
    listaction () {
      return this.module + '/query'
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    ...mapMutations([
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    renderop (h, params,switcher) {
			switcher=switcher==undefined?'delete,edit':switcher
			let currentRowData = this.tableData[params.index]
			let op = []
			if(switcher.indexOf('edit') > -1){
				 op.push(editButton(this, h, currentRowData, params.index))
			}
			
			if(switcher.indexOf('filein') > -1){
				op.push(fileButton(this, h, currentRowData, params.index))
			}
			if(switcher.indexOf('delete') > -1){
				 op.push(deleteButton(this, h, currentRowData, params.index))
			}
      return h('div', op)
    },
    renderrootop (h, params) {
      let currentRowData = this.tableData[params.index]
      let op = []
      // if (this.checkroles(this.module + "save")) {
      op.push(editRootButton(this, h, currentRowData, params.index))
     //  }
     //  if (this.checkroles(this.module + "delete")) {
      op.push(deleteButton(this, h, currentRowData, params.index))
     //  }
      return h('div', op)
    },
		fileIn (obj){
			let action = 'file'
			let actiontitle = '归档'
			if(!obj) obj={}
			let flag = this.isExistTab(action)
			if(!flag){
			  this.tabs.push({
			    name: action,
			    title: actiontitle + this.chname,
			    data:obj
			  })
			}else{
				this.removeTab(action)
				this.tabs.push({
					name: action,
					title: actiontitle + this.chname,
					data:obj
				})
			}
			this.currenttab = action
		},	
    editroot (obj) {
      let action = obj.action
      let actiontitle = obj.actiontitle
      let flag = this.isExistTab(action)
      if(!flag){
        this.tabs.push({
          name: action,
          title: actiontitle,
          data:obj
        })
      }else{
        if(actiontitle.indexOf('编辑')!=-1){
          this.removeTab(action)
          this.tabs.push({
            name: action,
            title: actiontitle ,
            data:obj
          })
        }
      }
      this.currenttab = action
    },
    edit (obj) {
      // this.edit({
      //   'id': 'new'
      // })
      let action = 'edit'
      let actiontitle = '新增'
      if(!obj) obj={}
      if(obj&&obj.id){
        actiontitle = '编辑'
      }
      let flag = this.isExistTab(action)
      if(!flag){
        this.tabs.push({
          name: action,
          title: actiontitle + this.chname,
          data:obj
        })
      }else{
        if(actiontitle==='编辑'){
          this.removeTab(action)
          this.tabs.push({
            name: action,
            title: actiontitle + this.chname,
            data:obj
          })
        }
      }
      this.currenttab = action
    },
    addOtherTab(name,title,data){
      let flag = this.isExistTab(name)
      if(flag){
        this.removeTab(name)
      }
      this.tabs.push({
        name: name,
        title: title,
        data:data
      })
      this.currenttab = name
    },
    handleTabRemove(name){
      this.removeTab(name)
    },
    isExistTab(name){
      let flag = false
      this.tabs.forEach((value,index)=>{
        if(name==value.name){
          flag = true
          return
        }
      })
      return flag
    },
    removeTab(name){
      this.tabs.forEach((value,index)=>{
        if(name===value.name){
          this.tabs.splice(index,1)
        }
      })
    },
    // edit (params, title) {
    //   if (!title) {
    //     title = (params.id === 'new' ? '新增' : '编辑') + this.chname
    //   }
    //   params.title = title
    //   // this.setTagNavList(getNewTagList(this.pageTagsList, this.$route))
    //   this.$router.push({
    //     name: this.name,
    //     params: params
    //   })
    // },
    resetForm (name) {
      this.orgList = []
      this.communityList=[]
      this.$refs[name].resetFields()
      this.searchform.orgCode=''
      this.searchform.mainOrgId=''
      this.getData()
    },
    getUser () {
      return JSON.parse(Cookies.get(this.$user))
    },
    checkroles (sr) {
//       var r = Cookies.get('r')
//       if (r && r.indexOf(sr) !== -1) {
//         return true
//       } else {
//         return false
//       }
			return true;
    },
    tablesearch: function () {
      this.currentpage = 1
      this.getData()
    },
    pageSizeChange: function (pagesize) {
      this.pagesize = pagesize
      this.currentpage = 1
      this.getData()
    },
    pageChange: function (currentpage) {
      this.currentpage = currentpage
      this.getData()
    },
    getDictData: function (code, callback) {
      this.$http.post('dict/query/code', {
        code: code
      })
        .then((response) => {
          if (callback) callback(response.data.b)
        })
    },
    getData: function (callback) {
      var vm = this
      this.loading = true
			this.loadingTable = true
      vm.$http.post(vm.listaction, Object.assign({
        'curPage': vm.currentpage,
        'pageSize': vm.pagesize
      }, vm.searchform))
        .then((response) => {
					if(response!==undefined){
						if (response.data.total || response.data.total === 0) {
						  vm.tableData = response.data.b
						  vm.total = response.data.total
						} else {
						  vm.tableData = response.data.b
						}
						vm.loading = false
						vm.loadingTable = false
						if (typeof (callback) === 'function') callback(response.data.b)
					}
          
        })
    },
    deleteData: function (id) {
      var _this = this
      this.$http.post(this.deleteaction, {
        'id': id
      })
        .then((response) => {
          if (response.data.c === '0') {
            _this.$Message.success('删除成功!')
            _this.getData()
            if (_this.deleteCallback) {
              _this.deleteCallback()
            }
          } else {
            _this.$Message.error(response.data.m)
          }
        })
    },
		//导入模板之前调用
		beforeExcelUpload:function(res){
			let filename = res.name;
			let arr = filename.split('.');
			let form = arr[arr.length-1];
			let admit = "xls,xlsx";
			if(admit.indexOf(form) == -1){
				this.$Message.error("请上传.xls或.xlsx文件");
				return false;
			}
		},
		//下载excel导入模板
		downloadExcelModel:function(){
			
		},
		//批量导出数据
		exportDataIntoExcel:function(searchform){
			let $this = this;
			let params = '';
			let index = 0;
			for(let key in $this.searchform){
				if(index==0){
					params+="?"+key+"="+$this.searchform[key];
				}else{
					params+="&"+key+"="+$this.searchform[key];
				}
				index+=1;
			}
			window.open($this.$http.defaults.baseURL+this.exportModule+params);
			// this.$http.get(this.exportModule).then(function(res){
			// 	console.log(res)
			// });
		},
		//批量导入数据
		uploadExcelModel:function(res){
			if(res.b.url!=undefined){
				console.log(res.b.url);
				
				this.$http.get(this.excelModule+'?uploadFile='+res.b.url).then(function(res){
					//完成数据导入，需要判断是否同步
				});
			}else{
				this.$Message.error("导入文件上传失败")
			}
		},
		//批量导入失败
		uploadExcelModelFail:function(res){
			console.log("失败"+JSON.stringify(res))
		}
		
  }
}

<template>
    <div>
        <Input v-if="showSearcher" search placeholder="请输入关键字，按Enter搜索..." />
        <Tree ref="tree"
          :data="treeData"
          :show-checkbox="showSheckbox"
          :check-strictly="checkStrictly"
          :render="renderContent"
          @on-select-change="selectChange"
          @on-check-change="checkChange">
        </Tree>
    </div>
</template>

<script>
import axios from '@/libs/api.request'
import { getTreeData } from '@/libs/util.js'
import { hasKey } from '@/libs/tools.js'
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    showSearcher: {
      type: Boolean,
      default: true
    },
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showSheckbox: {
      type: Boolean,
      default: false
    },
    checkStrictly : {
      type: Boolean,
      default: false
    },
    customCheckStrictly : {   //复选框状态下 是否有自定义严格遵循父子不互相关联的做法
      type: Boolean,
      default: false
    },
    /** 设置icon,主要是根据node_type来设置，
    * 比如机构人员树，机构的node_type为org，人员的node_type为user
    * 则此字段为 {org: "xxx-icon",user: "yyy-icon"}，x y为具体的icon名称
    */
    icons: {
      type: Object,
      default: () => {
        return {parent_node:"ios-folder",child_node:"ios-folder-open-outline"}
      }
    }
  },
  data () {
    return {
        treeData: []
    }
  },
  methods : {
    /** 加载树数据，
     * data: 查询参数
     * 如果传入expandNodeId，则认为需要默认展开指定节点
     **/
    loadData(data, expandNodeId) {
      axios.request({
          url: this.url,
          method: 'post',
          data: data
      }).then(res => {
        if(res.data && res.data.code.code == 0) {
          let expandIds = "";
          let selectedIds = "";
          let checkedIds = "";
          const resultLength = res.data.result.length;
          let datas = res.data.result;
          for(let i=0; i < resultLength; i++) { //循环数据，清洗数据
            let data = datas[i];
            if(data.parent_id == null) {  //节点parent_id为null的 转化为空
              data.parent_id = "";
            }
            //todo 这里需要改进，目前只支持一个节点展开和选中
            if(expandNodeId && expandNodeId.indexOf(data.id) >= 0 ){
              expandIds = data.node_route;
              selectedIds = data.id;
            }
            if(this.customCheckStrictly) {  //是否有自定义复选框勾选状态关联情况处理，下面的方法严重依赖树路由 node_route
              for(let j = 0; j<resultLength; j++) {
                let data2 = datas[j];
                if(data.id != data2.id && data2.node_route.indexOf(data.node_route) >= 0) {
                  data.checked = "0";
                  break;
                }
              }
            }
          }
          this.treeData = getTreeData(datas,"", expandIds, selectedIds, checkedIds);
          this.$emit("loadComplete",this.treeData);
        }
      })
    },
    /** 设置icon的render函数
     * 依赖于父组件的传入的icon值，主要根据树节点的node_type来设置
     */
    renderContent(h, { root, node, data }) {
      let icon = "";
      //parent_node与child_node是定义好的，默认icon
      if(this.icons["parent_node"]  && this.icons["child_node"] ) {
        if(data.children.length > 0) {
          icon = this.icons["parent_node"]; //以上面定义的  写死key取值
        } else {
          icon = this.icons["child_node"];  //以上面定义的  写死key取值
        }
      } else {
        icon = this.icons[data.node_type];  //以node_type为key，动态取值
      }
      return h('span', {style: {display: 'inline-block',width: '95%'}}, 
        [
          h('span', [
              h('Icon', {
                  props: {type: icon}
              }),
              h('span',{
                  class:[
                    'ivu-tree-title',
                    {'ivu-tree-title-selected': data.selected}
                  ],
                  on: {
                    click: (e) => {
                      let selectArray = this.getSelectedNodes();
                      for(let selectItem of selectArray) {
                        if (selectItem.nodeKey != data.nodeKey) {
                          selectItem.selected = false;
                        }
                      }
                      if(data.selected) { //如果之前处于选中状态，再次点击，将设置为取消选中，选中的节点也设置为null传下去
                        data.selected = false;
                        this.selectChange(selectArray,null) 
                      } else {
                        data.selected = true;
                        selectArray.push(data);
                        this.selectChange(selectArray,data)
                      }
                    }
                  }
                }, data.title)
          ])
      ]);
    },
    selectChange(selectArray, selectItem) {
      this.$emit("selectChange",selectArray, selectItem);
    },
    checkChange(selectArray, selectItem) {
      this.$emit("checkChange",selectArray, selectItem);
    },
    /** 获取被勾选的节点 */
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    /** 获取被选中的节点 */
    getSelectedNodes() {
      return this.$refs.tree.getSelectedNodes();
    },
    /** 获取选中及半选节点 */
    getCheckedAndIndeterminateNodes() {
      return this.$refs.tree.getCheckedAndIndeterminateNodes();
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.loadData(this.query);
    })
  }
}
</script>

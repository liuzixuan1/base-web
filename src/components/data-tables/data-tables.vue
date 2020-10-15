<template>
  <Layout>
    <Header v-if="showHeader" class="table-header">
      <slot name="table-search"></slot>
    </Header>

    <div class="table-divider"/>
    <Content class="table-content">
      <div class="table-title">
        <Row :gutter="16">
          <Col span="10" class="title">
            <div v-if="title">{{title}}</div>
          </Col>
          <Col :span="title?14:24" class="table-btn"><slot name="table-btn"></slot></Col>
        </Row>
      </div>
      
      <Table border 
        :columns="columns"
        :data="data"
        :size="size"
        :loading="loading"
        @on-selection-change="selectChange"
        @on-current-change="currentChange"
        @on-row-click="onRowClick"
        @on-row-dblclick="onRowDblclick">
      </Table>
    <Page
        :total="total"
        :page-size="query.length"
        :current="query.draw"
        :show-sizer="showSizer"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-total class="table-page"/>
    </Content>
  </Layout>
</template>

<script>
import axios from '@/libs/api.request'
export default {
  props: {
    columns: {
      type: Array,
      default: []
    },
    url: {
      type: String,
      required: true
    },
    title:{
      type:String,
      default:""
    },
    primary_key: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "small"
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    query: {
      type: Object,
      default: function() {
        return {
          draw: 1,
          length: 10,
          start: 0,
        }
      }
    },
    defaultData:{
      type:Boolean,
      default:false
    },
    filter: {
      type: Object
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      total: 0,
      data: [],
      loading: false
    }
  },
  methods: {
    /** 加载表格数据事件 */
    loadData() {
      this.loading = true;
      let table_query = this.query;
      if(this.filter) {
        table_query.jsonParam = JSON.stringify(this.filter);  //组装查询条件
      }
      axios.request({
          url: this.url,
          method: 'post',
          data: table_query
      }).then(res => {
        this.loading = false;
        if(res.data && res.data.code && res.data.code.code == 0) {
            this.data = res.data.result.data;
            this.total = res.data.result.recordsTotal;
        }
      },error => {
        this.loading = false;
      })
    },
    /** 分页改变事件 */
    changePage(page) {
      this.query.draw = page;
      this.query.start = (page-1)*this.query.length;
      this.loadData();
    },
    /** 分页长度改变事件 */
    changeSize(size){
      this.query.draw = 1;
      this.query.length = size;
      this.query.start= 0;
      this.loadData();
    },
    /** 选中表格行，取消选中触发事件，只开启多选时生效，需要$emit到父组件中去，父组件实现getSelectData方法 */
    selectChange(selection) {
      let ids = new Array();
      if(this.primary_key && selection && selection.length > 0) {
        for(let row of selection) { // item代表数组里面的元素
          let id = row[this.primary_key];
          if(id) {
            ids.push(id);
          }
        }
      } else {

      }
      this.$emit("getSelectData",ids.join(","), selection);
    },
    /** 开启 highlight-row 后有效(单选有效)， 选中行事件，需要$emit到父组件中去，父组件实现getSelectData方法 */
    currentChange(currentRow,oldCurrentRow) {
      let id = currentRow[this.primary_key];
      this.$emit("getSelectData",id, currentRow);
    },
    /** 表格单击行事件 */
    onRowClick(row,index) {
      this.$emit("onRowClick",row, index);
    },
    /** 表格双击行事件 */
    onRowDblclick(row,index) {
      this.$emit("onRowDblclick",row, index);
    }
  },
  mounted() {
    if(!this.defaultData){
      this.loadData();
    }
    
  }
}
</script>

<style lang="less">
//原则上，改变表格行 列大小使用表格的size属性，如果还不达到要求，可以改这两个样式
.ivu-table-cell {
    padding-left: 8px;
    padding-right: 8px;
}
.ivu-table th, .ivu-table td {
    height: 34px;
}
.page-layout .table-content{
  padding: 12px;
}
.table-header{
  margin-top: 5px;
  padding: 5px 0;
  border-radius: 5px;
  box-shadow:1px 1px 3px #ccc;
}
.table-divider{
  height: 8px;
}
.table-content{
  border-radius: 5px;
  box-shadow:1px 1px 3px #ccc;
}
.table-title{
  padding-bottom: 10px;
  .title{
    font-size: 18px;
    font-weight: bold;
    color: #333;
    div{
    padding-left: 15px;
    }
    div::before{
      content: ' ';
      width: 5px;
      height: 18px;
      display:inline-block;
      position: absolute;
      bottom: 4px;
      left: 10px;
      background: linear-gradient(top , rgb(5, 207, 126) 7% , rgb(45, 140, 240) 96%);
      background: -o-linear-gradient(top , rgb(5, 207, 126) 7% , rgb(45, 140, 240) 96%);
      background: -ms-linear-gradient(top , rgb(5, 207, 126) 7% , rgb(45, 140, 240) 96%);
      background: -moz-linear-gradient(top , rgb(5, 207, 126) 7% , rgb(45, 140, 240) 96%);
      background: -webkit-linear-gradient(top , rgb(5, 207, 126) 7% , rgb(45, 140, 240) 96%);
      border-radius: 2px;

    }
  }
  .table-btn{
  text-align: right;
  button{
    margin-left:5px;
  }
}
}

</style>



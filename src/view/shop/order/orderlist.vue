<!--
  Description：订单表列表页面
  Author：Gavin
  Date：2020-07-10 11:41
 -->
<template>
  <Layout style="height: 100%" class="page-layout">
    <!-- 表格自带了Layout布局 header和content -->
    <G_DataTables ref="table"
      :url="apiUrl.pageList"
      :columns="tableColumns"
      :filter="tableFilter"
      :primary_key="primary_key"
      @getSelectData="getSelectData">

      <!-- 表格搜索条件和操作按钮插槽，请利用栅格布局，查询按钮紧跟查询表单后面，功能操作按钮放row的最后面，居右显示 -->
      <span slot="table-search">
        <Row :gutter="16">
          <Col span="6">
            <Input clearable v-model="tableFilter.order_num" placeholder="订单号"/>
          </Col>
          <Col span="6">
              <Button ghost type="primary" class="table-search-btn" icon="md-search" @click="search">查询</Button>
          </Col>
          <Col span="12" class="table-btn">
            <ButtonGroup>
              <Button ghost type="primary" @click="add" icon="ios-add-circle-outline">新增</Button>
              <Button ghost type="primary" @click="update" icon="ios-create-outline">修改</Button>
              <Button ghost type="error" @click="deleteData" icon="ios-trash-outline">删除</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </span>
    </G_DataTables>

    <!-- 详情页面，新增和修改可用同页面 -->
    <Drawer :title="drawerTitle" :closable="true" v-model="isOpen" width="650" :mask-closable="false">
      <pageinfo v-if="isOpen"
        :order_id="order_id"
        @submitComplete="submitComplete"
        @cancelSubmit="cancelSubmit"/>
    </Drawer>
  </Layout>
</template>
<script>
import axios from '@/libs/api.request'
import G_DataTables from '_c/data-tables'
import pageinfo from './orderinfo.vue'
export default {
  components: {
      pageinfo,
      G_DataTables
  },
  data () {
    return {
      /** 接口地址，这里的config.serverName.xxx是具体的微服务服务名，在src/config/index.js中配置，请自行修改，改完删掉此注释 */
      apiUrl : {
          pageList : this.$config.serverName.orderServer + "order/pageList.json",
          deleteUrl : this.$config.serverName.orderServer + "order/delete.json"
      },
      drawerTitle: "新增",
      isOpen : false,   //控制是否显示详情页面
      primary_key: "order_id",
      order_id: "", //传入到详情页面的主键id
      tableSelectIds: "",  //表格选中的数据 主键串
      tableFilter: {  //表格过滤条件
         order_num: "",
      },
      tableColumns: [ //表格列
        {type: 'selection', width: 50, align: 'center'},
        {title: '商品主键', key: 'goods_id'},
        {title: '订单号', key: 'order_num'},
        {title: '此次订单价格，这里只简单的整形定义', key: 'order_price'},
        {title: '创建时间', key: 'create_time'},
        {title: '最后修改时间', key: 'update_time'},
      ]
    }
  },
  methods : {
    /** 表格查询事件 */
    search(){
      this.$refs.table.changePage(1);
      this.tableSelectIds = ""  //刷新后重置选中行数据
    },
    /** 表格行数据勾选或取消触发事件 */
    getSelectData(ids,rows) {
      this.tableSelectIds = ids;
    },
    /** 新增按钮事件 */
    add() {
      this.order_id = "";
      this.isOpen = true;
    },
    /** 修改事件 */
    update() {
      this.$Notice.destroy();
      const ids = this.tableSelectIds;
      if(ids == "") {
          this.$Notice.warning({title: "请选择要操作的数据"});
          return;
      }
      if(ids.indexOf(",") > 0) {
          this.$Notice.warning({title: "每次只能修改一条数据"});
          return;
      }
      this.drawerTitle = "修改";
      this.order_id = this.tableSelectIds;
      this.isOpen = true;
    },
    /** 新增或修改提交完成后回调事件，入参为新增接口回传的参数 可刷新列表，关闭抽屉，刷新树... */
    submitComplete(data) {
      this.search();  //刷新列表
      this.isOpen = false;  //关闭抽屉
    },
    /** 关闭抽屉 */
    cancelSubmit() {
      this.isOpen = false;
    },
    /** 删除方法 */
    deleteData() {
      const _this = this;
      _this.$Notice.destroy(); //全局清空提示信息
      const ids = _this.tableSelectIds;
      if(ids == "") {
        _this.$Notice.warning({title: "请选择要操作的数据"});
        return;
      }
      _this.$Modal.confirm({
        title: "确定要删除数据？",
        onOk() {
          axios.request({
            url: _this.apiUrl.deleteUrl,
            method: 'get',
            toast: true,    //默认为false，如果需要开启请求成功提醒，设置为true
            params: {order_id: ids}
          }).then(res => {
            if(res.data && res.data.code.code == 0) { //操作成功
              _this.search();
            }
          });
        }
      });
    }
  }
}
</script>
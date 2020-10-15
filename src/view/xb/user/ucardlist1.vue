<!--
  Description：hellworld列表页面
  Author：zyh
  Date：2020-09-19 12:16
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
          
            <Input clearable v-model="tableFilter.card_name" placeholder="名称"/>
          </Col>
            <Col span="6">
              <Button ghost type="primary" class="table-search-btn" icon="md-search" @click="search">查询</Button>
            </Col>
          </Row>
      </span>
    </G_DataTables>


  </Layout>
</template>
<script>
import axios from '@/libs/api.request'
import G_DataTables from '_c/data-tables'
export default {
  components: {
      G_DataTables
  },
  data () {
    return {
      /** 接口地址，这里的config.serverName.xxx是具体的微服务服务名，在src/config/index.js中配置，请自行修改，改完删掉此注释 */
      apiUrl : {
          pageList :  "ucard/pageList.json",
      },
      primary_key: "card_id",
      tableFilter: {  //表格过滤条件
        card_no:localStorage.getItem('user_id')
      },
      tableColumns: [ //表格列
        {title: '卡片名称', key: 'card_name'},
        {title: '卡片类型', key: 'card_type'},
        {title: '截标日期', key: 'end_time'},
        {title: '实付款项', key: 'pay_price'},
        {title: '付款日期', key: 'pay_time'},
        {title: '发货日期', key: 'send_time'},
        {title: '结算比例', key: 'settlement_ratio',},
        {title: '物品状态', key: 'status'},
        {title: '备注', key: 'comments'},
      ]
    }
  },
  methods : {
    /** 表格查询事件 */
    search(){
      this.$refs.table.changePage(1);
    },
  }
}
</script>
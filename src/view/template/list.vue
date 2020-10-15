<template>
  <Layout style="height: 100%" class="page-layout">
    <!-- 表格自带了Layout布局 -->
    <G_DataTables ref="table"
      :url="apiUrl.pageList"
      :columns="tableColumns"
      :filter="tableFilter"
      :primary_key="primary_key"
      @getSelectData="getSelectData">

      <!-- 表格搜索条件和操作按钮插槽，请利用栅格布局，查询按钮紧跟查询表单后面，功能操作按钮放row的最后面，居右显示 -->
      <span slot="table-search">
        <Row :gutter="16">
          <Col span="14">
            <Input clearable v-model="tableFilter.name" placeholder="请输入名称"/>
          </Col>
          <Col span="2">
            <Button ghost type="primary" class="table-search-btn" icon="md-search" @click="search">查询</Button>
          </Col>
          <Col span="8" class="table-btn">
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
        :client_id="client_id"
        @submitComplete="submitComplete"
        @cancelSubmit="cancelSubmit"/>
    </Drawer>
  </Layout>
</template>
<script>
import config from '@/config'
import axios from '@/libs/api.request'
import G_DataTables from '_c/data-tables'
import pageinfo from './info.vue'
export default {
  components: {
      pageinfo,
      G_DataTables
  },
  data () {
    return {
      apiUrl : {
        pageList : this.$config.serverName.xxx + "goods/pageList.json",
        deleteUrl : this.$config.serverName.xxx + "goods/delete.json"
      },
      isOpen : false,
      primary_key: "client_id",
      client_id: "", 
      drawerTitle: "",
      isOpen: false,
      tableSelectIds: "",
      tableFilter: {
        name: ''
      },
      tableColumns: [
        {type: 'selection', width: 50, align: 'center'},
        {title: '名称', key: 'name'}
      ]
    }
  },
  methods : {
    /** 表格查询事件 */
    search(){},
    /** 表格行数据勾选或取消触发事件 */
    getSelectData(ids,rows) {},
    /** 新增事件 */
    add() {},
    /** 修改事件 */
    update() {},
    /** 新增或修改提交完成后回调事件，入参为新增接口回传的参数 可刷新列表，关闭抽屉，刷新树... */
    submitComplete(data) {},
    /** 关闭抽屉 */
    cancelSubmit() {},    
    /** 删除方法 */
    deleteData() {}
  }
}
</script>

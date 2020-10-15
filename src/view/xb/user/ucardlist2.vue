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
            <Col span="12" class="table-btn">
              <ButtonGroup>
                <Button ghost type="primary" @click="modal5 = true" icon="ios-trash-outline">提交</Button>
                
              </ButtonGroup>
            </Col>
          </Row>
      </span>
    </G_DataTables>
    <Modal
        v-model="modal5"
        title="提交确认"
        width="300"
        :loading="loading"
        @on-ok="deleteData"
        >
        <p>成交价总额：{{price}}</p>
        <p>结算总额：{{endPrice}}</p>
        <p>手续费：{{poundage}}</p>       
    </Modal>

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

      modal5:false,
      modal_loading:false,
      /** 接口地址，这里的config.servuerName.xxx是具体的微服务服务名，在src/config/index.js中配置，请自行修改，改完删掉此注释 */
      apiUrl : {
          pageList : "ucard/pageList.json",
          submitUrl : "ucard/updates.json"
      },
      price:"",//成交价总额
      endPrice:"",//结算总额
      poundage:"",//手续费
      drawerTitle: "新增",
      isOpen : false,   //控制是否显示详情页面
      primary_key: "card_id",
      card_id: "", //传入到详情页面的主键id
      status:"",
      tableSelectIds: "",  //表格选中的数据 主键串
      tableFilter: {  //表格过滤条件
        status:"待结算",
        card_no:localStorage.getItem('user_id')
      },
      tableColumns: [ //表格列
        {type: 'selection', width: 50, align: 'center'},
        {title: '卡片类型', key: 'card_type'},
        {title: '卡片名称', key: 'card_name'},
        {title: '成交金额', key: 'pay_price'},
        {title: '结算金额', key: 'settlement_price',render:(h,{row,column,index}) => {
           const price = row.pay_price * (1-row.settlement_ratio);
           return h('span',price)
          }
        },
        {title: '发货日期', key: 'send_time'},
        {title: '结算比例', key: 'settlement_ratio'},
        {title: '物品状态', key: 'status'},
        {title: '备注', key: 'comments'},
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
      let sum = 0;
      let sum1 = 0;
      rows.forEach((item) => {
        sum += item.pay_price;
        sum1 += item.pay_price * (1-item.settlement_ratio);
      });
      this.price = sum;
      this.endPrice = sum1;
      this.poundage = this.price - this.endPrice
    },

    /** 新增或修改提交完成后回调事件，入参为新增接口回传的参数 可刷新列表，关闭抽屉，刷新树... */
    submitComplete(data) {
      this.search();  //刷新列表
      this.isOpen = false;  //关闭抽屉
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
        title: "确定要提交数据？",
        onOk() {
          axios.request({
            url: _this.apiUrl.submitUrl,
            method: 'get',
            toast: true,    //默认为false，如果需要开启请求成功提醒，设置为true
            params: {card_id: ids}
          }).then(res => {
            if(res.data && res.data.code.code == 0) { //操作成功
              _this.search();
            this.$Message.success('提交成功'); 
            }
          });
        }
      });
    }
  }
}
</script>
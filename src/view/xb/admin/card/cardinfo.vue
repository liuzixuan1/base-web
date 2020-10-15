<!--
  Description：hellworld详情页面
  Author：zyh
  Date：2020-09-15 21:51
  注意：布局规则请参考iview的栅格布局，所有的表单UI 校验规则 都可参考iview官方文档  https://www.iviewui.com
 -->
<template>
  <Form ref="formRef" :model="formData" :rules="ruleValidate">
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="card_name" label="卡片名称" label-position="top">
            <Input v-model="formData.card_name" placeholder="请输入卡片名称" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="card_no" label="卡片编号" label-position="top">
            <Input v-model="formData.card_no" placeholder="请输入卡片编号" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="card_type" label="卡片类型" label-position="top">
          <Select  placeholder="请选择卡片类型" v-model="formData.card_type" >
            <Option v-for="item in card_type_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="end_time" label="截标日期" label-position="top">
            <DatePicker style="width:260px" v-model="formData.end_time" format="yyyy/MM/dd" type="date" placeholder="请选择"/>            
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="end_price" label="成交价" label-position="top">
            <Input v-model="formData.end_price" placeholder="请输入成交价" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="pay_price" label="实付款项" label-position="top">
            <Input v-model="formData.pay_price" placeholder="请输入实付款项" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="buyer_id" label="买家ID" label-position="top">
            <Input v-model="formData.buyer_id" placeholder="请输入买家ID" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="pay_time" label="付款日期" label-position="top">
            <DatePicker style="width:260px" v-model="formData.pay_time" format="yyyy/MM/dd" type="date" placeholder="请选择"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="send_time" label="发货日期" label-position="top">
            <DatePicker style="width:260px" v-model="formData.send_time" format="yyyy/MM/dd" type="date" placeholder="请选择"></DatePicker>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="waybill_number" label="运单号" label-position="top">
            <Input v-model="formData.waybill_number" placeholder="请输入运单号" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="settlement_ratio" label="结算比例" label-position="top">
            <Input v-model="formData.settlement_ratio" placeholder="请输入结算比例" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="status" label="物品状态" label-position="top">
          <Select  placeholder="物品状态" v-model="formData.status" >
            <Option v-for="item in status_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
 
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="comments" label="备注" label-position="top">
            <Input v-model="formData.comments" placeholder="请输入备注" />
        </FormItem>
      </Col>
    </Row>
    <FormItem >
        <Button type="primary" icon="md-done-all" @click="handleSubmit">提交</Button>
        <Button icon="md-backspace" @click="cancelSubmit" style="margin-left: 8px">取消</Button>
    </FormItem>
  </Form>
</template>

<script>
import axios from '@/libs/api.request'
export default {
  props: {
    card_id: {type: String,default: ""}
  },
  data () {
    return {
      /** 接口地址，这里的config.serverName.xxx是具体的微服务服务名，在src/config/index.js中配置，请自行修改，改完删掉此注释 */
      apiUrl : {
        insertUrl :  "card/insert.json",
        updateUrl :  "card/update.json",
        submitUrl : "", //提交url，通过具体的操作来决定其值
        getUrl :  "card/get.json",
      },
      /** 表单数据对象，和后台接收接收对象属性对应 */
      formData: {
        card_name: '',
        card_no: '',
        card_type: '',
        end_time: '',
        end_price: '',
        pay_price: '',
        buyer_id: '',
        pay_time: '',
        send_time: '',
        waybill_number: '',
        settlement_ratio: '',
        status: '',
        comments: '',
      },
       status_list: [
        {
          value: '未付款',
          label: '未付款'
                    },
        {
          value: '已付款',
          label: '已付款'
                    },
        {
          value: '待结算',
          label: '待结算'
                    },
        {
          value: '已结算',
          label: '已结算'
                    },
        {
          value: '卡主顶回',
          label: '卡主顶回'
                    },
        {
          value: '取消或其他',
          label: '取消或其他'
                    },
      ],
      card_type_list: [
        {
          value: '非评级卡',
          label: '非评级卡'
                    },
        {
          value: '评级卡（含原封贴）',
          label: '评级卡（含原封贴）'
                    },
        {
          value: '其他类型',
          label: '其他类型'
                    },
      ],

      /** 校验规则 */
      ruleValidate: {
        card_name: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
        card_no: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
        card_type: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
        status: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
      },
      }
  },  
  
  methods : {
    /** 提交 */
    handleSubmit() {
      this.$refs["formRef"].validate((valid) => {
        if(valid) {
          axios.request({
            url: this.apiUrl.submitUrl,
            method: 'post',
            toast: true,    //默认为false，如果需要开启请求成功提醒，设置为true
            data: this.formData
          }).then(res => {
            if(res.data && res.data.code.code == 0) { //操作成功，通知父组件
              this.$emit("submitComplete",res.data);
            }
          });
        }
      })
    },
    /** 取消 关闭 */
    cancelSubmit() {
      this.$emit("cancelSubmit");
    },
    /** 获取数据 */
    get(id) {
      return axios.request({
        url: this.apiUrl.getUrl,
        method: 'get',
        params: {card_id: id}
      })
    },
  },
  /** 页面初始化后钩子函数 */
  mounted() {
    if(this.card_id != "") { //修改
      this.apiUrl.submitUrl = this.apiUrl.updateUrl;
      this.get(this.card_id).then(res => {
        this.formData = res.data.result;
      });
    } else {  //如果传入的id为空，则认为是新增操作
      this.apiUrl.submitUrl = this.apiUrl.insertUrl;
    }
  }
}
</script>
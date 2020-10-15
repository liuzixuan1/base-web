<!--
  Description：商品表详情页面
  Author：Gavin
  Date：2020-07-10 11:42
  注意：布局规则请参考iview的栅格布局，所有的表单UI 校验规则 都可参考iview官方文档  https://www.iviewui.com
 -->
<template>
  <Form ref="formRef" :model="formData" :rules="ruleValidate">
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="user_id" label="用户编号" label-position="top">
            <Input v-model="formData.user_id" placeholder="请输入用户编号" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="username" label="用户名称" label-position="top">
            <Input v-model="formData.username" placeholder="请输入用户名称" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="password" label="密码" label-position="top">
            <Input v-model="formData.password" placeholder="请输入密码" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="real_name" label="真实姓名" label-position="top">
            <Input v-model="formData.real_name" placeholder="请输入真实姓名" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="cellphone" label="手机号" label-position="top">
            <Input v-model="formData.cellphone" placeholder="请输入手机号" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="pay_account" label="支付账户" label-position="top">
            <Input v-model="formData.pay_account" placeholder="请输入支付账户" />
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
    user_id: {type: String,default: ""}
  },
  data () {
    return {
      /** 接口地址，这里的config.serverName.xxx是具体的微服务服务名，在src/config/index.js中配置，请自行修改，改完删掉此注释 */
      apiUrl : {
        insertUrl :"user/insert.json",
        updateUrl :"user/update.json",
        submitUrl : "", //提交url，通过具体的操作来决定其值
        getUrl : "user/get.json",
      },
      /** 表单数据对象，和后台接收接收对象属性对应 */
      formData: {
        user_id: '',
        username : '',
        password: '',
        real_name: '',
        cellphone: '',
        pay_account: '',
      },
      /** 校验规则 */
      ruleValidate: {
        user_id: [{ required: true, message: '用户编号不能为空！', trigger: 'blur' }],
        username: [{ required: true, message: '用户名不能为空！', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空！', trigger: 'blur' }],

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
            } else if(res.data && res.data.code.code == "0-006") {
              this.$Message.error('用户已存在')
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
        params: {user_id: id}
      })
    },
  },
  /** 页面初始化后钩子函数 */
  mounted() {
    if(this.user_id != "") { //修改
      this.apiUrl.submitUrl = this.apiUrl.updateUrl;
      this.get(this.user_id).then(res => {
        this.formData = res.data.result;
      });
    } else {  //如果传入的id为空，则认为是新增操作
      this.apiUrl.submitUrl = this.apiUrl.insertUrl;
    }
  }
}
</script>
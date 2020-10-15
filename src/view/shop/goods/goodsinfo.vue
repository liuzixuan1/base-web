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
        <FormItem prop="goods_name" label="商品名称" label-position="top">
            <Input v-model="formData.goods_name" placeholder="请输入商品名称" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="price" label="价格，这里价格以简单的整形定义" label-position="top">
            <Input v-model="formData.price" placeholder="请输入价格，这里价格以简单的整形定义" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="flag" label="是否上架标志" label-position="top">
            <Input v-model="formData.flag" placeholder="请输入是否上架标志" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="brand" label="品牌" label-position="top">
            <Input v-model="formData.brand" placeholder="请输入品牌" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="goods_desc" label="商品描述" label-position="top">
            <Input v-model="formData.goods_desc" placeholder="请输入商品描述" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="create_time" label="创建时间" label-position="top">
            <Input v-model="formData.create_time" placeholder="请输入创建时间" />
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
    goods_id: {type: String,default: ""}
  },
  data () {
    return {
      /** 接口地址，这里的config.serverName.xxx是具体的微服务服务名，在src/config/index.js中配置，请自行修改，改完删掉此注释 */
      apiUrl : {
        insertUrl : this.$config.serverName.goodsServer + "goods/insert.json",
        updateUrl : this.$config.serverName.goodsServer + "goods/update.json",
        submitUrl : "", //提交url，通过具体的操作来决定其值
        getUrl : this.$config.serverName.goodsServer + "goods/get.json",
      },
      /** 表单数据对象，和后台接收接收对象属性对应 */
      formData: {
        goods_name: '',
        price: '',
        flag: '',
        brand: '',
        goods_desc: '',
        create_time: '',
      },
      /** 校验规则 */
      ruleValidate: {
        //name: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
      }
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
        params: {goods_id: id}
      })
    },
  },
  /** 页面初始化后钩子函数 */
  mounted() {
    if(this.goods_id != "") { //修改
      this.apiUrl.submitUrl = this.apiUrl.updateUrl;
      this.get(this.goods_id).then(res => {
        this.formData = res.data.result;
      });
    } else {  //如果传入的id为空，则认为是新增操作
      this.apiUrl.submitUrl = this.apiUrl.insertUrl;
    }
  }
}
</script>
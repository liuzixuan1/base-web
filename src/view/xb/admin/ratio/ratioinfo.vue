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
        <FormItem prop="company_name" label="企业名称" label-position="top">
            <Input v-model="formData.company_name" placeholder="请输入企业名称" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="company_code" label="统一社会信用代码" label-position="top">
            <Input v-model="formData.company_code" placeholder="请输入统一社会信用代码" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="company_type" label="企业类型" label-position="top">
           <Select v-model="formData.company_type" >
            <Option v-for="item in company_type_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
           </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="city_code" label="所属地市代码" label-position="top">
          <Select v-model="formData.city_code" >
            <Option v-for="item in city_code_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="create_time" label="创建时间" label-position="top">
            <Input v-model="formData.create_time" placeholder="请输入创建时间" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="update_time" label="修改时间" label-position="top">
            <Input v-model="formData.update_time" placeholder="请输入修改时间" />
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
    company_id: {type: String,default: ""}
  },
  data () {
    return {
      /** 接口地址，这里的config.serverName.xxx是具体的微服务服务名，在src/config/index.js中配置，请自行修改，改完删掉此注释 */
      apiUrl : {
        insertUrl :"company/insert.json",
        updateUrl :"company/update.json",
        submitUrl : "", //提交url，通过具体的操作来决定其值
        getUrl : "company/get.json",
      },
      /** 表单数据对象，和后台接收接收对象属性对应 */
      formData: {
        company_name : '',
        company_code: '',
        company_type: '',
        city_code: '',
        create_time: '',
        update_time: '',
      },
      /** 校验规则 */
      ruleValidate: {
        //name: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
      },
      company_type_list: [
                    {
                        value: '1',
                        label: '客运'
                    },
                    {
                        value: '2',
                        label: '货运'
                    },
 
                ],
      city_code_list: [
                    {
                        value: '430100',
                        label: '长沙市'
                    },
                    {
                        value: '430200',
                        label: '株洲市'
                    },
                    {
                        value: '430300',
                        label: '湘潭市'
                    },
                    {
                        value: '430400',
                        label: '衡阳市'
                    },
                    {
                        value: '430500',
                        label: '邵阳市'
                    },
                    {
                        value: '430600',
                        label: '岳阳市'
                    },
                    {
                        value: '430700',
                        label: '常德市'
                    },
                    {
                        value: '430800',
                        label: '张家界市'
                    },
                    {
                        value: '430900',
                        label: '益阳市'
                    },
                    {
                        value: '431000',
                        label: '郴州市'
                    },
                    {
                        value: '431100',
                        label: '永州市'
                    },
                    {
                        value: '431200',
                        label: '怀化市'
                    },
                    {
                        value: '431300',
                        label: '娄底市'
                    },
                    {
                        value: '431400',
                        label: '湘西州'
                    },
                ],           
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
        params: {company_id: id}
      })
    },
  },
  /** 页面初始化后钩子函数 */
  mounted() {
    if(this.company_id != "") { //修改
      this.apiUrl.submitUrl = this.apiUrl.updateUrl;
      this.get(this.company_id).then(res => {
        this.formData = res.data.result;
      });
    } else {  //如果传入的id为空，则认为是新增操作
      this.apiUrl.submitUrl = this.apiUrl.insertUrl;
    }
  }
}
</script>
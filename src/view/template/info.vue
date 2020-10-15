<template>
  <Form ref="formRef" :model="formData" :rules="ruleValidate">
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="client_name" label="名称" label-position="right">
            <Input v-model="formData.client_name" placeholder="请输入名称" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="client_secret" label="秘钥" label-position="right">
            <Input :disabled="cliendPassword" type="password" v-model="formData.client_secret" placeholder="请输入秘钥" />
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
import config from '@/config'
import axios from '@/libs/api.request'
export default {
  props: {
    client_id: {type: String,default: ""}
  },
  data () {
    return {
      apiUrl : {
        insertUrl : "",
        updateUrl : "",
        submitUrl : "", //提交url，通过具体的操作来决定其值
        getUrl : "",
      },
      cliendPassword : true,
      /** 表单数据对象，和后台接收接收对象属性对应 */
      formData: {
        client_name: '',
        client_secret: ''       
      },
      /** 校验规则 */
      ruleValidate: { 
        client_name:[{ required: true, message: '名称不能为空！', trigger: 'blur' }],
        client_secret: [{ required: true, message: '密钥不能为空', trigger: 'blur' }]        
      }
    }
  },
  methods : {
    /** 提交 */
    handleSubmit() {     
      this.$refs["formRef"].validate((valid) => {
        if(valid) {
          //todo 提交          
        }
      })
    },
    /** 取消 关闭 */
    cancelSubmit() {
      this.$emit("cancelSubmit");
    },
    /** 获取数据 */
    get(id) {      
    }
  },
  /** 页面初始化后钩子函数 */
  mounted() {
    if(this.client_id != "") {
      //修改     
    } else {
      //新增     
    }
  }
}
</script>
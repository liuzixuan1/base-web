<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input size="large"  v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input size="large"  type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long ghost :loading="loading">
        <span v-if="!loading">登    录</span>
        <span v-else>登录中，请稍后...</span>
      </Button>
    </FormItem>
  </Form>
</template>
<script>
import axios from '@/libs/api.request'
import Cookies from 'js-cookie';
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      apiUrl : {
          loginUrl : "user/login.json",

      },      
      loading: false,
      form: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      // this.$refs.loginForm.validate((valid) => {
      //   if (valid) {
          axios.request({
            url: "http://118.31.246.22:8081/user/loginA.json",
            method:'get',
            toast: true,
            params: {username:this.form.username,password:this.form.password}
          }).then(res => {
            
            if(res.data && res.data.code.code == 0) {
            localStorage.removeItem('tagNaveList');
            localStorage.setItem('user_id',res.data.result.user_id);
            localStorage.setItem('username',res.data.result.username);
            if(this.form.username === 'super_admin'){
            Cookies.set('access', '0');             
            } else {
            Cookies.set('access', '1');
            };
            this.$router.push({
            path:"/home",
            name:"home",
            params: {
              user_id:res.data.result.user_id
            },
            
          });
            this.$emit('on-success-valid', {
            username: this.form.username,
            password: this.form.password
          })
            } else if(res.data && res.data.code.code == "0-003" ){
              this.$Message.error('用户不存在')
            } else if(res.data.code.code == "0-001") {
              this.$Message.error('用户名或密码错误')
            } else {
              this.$Message.error('未知错误')
            }
          })

        }
      
    },
    clearLoading() {
      this.loading = false;
    }
  }

</script>

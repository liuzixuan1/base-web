<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="md-log-in" title="欢迎登录" :bordered="false" style="width:360px;">
        <div class="form-con">
          <login-form ref="login_form" @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        if(res.data.code.code === "0") {
           if(res.data.result.redirect_uri != null && res.data.result.redirect_uri != ""){
           window.location.href = res.data.result.redirect_uri;
        } else {
            this.getUserInfo().then(res => {
            if(res.data.code.code === "0") {
                  this.$router.push({
                  name: this.$config.homeName
                })
            } else {
                  this.$refs.login_form.clearLoading();
            }
            }).catch(err => {
                  this.$refs.login_form.clearLoading();
            })
          }
        } else {
          this.$refs.login_form.clearLoading();
        }
      }).catch(err => {
        this.$refs.login_form.clearLoading();
      })
    }
  }
}
</script>

<style>

</style>

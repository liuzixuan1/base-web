<template>
  <div style="font-size:50px">
    小饼发货平台
    <p>{{accesscode}}</p>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'home',
  components: {

  },
  data () {
    return {
      accesscode: parseInt(Cookies.get('access')),

}
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>

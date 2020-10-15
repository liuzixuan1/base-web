import { on } from '@/libs/tools'
export default {
  inserted: function (el, binding, vnode) {
    // 获取按钮权限
    let meta = vnode.context.$route.meta;
    if(!meta.isDevStaticMenu ) {
      if(meta.permissions.indexOf(binding.value)==-1){
        el.parentNode.removeChild(el);
      }
    }
  },
  update: (el, binding) => {    
  },
  unbind: (el, binding) => {    
  }
}

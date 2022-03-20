<template>
  <div class="menu-content">
    <div v-for="v in icons" :key="v.key" class="menu-icon">
      <span>{{ v.title }}:</span>
      <ul class="icon-list">
        <li v-for="(icon, key) in v.icons" :key="key" @click="chooseIcon(icon)">
          <a-icon :type="icon" :style="{ fontSize: '36px' }" />
          <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" v-show="icon === logo" class="choose"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import icons from '@/components/IconSelector/icons.js'
export default {
  props: {
    cb: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      icons,
      logo: ''
    }
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        this.cb(this.logo)
        resolve(true)
      })
    },
    chooseIcon (val) {
      this.logo = val
    }
  }
}
</script>

<style scoped lang="less">
.menu-content{
  height: 300px;
  overflow-y:scroll ;
  .menu-icon{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .icon-list{
      display: flex;
      width: 80%;
      flex-wrap: wrap;
      cursor: pointer;
      li{
        margin: 4px;
        position: relative
      }
      .choose{
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>

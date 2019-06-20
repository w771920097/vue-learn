<template>
  <theme-provider id='app' :theme='theme'>
    <i :is='layout'>
      <keep-alive>
        <router-view v-if='$route.meta.keepAlive' />
      </keep-alive>
      <router-view v-if='!$route.meta.keepAlive' />
    </i>
  </theme-provider>
</template>
<script>
import _ from 'lodash'
import SimpleWrapper from './cell/simple-wrapper'
import ThemeProvider from '../ThemeProvider'
export default {
  name: 'App',
  components: {
    SimpleWrapper,
    ThemeProvider,
  },
  data() {
    return {
      theme: 'default',
    }
  },
  computed: {
    currentPath() {
      return this.$route.path
    },
    layout() {
      const { $options: { components }} = this // 已经注册到app的layout组件
      const { meta, matched: [firstMatch] } = this.$route // route携带的显示信息
      const { layoutVisible = true } = meta // route携带的显示信息
      const env = 'normal' // 项目环境
      const [nouse, path] = this.currentPath.split('/') //eslint-disable-line
      const layoutName = `${this.formatName(path)}-layout`
      const defaultLayout = 'simple-wrapper'
      const isLayoutNotExits = _.findIndex(Object.keys(components), (key) => this.formatName(components[key].name) === layoutName) === -1 && !(firstMatch && firstMatch.meta.layout)
      if (env === 'normal') {
        if (isLayoutNotExits || !path || path === 'login' || path === 'menu' || path === 'outer' || !layoutVisible) {
          return defaultLayout
        } else {
          return firstMatch ? firstMatch.meta.layout : layoutName
        }
      }
    },
  },
  mounted() {
    // setTimeout(() => {
    //   this.theme = 'test'
    // }, 5000)
  },
  methods: {
    formatName(name) {
      const firstIndex = 0
      const deleteCount = 1
      const str = name.replace(/([A-Z])/g, '-$1').toLowerCase()
      return str.indexOf('-') === firstIndex ? str.substr(deleteCount) : str
    },
  },
}
</script>
<style lang="scss">
:global {
  html,
  body {
    height: 100%;
    overflow-y: hidden;
    overflow-x: auto;
  }
  #app {
    height: 100%;
    overflow-x: auto;
  }
  body {
    margin: 0;
    // font-size: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "avenir next", avenir,
      helvetica, "helvetica neue", Ubuntu, "segoe ui", arial, sans-serif;
  }
  .page {
    text-align: center;
  }
  code {
    background-color: #f0f0f0;
    padding: 3px 5px;
    border-radius: 2px;
  }
}
</style>
<template>
  <div class='theme-wrapper' :style='`--theme:${theme};`' v-show='themeLoaded'>
    <slot />
  </div>
</template>

<script>
import './theme/theme.scss'
export default {
  name: 'ThemeProvider',
  props: {
    theme: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      themeLoaded: false,
    }
  },
  watch: {
    theme(t) {
      import(`./theme/${t}.less`)
        .then(() => {
          document.body.className = `theme-${t}`
        })
    },
  },
  created() {
    import(`./theme/${this.theme}.less`)
      .then(() => {
        this.themeLoaded = true
        document.body.className = `theme-${this.theme}`
      })
  },
}
</script>

<style lang="scss" scoped>
.theme-wrapper{
  width: 100%;
  height: 100%;
  background: var(--primary-color);
}
</style>

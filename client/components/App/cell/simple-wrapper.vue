<template>
  <div class='cell simple-wrapper'>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SimpleWrapper',
}
</script>

<style lang="scss" scoped>
.simple-wrapper{
  width: 100%;
  height: 100%;
}
</style>


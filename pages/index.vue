<script>
import fetch from '~/utils/fetch'

export default {
  data () {
    return {
      data: null,
      pending: true,
    }
  },

  async mounted () {
    this.data = await fetch('/api/hello-world')
    this.pending = false
  },
}
</script>

<template>
  <article>
    <p v-if="data?.data && data.result">{{ data.data }}</p>
    <p v-else-if="pending">loaded..</p>
    <p v-else>Not loading</p>
  </article>
</template>

<style scoped>
</style>

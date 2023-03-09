<script setup>
const app = useAppConfig()

const { pending, data } = await useLazyAsyncData('content', async () => $fetch(app.api.hello_world))
</script>

<template>
  <article class="hello">
    <h1>{{ app.name }}</h1>
    <p v-if="pending">Loading...</p>
    <p v-else-if="data?.content">{{ data.content }}</p>
    <p v-else>Not loading</p>
  </article>
  <footer class="hello hello__footer">ver {{ app.version }}</footer>
</template>

<style scoped>
.hello {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 3rem;
  margin: 10rem;
  padding: 0;
}
.hello__footer{
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0;
}
</style>

<script setup>
import MainMenu from '../components/MainMenu'

const app = useAppConfig()
</script>

<template>
  <header class="hello-header">
   <MainMenu />
  </header>
  <main class="hello-main">
    <h1>{{ app?.name }}</h1>
    <slot/>
  </main>
  <footer class="hello hello__footer">ver {{ app?.version }} | Contact: <NuxtLink to="/user/admin">admin</NuxtLink></footer>
</template>

<style scoped>
.hello-header {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  margin: 2rem 10rem;
  padding: 0;
}

.hello-main {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 3rem;
  margin: 6rem 10rem;
  padding: 0;
}

.hello__footer {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0 10rem;
  padding: 0;
  font-size: 1rem;
}
</style>

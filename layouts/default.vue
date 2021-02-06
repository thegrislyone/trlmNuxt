<template>
  <div class="page">

    <Header />

    <main class="content wrapper">
      <transition name="fader" mode="out-in">
        <Nuxt />
      </transition>
    </main>

    <!-- <Footer /> -->

    <Footer />

  </div>
</template>

<style>
</style>

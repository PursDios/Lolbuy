<template>
  <div class="min-h-screen relative">
    <!-- Background orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>

    <!-- Scan line -->
    <div class="scan-line"></div>

    <!-- Grid background -->
    <div class="fixed inset-0 grid-bg pointer-events-none z-0 opacity-40"></div>

    <Navbar />

    <main class="relative z-10 pt-16">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Global dark-pattern components -->
    <CookieBanner />
    <FakeNotification />
    <ExitIntentModal />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import CookieBanner from './components/CookieBanner.vue'
import FakeNotification from './components/FakeNotification.vue'
import ExitIntentModal from './components/ExitIntentModal.vue'
</script>

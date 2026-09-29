<!-- src/App.vue -->
<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import Connexion from './components/Connexion.vue'
import Mine from './components/Mine.vue'

const store = useStore()

onMounted(() => {
  store.dispatch('mine/demarrerProductionAuto')
})
</script>

<template>
  <Connexion v-if="!store.getters['utilisateurs/estConnecte']" />
  <Mine v-else />
</template>
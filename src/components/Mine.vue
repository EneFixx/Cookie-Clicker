
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Classement from './Classement.vue'
import AdminPanel from './AdminPanel.vue'

const store = useStore()
const stats = computed(() => store.getters['mine/statistiques'])
</script>

<template>
  <div>
    <h1>Mine Clicker</h1>
    <p>
      Connecté en tant que <strong>{{ store.state.utilisateurs.utilisateurCourant }}</strong>
      <span v-if="store.getters['utilisateurs/estAdmin']"> (admin)</span>
      <button @click="store.dispatch('utilisateurs/deconnecter')">Déconnexion</button>
    </p>
<p>Émeraudes : {{ Math.floor(store.state.mine.emeraudes) }}</p>
<p>Production : {{ store.getters['mine/emeraudesParSeconde'].toFixed(1) }} / seconde</p>
    <p>Multiplicateur : x{{ store.getters['mine/multiplicateur'] }}</p>

    <button @click="store.commit('mine/mineEmeraude')">
      Miner un bloc (+{{ store.getters['mine/emeraudesParClic'] }})
    </button>
    <button @click="store.dispatch('utilisateurs/sauvegarder')">Sauvegarder</button>

    <h2>Statistiques</h2>
    <ul>
      <li>Total collecté : {{ stats.totalCollecte }}</li>
      <li>Minées à la main : {{ stats.clicsManuels }}</li>
      <li>Produites automatiquement : {{ stats.emeraudesAuto }}</li>
      <li>Dépensées : {{ stats.emeraudesDepensees }}</li>
      <li>Améliorations possédées : {{ stats.nombreAmeliorations }}</li>
    </ul>

    <h2>Enchantement</h2>
    <p>
      Enchantement Fortune (niveau {{ store.state.mine.niveauFortune }}), 
      {{ store.getters['mine/coutFortune'] }} émeraudes
    </p>
    <button
      :disabled="store.state.mine.emeraudes < store.getters['mine/coutFortune']"
      @click="store.dispatch('mine/acheterFortune')"
    >
      Acheter
    </button>

    <h2>Boutique</h2>
    <div v-for="a in store.state.mine.ameliorations" :key="a.id">
      <p>
        {{ a.nom }} (x{{ a.quantite }}) —
        {{ store.getters['mine/coutAmelioration'](a.id) }} émeraudes —
        +{{ a.production }}/s
      </p>
      <button
        :disabled="store.state.mine.emeraudes < store.getters['mine/coutAmelioration'](a.id)"
        @click="store.dispatch('mine/acheter', a.id)"
      >
        Acheter
      </button>
    </div>

    <Classement />
    <AdminPanel v-if="store.getters['utilisateurs/estAdmin']" />
  </div>
</template>
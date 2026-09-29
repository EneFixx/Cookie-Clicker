
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const nouveauxScores = ref({})

function modifier(nom) {
  const valeur = Number(nouveauxScores.value[nom])
  if (Number.isNaN(valeur)) return
  store.dispatch('utilisateurs/modifierScore', { nom, nouveauScore: valeur })
}

function reinitialiserPartie() {
  if (confirm('Réinitialiser TOUTE la partie ? Toutes les sauvegardes seront perdues.')) {
    store.dispatch('utilisateurs/reinitialiserPartie')
  }
}
</script>

<template>
  <div>
    <h2>🔧 Panneau admin</h2>
    <div v-for="joueur in store.state.utilisateurs.registre" :key="joueur.nom">
      {{ joueur.nom }} — {{ joueur.score }} émeraudes collectées
      <input v-model="nouveauxScores[joueur.nom]" type="number" placeholder="Nouveau score" />
      <button @click="modifier(joueur.nom)">Modifier</button>
    </div>
    <button @click="reinitialiserPartie">Réinitialiser toute la partie</button>
  </div>
</template>
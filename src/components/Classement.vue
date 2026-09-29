
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const resultatDefi = ref('')


function defier(adversaire) {
  const monScore = Math.floor(store.state.mine.totalCollecte)
  if (monScore > adversaire.score) {
    resultatDefi.value = `Tu écrases ${adversaire.nom} : ${monScore} contre ${adversaire.score} !`
  } else if (monScore < adversaire.score) {
    resultatDefi.value = `${adversaire.nom} te devance : ${adversaire.score} contre ${monScore}. Continue de miner !`
  } else {
    resultatDefi.value = `Égalité parfaite avec ${adversaire.nom} !`
  }
}
</script>

<template>
  <div>
    <h2>Classement (émeraudes collectées)</h2>
    <ol>
      <li v-for="joueur in store.getters['utilisateurs/classement']" :key="joueur.nom">
        {{ joueur.nom }} — {{ joueur.score }} émeraudes collectées
        <span v-if="joueur.role === 'admin'"> (admin)</span>
        <button
          v-if="joueur.nom !== store.state.utilisateurs.utilisateurCourant"
          @click="defier(joueur)"
        >
          Défier
        </button>
      </li>
    </ol>
    <p v-if="resultatDefi">{{ resultatDefi }}</p>
  </div>
</template>
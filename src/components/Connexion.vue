
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const nom = ref('')
const motDePasse = ref('')
const erreur = ref('')

async function connecter() {
  const pseudo = nom.value.trim().toLowerCase()
  if (!pseudo || !motDePasse.value) {
    erreur.value = 'Pseudo et mot de passe requis.'
    return
  }
  const resultat = await store.dispatch('utilisateurs/connecter', {
    nom: pseudo,
    motDePasse: motDePasse.value
  })
  erreur.value = resultat || ''
}
</script>

<template>
  <div>
    <h1>Mine Clicker</h1>
    <p>Un pseudo inconnu crée automatiquement un nouveau compte.</p>
    <div>
      <input v-model="nom" type="text" placeholder="Pseudo" @keyup.enter="connecter" />
    </div>
    <div>
      <input v-model="motDePasse" type="password" placeholder="Mot de passe" @keyup.enter="connecter" />
    </div>
    <button @click="connecter">Jouer</button>
    <p v-if="erreur">{{ erreur }}</p>
  </div>
</template>
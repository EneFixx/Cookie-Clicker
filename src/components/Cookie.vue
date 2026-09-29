<template>
  <div>
    <p>Cookies : {{ $store.state.cookies.cookies }}</p>
    <p>Double : {{ $store.getters['cookies/doubleCookies'] }}</p>
    <button @click="$store.commit('cookies/ajouterCookie')">Ajouter un cookie</button>
    <button @click="$store.dispatch('cookies/ajouterCookieAvecDelai')">Ajouter un cookie (1s)</button>
  </div>
</template>
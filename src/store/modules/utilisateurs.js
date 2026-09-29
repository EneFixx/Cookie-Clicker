
const CLE_REGISTRE = 'cookie-clicker-registre'

function lireRegistre() {
  const brut = localStorage.getItem(CLE_REGISTRE)
  const registre = brut ? JSON.parse(brut) : []

  const admin = registre.find(u => u.nom === 'admin')
  if (!admin) {
    registre.push({ nom: 'admin', role: 'admin', motDePasse: 'admin', score: 0 })
  } else if (!admin.motDePasse) {
    admin.motDePasse = 'admin'
  }
  return registre
}

function ecrireRegistre(registre) {
  localStorage.setItem(CLE_REGISTRE, JSON.stringify(registre))
}

export default {
  namespaced: true,
  state: () => ({
    utilisateurCourant: null,
    role: null,
    registre: []
  }),
  getters: {
    estConnecte: state => state.utilisateurCourant !== null,
    estAdmin: state => state.role === 'admin',
    classement: state => [...state.registre].sort((a, b) => b.score - a.score)
  },
  mutations: {
    definirUtilisateur(state, nom) {
      state.utilisateurCourant = nom
    },
    definirRole(state, role) {
      state.role = role
    },
    definirRegistre(state, registre) {
      state.registre = registre
    }
  },
  actions: {
    connecter({ commit }, { nom, motDePasse }) {
      const registre = lireRegistre()
      let entree = registre.find(u => u.nom === nom)

      if (entree) {
        if (!entree.motDePasse) {
          entree.motDePasse = motDePasse
        } else if (entree.motDePasse !== motDePasse) {
          return 'Mot de passe incorrect.'
        }
      } else {
        entree = { nom, role: 'joueur', motDePasse, score: 0 }
        registre.push(entree)
      }

      ecrireRegistre(registre)
      commit('definirUtilisateur', nom)
      commit('definirRole', entree.role)
      commit('definirRegistre', registre)

      const sauvegarde = localStorage.getItem(`cookie-clicker-${nom}`)
      if (sauvegarde) {
        commit('mine/chargerPartie', JSON.parse(sauvegarde), { root: true })
      } else {
        commit('mine/reinitialiser', null, { root: true })
      }
      return null
    },
        sauvegarder({ state, rootState, commit }) {
        if (!state.utilisateurCourant) return

        const mine = rootState.mine
        const donnees = {
            emeraudes: mine.emeraudes,
            totalCollecte: mine.totalCollecte,
            clicsManuels: mine.clicsManuels,
            niveauFortune: mine.niveauFortune,
            ameliorations: mine.ameliorations.map(a => ({ id: a.id, quantite: a.quantite }))
        }
        localStorage.setItem(`cookie-clicker-${state.utilisateurCourant}`, JSON.stringify(donnees))

        const registre = state.registre.map(u =>
            u.nom === state.utilisateurCourant ? { ...u, score: Math.floor(donnees.totalCollecte) } : u
        )
        ecrireRegistre(registre)
        commit('definirRegistre', registre)
        },

    deconnecter({ commit, dispatch }) {
      dispatch('sauvegarder')
      commit('definirUtilisateur', null)
      commit('definirRole', null)
    },

    modifierScore({ state, commit }, { nom, nouveauScore }) {
      if (state.role !== 'admin') return

      const sauvegardeBrut = localStorage.getItem(`cookie-clicker-${nom}`)
      const sauvegarde = sauvegardeBrut ? JSON.parse(sauvegardeBrut) : {}
      sauvegarde.totalCollecte = nouveauScore
      localStorage.setItem(`cookie-clicker-${nom}`, JSON.stringify(sauvegarde))

      const registre = state.registre.map(u => (u.nom === nom ? { ...u, score: nouveauScore } : u))
      ecrireRegistre(registre)
      commit('definirRegistre', registre)

      if (nom === state.utilisateurCourant) {
        commit('mine/definirTotalCollecte', nouveauScore, { root: true })
      }
    },

    reinitialiserPartie({ state, commit }) {
      if (state.role !== 'admin') return

      state.registre.forEach(u => localStorage.removeItem(`cookie-clicker-${u.nom}`))

      const moi = state.registre.find(u => u.nom === state.utilisateurCourant)
      const nouveauRegistre = [{ ...moi, score: 0 }]
      ecrireRegistre(nouveauRegistre)
      commit('definirRegistre', nouveauRegistre)
      commit('mine/reinitialiser', null, { root: true })
    }
  }
}
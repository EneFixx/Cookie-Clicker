
const AMELIORATIONS_INITIALES = [
  { id: 'villageois', nom: 'Villageois mineur', coutBase: 10, production: 1 },
  { id: 'golem', nom: 'Golem de fer', coutBase: 100, production: 5 },
  { id: 'sorciere', nom: 'Sorcière bourrée', coutBase: 1000, production: 25 },
  { id: 'dragon', nom: 'Dragon apprivoisé', coutBase: 5000, production: 100 }
]

const COUT_BASE_FORTUNE = 500
const BONUS_PAR_NIVEAU_FORTUNE = 0.1

function ameliorationsParDefaut() {
  return AMELIORATIONS_INITIALES.map(a => ({ ...a, quantite: 0 }))
}

function multiplicateur(state) {
  return Math.round((1 + state.niveauFortune * BONUS_PAR_NIVEAU_FORTUNE) * 100) / 100
}

export default {
  namespaced: true,
  state: () => ({
    emeraudes: 0,
    totalCollecte: 0,
    clicsManuels: 0,
    autoProduction: 0,
    niveauFortune: 0,
    intervalProduction: null,
    ameliorations: ameliorationsParDefaut()
  }),
  getters: {
    multiplicateur: state => multiplicateur(state),
    emeraudesParClic: state => multiplicateur(state),
    emeraudesParSeconde: state => state.autoProduction * multiplicateur(state),
    coutAmelioration: state => id => {
      const a = state.ameliorations.find(a => a.id === id)
      return Math.floor(a.coutBase * Math.pow(1.15, a.quantite))
    },
    coutFortune: state => COUT_BASE_FORTUNE * Math.pow(5, state.niveauFortune),
    statistiques: state => ({
      totalCollecte: Math.floor(state.totalCollecte),
      clicsManuels: Math.floor(state.clicsManuels),
      emeraudesAuto: Math.floor(state.totalCollecte - state.clicsManuels),
      emeraudesDepensees: Math.floor(state.totalCollecte - state.emeraudes),
      nombreAmeliorations: state.ameliorations.reduce((total, a) => total + a.quantite, 0)
    })
  },
  mutations: {
    mineEmeraude(state) {
      const gain = multiplicateur(state)
      state.emeraudes += gain
      state.totalCollecte += gain
      state.clicsManuels += gain
    },
    tickProduction(state) {
      const gain = state.autoProduction * multiplicateur(state)
      state.emeraudes += gain
      state.totalCollecte += gain
    },
    acheterAmelioration(state, { id, cout }) {
      const a = state.ameliorations.find(a => a.id === id)
      state.emeraudes -= cout
      a.quantite++
      state.autoProduction += a.production
    },
    acheterFortune(state, cout) {
      state.emeraudes -= cout
      state.niveauFortune++
    },
    chargerPartie(state, donnees) {
      state.emeraudes = donnees.emeraudes ?? 0
      state.totalCollecte = donnees.totalCollecte ?? donnees.emeraudes ?? 0
      state.clicsManuels = donnees.clicsManuels ?? 0
      state.niveauFortune = donnees.niveauFortune ?? 0
      state.ameliorations = ameliorationsParDefaut().map(a => {
        const sauvee = (donnees.ameliorations || []).find(s => s.id === a.id)
        return { ...a, quantite: sauvee ? sauvee.quantite : 0 }
      })
      state.autoProduction = state.ameliorations.reduce((total, a) => total + a.production * a.quantite, 0)
    },
    reinitialiser(state) {
      state.emeraudes = 0
      state.totalCollecte = 0
      state.clicsManuels = 0
      state.autoProduction = 0
      state.niveauFortune = 0
      state.ameliorations = ameliorationsParDefaut()
    },
    definirTotalCollecte(state, valeur) {
      state.totalCollecte = valeur
    },
    definirIntervalProduction(state, id) {
      state.intervalProduction = id
    }
  },
  actions: {
    acheter({ commit, getters, state }, id) {
      const cout = getters.coutAmelioration(id)
      if (state.emeraudes >= cout) {
        commit('acheterAmelioration', { id, cout })
      }
    },
    acheterFortune({ commit, getters, state }) {
      const cout = getters.coutFortune
      if (state.emeraudes >= cout) {
        commit('acheterFortune', cout)
      }
    },
    demarrerProductionAuto({ commit, state }) {
      if (state.intervalProduction) return
      const id = setInterval(() => commit('tickProduction'), 1000)
      commit('definirIntervalProduction', id)
    }
  }
}
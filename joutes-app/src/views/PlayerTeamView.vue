<template>
  <div class="container">

    <h2>Créer un joueur</h2>

    <div class="form">
      <input v-model="player.lastname" placeholder="Nom" />
      <input v-model="player.firstname" placeholder="Prénom" />
      <input v-model="player.email" placeholder="Email" />
      <input v-model="player.classname" placeholder="Classe" />

      <select v-model="player.team">
        <option v-for="t in teams" :key="t" :value="t">
          {{ t }}
        </option>
      </select>

      <button @click="createPlayer">Créer joueur</button>
    </div>

    <hr />

    <h2>Inscription équipe</h2>

    <div class="form">
      <select v-model="inscription.team">
        <option v-for="t in teams" :key="t" :value="t">
          {{ t }}
        </option>
      </select>

      <select v-model="inscription.sport">
        <option v-for="s in sports" :key="s" :value="s">
          {{ s }}
        </option>
      </select>

      <button @click="createInscription">Ajouter inscription</button>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import axios from "axios"

/* --- State --- */

const player = reactive({
  lastname: "",
  firstname: "",
  email: "",
  classname: "",
  team: ""
})

const inscription = reactive({
  team: "",
  sport: ""
})

const teams = ref([])
const sports = ref([])

/* --- Charger données --- */

const loadOptions = async () => {
  try {
    const teamRes = await axios.get("/api/teams")
    const sportRes = await axios.get("/api/sports")

    teams.value = teamRes.data.map(t => t.Name)
    sports.value = sportRes.data.map(s => s.Name)

  } catch (e) {
    console.error(e)
  }
}

/* --- API actions --- */

const createPlayer = async () => {
  try {
    await axios.post("/api/players", player)
    alert("Joueur créé")
  } catch (e) {
    alert("Erreur création joueur")
  }
}

const createInscription = async () => {
  try {
    await axios.post("/api/inscriptions", inscription)
    alert("Inscription ajoutée")
  } catch (e) {
    alert("Erreur inscription")
  }
}

onMounted(loadOptions)
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input, select {
  padding: 8px;
}

button {
  background: purple;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>

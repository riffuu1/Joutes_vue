<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const players = ref([])
const loading = ref(true)

const loadMyPlayers = async () => {
  try {
    const res = await axios.get('http://localhost:3006/api/players')
    
    // On récupère les infos du leader stockées au login
    const user = JSON.parse(localStorage.getItem('user'))
    
    // FILTRE : On ne garde que les joueurs de SON équipe
    // On suppose que ton API joueur contient un champ 'LeaderId' ou 'TeamName'
    players.value = res.data.filter(p => p.Users_id === user.id || p.idTeams === user.idTeams)
    
  } catch (e) {
    console.error("Erreur chargement joueurs", e)
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

onMounted(loadMyPlayers)
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-6">
      <div class="flex">
        <button @click="router.push('/description')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-l-md font-semibold transition">Vue Description</button>
        <button class="bg-blue-600 text-white px-6 py-2 rounded-r-md font-semibold">Gestion Equipe</button>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-sm font-bold text-gray-700">Utilisateur Standard</p>
          <p class="text-xs text-gray-500">Utilisateur</p>
        </div>
        <button @click="logout" class="bg-red-600 text-white px-4 py-2 rounded-md shadow">
          Déconnexion
        </button>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-100 border-b">
            <th class="p-3 font-bold text-gray-600">ID</th>
            <th class="p-3 font-bold text-gray-600">Nom</th>
            <th class="p-3 font-bold text-gray-600">Prénom</th>
            <th class="p-3 font-bold text-gray-600">Email</th>
            <th class="p-3 font-bold text-gray-600">Classe</th>
            <th class="p-3 font-bold text-gray-600">Equipe</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in players" :key="p.idPlayers" class="border-b hover:bg-gray-50 transition">
            <td class="p-3 text-gray-600">{{ p.idPlayers }}</td>
            <td class="p-3 text-gray-800 font-medium">{{ p.LastName }}</td>
            <td class="p-3 text-gray-800">{{ p.FirstName }}</td>
            <td class="p-3 text-blue-600 italic">{{ p.Email }}</td>
            <td class="p-3 text-gray-600">{{ p.Class }}</td>
            <td class="p-3 font-bold text-gray-700">{{ p.TeamName }}</td>
          </tr>
          <tr v-if="players.length === 0 && !loading">
            <td colspan="6" class="p-10 text-center text-gray-400">Aucun joueur trouvé pour votre équipe.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
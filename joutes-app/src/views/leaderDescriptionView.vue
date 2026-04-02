<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const sports = ref([])

const loadSports = async () => {
  try {
    const res = await axios.get('http://localhost:3006/api/sports')
    sports.value = res.data
  } catch (e) {
    console.error("Erreur chargement sports", e)
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

onMounted(loadSports)
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-6">
      <div class="flex">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-l-md font-semibold">Vue Description</button>
        <button @click="router.push('/leader-team')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-r-md font-semibold transition">Gestion Equipe</button>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-sm font-bold text-gray-700">Utilisateur Standard</p>
          <p class="text-xs text-gray-500">Utilisateur</p>
        </div>
        <button @click="logout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center shadow">
          <span class="mr-2">Logout</span>
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-100 border-b">
            <th class="p-4 font-bold text-gray-600 w-16">#</th>
            <th class="p-4 font-bold text-gray-600">Equipe</th>
            <th class="p-4 font-bold text-gray-600">Sport</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in sports" :key="index" class="border-b hover:bg-gray-50 transition">
            <td class="p-4 text-gray-700">{{ index + 1 }}</td>
            <td class="p-4 text-gray-700 font-medium">{{ item.displayTeam }}</td>
            <td class="p-4 text-gray-700">{{ item.displaySport }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
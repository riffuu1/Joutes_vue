<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAdmin = ref(true)
const userDisplayName = computed(() => (isAdmin.value ? 'Administrateur' : 'Utilisateur'))
const userRoleLabel = computed(() => (isAdmin.value ? 'Administrateur' : 'Standard'))

// Search states
const searchFirstname = ref('')
const searchTeam = ref('')

const player = reactive({
  lastname: '',
  firstname: '',
  email: '',
  classname: '',
  team: '',
})

const teams = ref([])
const playersList = ref([])
const allPlayers = ref([]) // Store all players for filtering

// Get auth token
const getAuthToken = () => {
  // On récupère directement la chaîne de caractères 'token'
  const token = localStorage.getItem('token')
  return token || null
}

const goToDescription = () => router.push('/description')
const goToGestion = () => router.push('/teams')

const loadData = async () => {
  try {
    // Load teams
    const resTeams = await axios.get('http://localhost:3006/api/sports')
    teams.value = resTeams.data.map((t: any) => t.displayTeam || t.Name)

    // Load players with team info
    const resPlayers = await axios.get('http://localhost:3006/api/players')
    playersList.value = resPlayers.data
    allPlayers.value = resPlayers.data // Keep original copy
  } catch (e) {
    console.error('Erreur chargement:', e)
  }
}

// Search by firstname button
const searchByFirstname = () => {
  if (!searchFirstname.value.trim()) {
    alert('Veuillez entrer un prénom à rechercher')
    return
  }
  
  const query = searchFirstname.value.toLowerCase().trim()
  playersList.value = allPlayers.value.filter((p: any) => {
    return p.firstname?.toLowerCase().includes(query)
  })
  
  if (playersList.value.length === 0) {
    alert('Aucun joueur trouvé avec ce prénom')
  }
}

// Search by team button
const searchByTeam = () => {
  if (!searchTeam.value) {
    alert('Veuillez sélectionner une équipe')
    return
  }
  
  playersList.value = allPlayers.value.filter((p: any) => {
    return p.team === searchTeam.value
  })
  
  if (playersList.value.length === 0) {
    alert('Aucun joueur trouvé dans cette équipe')
  }
}

// Reset filters
const showAll = () => {
  playersList.value = allPlayers.value
  searchFirstname.value = ''
  searchTeam.value = ''
}

const createPlayer = async () => {
  if (!player.firstname || !player.lastname || !player.email || !player.team) {
    alert('Veuillez remplir tous les champs obligatoires.')
    return
  }

  const token = getAuthToken()
  if (!token) {
    alert('Veuillez vous reconnecter')
    return
  }

  try {
    const res = await axios.post('http://localhost:3006/api/players', {
      firstname: player.firstname,
      lastname: player.lastname,
      email: player.email,
      classname: player.classname,
      teamName: player.team,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // Add new player to list
    const newPlayer = {
      id: res.data.id,
      firstname: player.firstname,
      lastname: player.lastname,
      email: player.email,
      classname: player.classname,
      team: player.team
    }
    
    playersList.value.push(newPlayer)
    allPlayers.value.push(newPlayer)

    // Reset form
    player.firstname = ''
    player.lastname = ''
    player.email = ''
    player.classname = ''
    player.team = ''

    alert('Joueur créé et assigné à l\'équipe !')
  } catch (e: any) {
    console.error('Create error:', e)
    alert(e.response?.data?.message || "Erreur lors de la création")
  }
}

const deletePlayer = async (playerId: number) => {
  if (!confirm('Voulez-vous vraiment supprimer ce joueur ?')) return
  
  const token = getAuthToken()
  if (!token) {
    alert('Veuillez vous reconnecter')
    return
  }

  try {
    await axios.delete(`http://localhost:3006/api/players/${playerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    // Remove from both lists
    playersList.value = playersList.value.filter((p: any) => p.id !== playerId)
    allPlayers.value = allPlayers.value.filter((p: any) => p.id !== playerId)
    
    alert('Joueur supprimé')
  } catch (e: any) {
    console.error('Delete error:', e)
    alert(e.response?.data?.message || "Erreur lors de la suppression")
  }
}

const handleLogout = () => {
  localStorage.clear()
  router.replace('/login')
}

onMounted(() => {
  loadData()
  
  // Puisque ton login ne stocke que le token, 
  // on va vérifier si un token existe pour donner les droits
  const token = localStorage.getItem('token')
  if (token) {
    isAdmin.value = true // On force à true si on est connecté
  }
})
</script>

<template>
  <div class="page-bg">
    <header class="navbar">
      <div class="nav-links">
        <button class="btn-nav btn-green" @click="goToDescription">Vue Description</button>
        <button class="btn-nav btn-blue" @click="goToGestion">Gestion Equipe</button>
      </div>

      <div class="user-info">
        <div v-if="isAdmin" class="icon-shield">🛡️</div>

        <div class="admin-text">
          <strong>{{ userDisplayName }}</strong><br />
          <span>{{ userRoleLabel }}</span>
        </div>

        <button class="btn-logout" @click="handleLogout">
          <span class="logout-icon">↪</span> Déconnexion
        </button>
      </div>
    </header>

    <main class="content-container">
      <!-- ADD PLAYER FORM -->
      <div class="card">
        <h3 class="section-title">Ajouter un nouveau joueur</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Prénom *</label>
            <input v-model="player.firstname" type="text" placeholder="Entrez le prénom" />
          </div>
          <div class="form-group">
            <label>Nom *</label>
            <input v-model="player.lastname" type="text" placeholder="Entrez le nom" />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input v-model="player.email" type="email" placeholder="exemple@mail.com" />
          </div>
          <div class="form-group">
            <label>Classe</label>
            <input v-model="player.classname" type="text" placeholder="Classe" />
          </div>
          <div class="form-group">
            <label>Equipe *</label>
            <select v-model="player.team" class="custom-select">
              <option value="" disabled selected>Choisir une équipe</option>
              <option v-for="t in teams" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <div class="button-group">
          <button v-if="isAdmin" class="btn btn-purple" @click="createPlayer">
            Ajouter joueur
          </button>
        </div>
      </div>

      <!-- SEARCH SECTION -->
      <div class="card search-card">
        <h3 class="section-title">Rechercher des joueurs</h3>
        
        <!-- Search by Firstname -->
        <div class="search-row">
          <div class="search-field">
            <label>Rechercher par prénom:</label>
            <input 
              v-model="searchFirstname" 
              type="text" 
              placeholder="Entrez un prénom..."
            />
          </div>
          <button class="btn btn-blue" @click="searchByFirstname">
            Rechercher par prénom
          </button>
        </div>

        <!-- Search by Team -->
        <div class="search-row">
          <div class="search-field">
            <label>Rechercher par équipe:</label>
            <select v-model="searchTeam" class="custom-select">
              <option value="" disabled selected>Choisir une équipe</option>
              <option v-for="t in teams" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <button class="btn btn-green" @click="searchByTeam">
            Rechercher par équipe
          </button>
        </div>

        <!-- Show All Button -->
        <div class="search-actions">
          <button class="btn btn-gray" @click="showAll">
            Afficher tous les joueurs
          </button>
          <span class="results-count">{{ playersList.length }} joueur(s) affiché(s)</span>
        </div>
      </div>

      <!-- PLAYERS TABLE -->
      <div class="table-container card">
        <h3 class="section-title">Liste des joueurs</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Classe</th>
              <th>Equipe</th>
              <th v-if="isAdmin">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in playersList" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.lastname }}</td>
              <td>{{ p.firstname }}</td>
              <td>{{ p.email }}</td>
              <td>{{ p.classname }}</td>
              <td>{{ p.team }}</td>
              <td v-if="isAdmin" class="action-buttons">
                <button class="btn-edit">Modifier</button>
                <button class="btn-delete" @click="deletePlayer(p.id)">Supprimer</button>
              </td>
            </tr>
            <tr v-if="playersList.length === 0">
              <td colspan="7" class="empty-msg">Aucun joueur trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-bg {
  width: 100%;
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
}

.btn-nav {
  border: none;
  padding: 12px 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.btn-green {
  background-color: #4caf50;
  border-radius: 4px 0 0 4px;
}

.btn-blue {
  background-color: #4185f4;
  border-radius: 0 4px 4px 0;
  margin-left: -2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-shield {
  font-size: 22px;
  color: #daa520;
}

.admin-text {
  text-align: right;
  font-size: 13px;
}

.btn-logout {
  background-color: #d93025;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.content-container {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 1100px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.section-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
  border-bottom: 2px solid #4185f4;
  padding-bottom: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 40px;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 8px;
}

.form-group input,
.custom-select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 12px 22px;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.btn-purple {
  background-color: #9c27b0;
}

.btn-blue {
  background-color: #4185f4;
}

.btn-green {
  background-color: #4caf50;
}

.btn-gray {
  background-color: #6c757d;
}

/* Search section styles */
.search-card {
  background-color: #f8f9fa;
}

.search-row {
  display: flex;
  align-items: flex-end;
  gap: 15px;
  margin-bottom: 20px;
}

.search-field {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-field label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #555;
}

.search-field input,
.search-field select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

.results-count {
  color: #666;
  font-style: italic;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th {
  background-color: #f8f9fa;
  padding: 12px;
  border: 1px solid #dee2e6;
  text-align: left;
}

td {
  padding: 12px;
  border: 1px solid #dee2e6;
}

.btn-edit {
  background: #4285f4;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.btn-delete {
  background: #d93025;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.empty-msg {
  text-align: center;
  color: #888;
  padding: 40px;
  font-style: italic;
}
</style>
<script setup lang="ts">
/* --- IMPORTS --- */
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

/* --- INITIALIZATION --- */
const router = useRouter()
const teamSports = ref([]) // Main data list
const newEntry = ref({
  teamName: '',
  sportName: ''
})

// Edit modal state
const showEditModal = ref(false)
const editingItem = ref({
  idT: null,
  idS: null,
  team: '',
  sport: '',
  originalTeam: '',
  originalSport: ''
})

// List of available sports
const availableSports = [
  'Badminton',
  'Unihockey',
  'Foot',
  'Streetbasket',
  'Gym',
  'Volley',
  'Beachvolley',
  'Marche',
  'Pétanque'
]

// Get current admin user ID from localStorage - tries multiple keys and formats
const getCurrentUserId = () => {
  const possibleKeys = ['user', 'currentUser', 'authUser', 'admin', 'auth', 'userData', 'account']
  const possibleIdFields = ['idUsers', 'id', 'userId', 'IdUsers', 'ID', 'id_user', 'user_id', 'Id']
  
  for (const key of possibleKeys) {
    const userStr = localStorage.getItem(key)
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        for (const field of possibleIdFields) {
          if (user[field]) {
            console.log(`Found user ID ${user[field]} in localStorage['${key}'].${field}`)
            return user[field]
          }
        }
      } catch {
        continue
      }
    }
  }
  
  console.log('=== DEBUG: localStorage contents ===')
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const value = localStorage.getItem(key)
    console.log(`${key}:`, value.substring(0, 100))
  }
  console.log('=====================================')
  
  console.log('No user found in localStorage, using fallback admin ID: 1')
  return 1
}

/* --- NAVIGATION METHODS --- */
const goToGestion = () => router.push('/teams')
const goToDescription = () => router.push('/description')

const handleLogout = () => {
  localStorage.clear()
  router.replace('/login')
}

/* --- API METHODS --- */

const loadSports = async () => {
  try {
    const res = await axios.get('http://localhost:3006/api/sports')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    teamSports.value = res.data.map((item: any) => ({
      team: item.displayTeam,
      sport: item.displaySport,
      idT: item.idTeams,
      idS: item.idSports
    }))
  } catch (e) {
    console.error('Erreur lors du chargement des sports:', e)
  }
}

const addTeamSport = async () => {
  if (!newEntry.value.teamName || !newEntry.value.sportName) {
    alert('Veuillez remplir les deux champs.')
    return
  }

  const usersId = getCurrentUserId()
  if (!usersId) {
    alert('Erreur: Impossible de récupérer l\'ID utilisateur. Veuillez vous reconnecter.')
    return
  }

  console.log('Using user ID:', usersId)

  try {
    await axios.post('http://localhost:3006/api/sports', {
      teamName: newEntry.value.teamName,
      sportName: newEntry.value.sportName,
      usersId: usersId
    })
    
    await loadSports()
    newEntry.value.teamName = ''
    newEntry.value.sportName = ''
    alert("L'équipe a été créée et liée au sport avec succès.")
  } catch (// eslint-disable-next-line @typescript-eslint/no-explicit-any
  e: any) {
    console.error('Add error:', e.response?.data || e.message)
    alert(e.response?.data?.message || "Erreur lors de l'ajout.")
  }
}

/* --- EDIT METHODS --- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openEditModal = (item: any) => {
  editingItem.value = {
    idT: item.idT,
    idS: item.idS,
    team: item.team,
    sport: item.sport,
    originalTeam: item.team,
    originalSport: item.sport
  }
  showEditModal.value = true
  console.log('Opening edit modal for:', editingItem.value)
}

const closeEditModal = () => {
  showEditModal.value = false
  editingItem.value = {
    idT: null,
    idS: null,
    team: '',
    sport: '',
    originalTeam: '',
    originalSport: ''
  }
}

const saveEdit = async () => {
  console.log('=== SAVE EDIT ===')
  console.log('Editing item:', editingItem.value)
  
  if (!editingItem.value.team || !editingItem.value.sport) {
    alert('Veuillez remplir les deux champs.')
    return
  }

  if (!editingItem.value.idT || !editingItem.value.idS) {
    alert('Erreur: IDs manquants')
    return
  }

  try {
    const payload = {
      isUpdate: true,  // Boolean true
      idTeams: editingItem.value.idT,
      idSports: editingItem.value.idS,
      newTeamName: editingItem.value.team,
      newSportName: editingItem.value.sport
    }
    
    console.log('POST to: http://localhost:3006/api/sports')
    console.log('Payload:', payload)

    const res = await axios.post('http://localhost:3006/api/sports', payload)
    console.log('Response:', res.data)
    
    await loadSports()
    closeEditModal()
    alert("Les modifications ont été enregistrées avec succès.")
  } catch (// eslint-disable-next-line @typescript-eslint/no-explicit-any
  e: any) {
    console.error('EDIT ERROR:', e.response?.data || e.message)
    alert('Erreur: ' + (e.response?.data?.message || e.message))
  }
}

/* --- DELETE METHOD --- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteEntry = async (item: any) => {
  if (!item.idT || !item.idS) {
    alert("Erreur: Impossible de localiser l'ID de cette équipe.")
    return
  }

  const confirmed = window.confirm(`Voulez-vous vraiment supprimer l'équipe "${item.team}" ?\n\nNote: Cela supprimera l'équipe de la base de données.`)
  
  if (confirmed) {
    try {
      await axios.delete(`http://localhost:3006/api/sports/${item.idT}/${item.idS}`)
      await loadSports()
    } catch (// eslint-disable-next-line @typescript-eslint/no-explicit-any
    e: any) {
      console.error('Delete error:', e.response?.data || e.message)
      alert("Erreur: L'équipe ne peut pas être supprimée (elle contient probablement des joueurs).")
    }
  }
}

/* --- LIFECYCLE --- */
onMounted(() => {
  loadSports()
})
</script>

<template>
  <div class="page-bg">
    <header class="navbar">
      <div class="nav-links">
        <button class="btn-nav btn-blue-active" @click="goToDescription">Vue Description</button>
        <button class="btn-nav btn-green-tab" @click="goToGestion">Gestion Equipe</button>
      </div>

      <div class="user-info">
        <div class="icon-shield">🛡️</div>
        <div class="admin-text">
          <strong>Administrateur</strong><br />
          <span>Administrateur</span>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <span class="logout-icon">↪</span> Déconnexion
        </button>
      </div>
    </header>

    <main class="content-container">
      
      <div class="card table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Equipe</th>
              <th>Sport</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in teamSports" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.team }}</td>
              <td>{{ item.sport }}</td>
              <td class="action-buttons">
                <button class="btn-edit" @click="openEditModal(item)">Modifier</button>
                <button class="btn-delete" @click="deleteEntry(item)">Supprimer</button>
              </td>
            </tr>
            <tr v-if="teamSports.length === 0">
              <td colspan="4" class="empty-msg">Aucune liaison équipe/sport trouvée dans la base de données.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="form-card-gray">
        <div class="form-grid-small">
          <div class="form-group">
            <label>Nom équipe</label>
            <input 
              v-model="newEntry.teamName" 
              type="text" 
              placeholder="Entrez le nom de l'équipe" 
            />
          </div>
          <div class="form-group">
            <label>Nom sport</label>
            <select v-model="newEntry.sportName">
              <option value="" disabled selected>Choisissez un sport</option>
              <option v-for="sport in availableSports" :key="sport" :value="sport">
                {{ sport }}
              </option>
            </select>
          </div>
        </div>
        <button class="btn-add-sport" @click="addTeamSport">
          Ajouter équipe/sport
        </button>
      </div>

    </main>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Modifier l'équipe</h2>
          <button class="modal-close" @click="closeEditModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Nom de l'équipe</label>
            <input 
              v-model="editingItem.team" 
              type="text" 
              placeholder="Entrez le nom de l'équipe"
            />
          </div>
          
          <div class="form-group">
            <label>Sport</label>
            <select v-model="editingItem.sport">
              <option v-for="sport in availableSports" :key="sport" :value="sport">
                {{ sport }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeEditModal">Annuler</button>
          <button class="btn-save" @click="saveEdit">Enregistrer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* --- BASE LAYOUT --- */
.page-bg {
  width: 100%;
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
}

/* --- NAVBAR STYLES --- */
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
  transition: opacity 0.2s;
}

.btn-nav:hover {
  opacity: 0.9;
}

.btn-blue-active {
  background-color: #4185f4;
  border-radius: 4px 0 0 4px;
}

.btn-green-tab {
  background-color: #4caf50;
  border-radius: 0 4px 4px 0;
  margin-left: -2px;
}

/* --- USER PROFILE STYLES --- */
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
  color: #333;
}

.btn-logout {
  background-color: #d93025;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* --- MAIN CONTENT LAYOUT --- */
.content-container {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

/* --- TABLE STYLES --- */
.card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 1100px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
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
  font-weight: bold;
}

td {
  padding: 12px;
  border: 1px solid #dee2e6;
  color: #444;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-edit {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  background-color: #d93025;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

/* --- FORM STYLES --- */
.form-card-gray {
  background-color: #eaedf2; 
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 1100px;
  border: 1px solid #eee;
}

.form-grid-small {
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
  color: #000;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  font-size: 14px;
}

.form-group select {
  cursor: pointer;
}

.btn-add-sport {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
}

.empty-msg {
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
}

/* --- MODAL STYLES --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-body .form-group {
  margin-bottom: 15px;
}

.modal-body .form-group:last-child {
  margin-bottom: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-save {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-cancel:hover,
.btn-save:hover {
  opacity: 0.9;
}
</style>
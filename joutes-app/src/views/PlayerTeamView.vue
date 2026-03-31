<template>
  <div class="page-bg">
    <header class="navbar">
      <div class="nav-links">
        <button class="btn-nav btn-green">Vue Description</button>
        <button class="btn-nav btn-blue">Gestion Equipe</button>
      </div>

      <div class="user-info">
        <div v-if="isAdmin" class="icon-shield">🛡️</div>

        <div class="admin-text">
          <strong>{{ userDisplayName }}</strong><br>
          <span>{{ userRoleLabel }}</span>
        </div>

        <button class="btn-logout" @click="handleLogout">
          <span class="logout-icon">↪</span> Déconnexion
        </button>
      </div>
    </header>

    <main class="content-container">

      <div class="card">
        <div class="form-grid">
          <div class="form-group">
            <label>Prénom</label>
            <input v-model="player.firstname" type="text" placeholder="Entrez le prénom" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="player.email" type="email" placeholder="exemple@mail.com" />
          </div>
          <div class="form-group">
            <label>Classe</label>
            <input v-model="player.classname" type="text" placeholder="Classe" />
          </div>
          <div class="form-group">
            <label>Equipe</label>
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

          <button class="btn btn-green-alt" @click="handleSearch">
            Rechercher
          </button>

          <button v-if="isAdmin" class="btn btn-red">
            Equipe Recherché
          </button>
        </div>

        <div class="helper-section">
          <p class="italic">Entrez pour ajouter une nouvelle équipe ou seuris déclencher une équipe existante</p>
          <p>la Recherche va filtrer par prénom et nom d'équipe</p>
        </div>
      </div>

      <div class="table-container card">
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
                <button class="btn-delete">Supprimer</button>
              </td>
            </tr>
            <tr v-if="playersList.length === 0">
              <td colspan="7" class="empty-msg">Aucun joueur trouvé. La table se remplira automatiquement après la connexion à la DB.</td>
            </tr>
          </tbody>
        </table>

        <div v-if="isAdmin" class="bulk-actions">
          <div class="bulk-left">
            <span>Actions groupées:</span>
            <button class="btn-delete-selection">Supprimer Sélection</button>
          </div>
          <div class="bulk-right">
            <span>Changer équipe pour la sélection</span>
            <select class="small-select">
              <option>Sélectionner...</option>
              <option v-for="t in teams" :key="t">{{ t }}</option>
            </select>
            <button class="btn-apply">Appliquer</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/* Importing reactive state and lifecycle hooks from Vue */
import { reactive, ref, onMounted, computed } from "vue"
/* Importing Axios for future database requests */
import { useRouter } from 'vue-router'

const router = useRouter()
/* Variable to control admin status (true = show all buttons, false = hide them) */
const isAdmin = ref(true)
/* Computed property to decide the name based on isAdmin */
const userDisplayName = computed(() => isAdmin.value ? "Administrateur" : "Utilisateur")
/* Computed property to decide the role sub-text */
const userRoleLabel = computed(() => isAdmin.value ? "Administrateur" : "Standard")

/* Reactive object to hold data for a new player */
const player = reactive({
  lastname: "",
  firstname: "",
  email: "",
  classname: "",
  team: ""
})

/* Ref array to store teams fetched from the DB */
const teams = ref(["Les Buens Ritmos", "Paradis", "Hesta la Vista"])
/* Ref array to store players (will stay empty until you connect your DB) */
const playersList = ref([])

/* Async function to load teams and players from your API */
const loadData = async () => {
  try {
    /* Example: const res = await axios.get("/api/players") */
    /* Example: playersList.value = res.data */
    console.log("Prêt pour la connexion DB")
  } catch (e) {
    /* Log errors if the API call fails */
    console.error("Erreur chargement:", e)
  }
}

/* Function to handle creating a new player via API */
const createPlayer = async () => {
  try {
    /* Example: await axios.post("/api/players", player) */
    alert("Joueur créé !")
  } catch  {
    /* Alert user if something goes wrong */
    alert("Erreur création")
  }
}

/* Placeholder function for search logic */
const handleSearch = () => alert("Recherche...")
/* Placeholder function for logout logic */
const handleLogout = () => {
  // Nettoyage si besoin
  localStorage.clear()

  // Redirection vers login
  router.replace('/login')
}
/* Trigger data loading when the component first appears on screen */
onMounted(loadData)
</script>

<style scoped>
/* Reset and base styles for the whole page */
.page-bg {
  width: 100%;
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

/* Style for the top navigation bar */
.navbar {
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
}

/* Base style for nav buttons */
.btn-nav {
  border: none;
  padding: 12px 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

/* Specifically for the Description button */
.btn-green { background-color: #4CAF50; border-radius: 4px 0 0 4px; }
/* Specifically for the Management button */
.btn-blue { background-color: #4185f4; border-radius: 0 4px 4px 0; margin-left: -2px; }

/* User profile section layout */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Gold color for the admin shield icon */
.icon-shield { font-size: 22px; color: #daa520; }
/* Role text alignment */
.admin-text { text-align: right; font-size: 13px; }
/* Logout button styling */
.btn-logout {
  background-color: #d93025;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

/* Wrapper for everything below the navbar */
.content-container {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

/* Shared card style for form and table */
.card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 1100px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

/* Form inputs layout */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 40px;
  margin-bottom: 25px;
}

/* Input group layout */
.form-group { display: flex; flex-direction: column; }
/* Bold labels for inputs */
.form-group label { font-weight: bold; margin-bottom: 8px; }
/* Input and select box styling */
.form-group input, .custom-select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Form action buttons group */
.button-group { display: flex; gap: 12px; margin-bottom: 20px; }
/* Base style for form buttons */
.btn { padding: 12px 22px; border: none; border-radius: 6px; color: white; font-weight: bold; cursor: pointer; }
/* Colors for the different buttons */
.btn-purple { background-color: #9c27b0; }
.btn-green-alt { background-color: #4CAF50; }
.btn-red { background-color: #d93025; }

/* TABLE STYLING */
/* Allowing horizontal scroll on small screens */
.table-container { overflow-x: auto; }
/* Full width table with no spacing */
table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
/* Header cell styling */
th { background-color: #f8f9fa; padding: 12px; border: 1px solid #dee2e6; text-align: left; }
/* Body cell styling */
td { padding: 12px; border: 1px solid #dee2e6; }

/* Modifier button styling */
.btn-edit { background: #4285f4; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-right: 5px; }
/* Supprimer button styling */
.btn-delete { background: #d93025; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }

/* Bulk actions pink background box */
.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fce4ec;
  border-radius: 5px;
  margin-top: 10px;
}

/* Left and right bulk sections */
.bulk-left, .bulk-right { display: flex; align-items: center; gap: 15px; font-weight: bold; }
/* Apply button blue color */
.btn-apply { background: #4285f4; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
/* Small select for bulk team change */
.small-select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }

/* Empty state message color */
.empty-msg { text-align: center; color: #888; padding: 40px; font-style: italic; }
/* Italic helper text */
.italic { font-style: italic; }
</style>

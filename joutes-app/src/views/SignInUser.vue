<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
// Reactive object to store form input
const user = reactive({
  username: '',
  password: '',
  team: '',
  sport: '', // stockera l'idSports sélectionné
})

// Track registration status and loading state
const registered = ref(false)
const loading = ref(false)

const lastRegisteredTeam = ref('')

// Sports récupérés depuis le backend
const sports = ref([])

// Récupération des sports depuis le backend
onMounted(async () => {
  try {
    // Appel direct au backend sur le port 3006
    const res = await axios.get('http://localhost:3006/api/sports')
    sports.value = res.data // [{ idSports: 1, Name: "Badminton" }, ...]
  } catch (e) {
    console.error('Erreur récupération sports :', e)
    alert('Impossible de récupérer les sports disponibles')
  }
})

// Validation mot de passe strict
function validatePassword(password) {
  if (password.length < 12) return 'Le mot de passe doit contenir au moins 12 caractères'

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/
  if (!regex.test(password))
    return 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'

  const lower = password.toLowerCase()
  for (let i = 0; i < lower.length - 2; i++) {
    if (
      lower.charCodeAt(i) + 1 === lower.charCodeAt(i + 1) &&
      lower.charCodeAt(i + 1) + 1 === lower.charCodeAt(i + 2)
    ) {
      return 'Le mot de passe ne peut pas contenir de suite de lettres comme abc'
    }
  }

  for (let i = 0; i < password.length - 2; i++) {
    const n1 = password[i].charCodeAt(0)
    const n2 = password[i + 1].charCodeAt(0)
    const n3 = password[i + 2].charCodeAt(0)
    if (/\d/.test(password[i]) && /\d/.test(password[i + 1]) && /\d/.test(password[i + 2])) {
      if (n1 + 1 === n2 && n2 + 1 === n3)
        return 'Le mot de passe ne peut pas contenir de suite de chiffres comme 123'
    }
  }

  return null
}

// Function to handle user registration
const registerUser = async () => {
  if (!user.username.trim() || !user.password.trim() || !user.team.trim() || !user.sport) {
    alert('Tous les champs sont obligatoires.')
    return
  }

  const passwordError = validatePassword(user.password)
  if (passwordError) {
    alert(passwordError)
    return
  }

  loading.value = true

  try {
    await axios.post('http://localhost:3006/api/auth/register', {
      username: user.username,
      password: user.password,
      teamName: user.team,
      sportId: user.sport,
    })

    lastRegisteredTeam.value = user.team
    registered.value = true
    alert(`Votre compte a été créé avec succès ! Bienvenue dans l'équipe ${user.team}.`)

    //Redirection vers la page login
    setTimeout(() => {
      router.push('/login')
    }, 2000)

    // Reset form
    Object.keys(user).forEach((key) => (user[key] = ''))
  } catch (e) {
    console.error(e)
    alert(e.response?.data?.message || "Erreur lors de l'inscription.")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Inscription des chefs d'équipe</h1>
      <p class="subtitle">Créez votre équipe et commencez à vous inscrire</p>

      <div class="form-group">
        <label>Nom d'utilisateur</label>
        <input v-model="user.username" placeholder="Entrez votre nom d'utilisateur" />
      </div>

      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" v-model="user.password" placeholder="Mot de passe" />
      </div>

      <div class="form-group">
        <label>Nom d'équipe</label>
        <input v-model="user.team" placeholder="Votre nom d'équipe" />
      </div>

      <div class="form-group">
        <label>Choix du Sport</label>
        <select v-model="user.sport">
          <option disabled value="">Choisissez un sport</option>
          <option v-for="s in sports" :key="s.idSports" :value="s.idSports">
            {{ s.Name }}
          </option>
        </select>
      </div>

      <button class="register-btn" @click="registerUser" :disabled="loading">
        {{ loading ? 'Chargement...' : 'Créer un compte' }}
      </button>

      <div v-if="registered" class="success-box">
        Votre compte a été créé avec succès ! Équipe: <strong>{{ lastRegisteredTeam }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
}

.register-card {
  width: 450px;
  padding: 40px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 5px;
}
.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}
label {
  margin-bottom: 5px;
  font-weight: 500;
}
input,
select {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}
input:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
}

.register-btn {
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.register-btn:hover {
  background: #1e4fd1;
}
.register-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.success-box {
  margin-top: 20px;
  padding: 12px;
  background: #dcfce7;
  border-radius: 8px;
  text-align: center;
  color: #166534;
}
</style>

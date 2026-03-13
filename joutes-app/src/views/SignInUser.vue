<script setup>
import { reactive, ref } from "vue"
import axios from "axios"

const user = reactive({
  lastname: "",
  firstname: "",
  classname: "",
  email: "",
  team: ""
})

const registered = ref(false)

const registerUser = async () => {
  if (
    !user.lastname.trim() ||
    !user.firstname.trim() ||
    !user.classname.trim() ||
    !user.email.trim() ||
    !user.team.trim()
  ) {
    alert("Tous les champs sont requis.")
    return
  }

  try {
    await axios.post("/api/teams", { name: user.team })

    await axios.post("/api/users", {
      lastname: user.lastname,
      firstname: user.firstname,
      classname: user.classname,
      email: user.email,
      team: user.team
    })

    registered.value = true
    alert(`Compte créé ! Bienvenue dans l'équipe ${user.team}.`)
  } catch (e) {
    console.error(e)
    alert("Erreur lors de l'inscription.")
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">

      <h1>Inscription Chef d'Équipe</h1>
      <p class="subtitle">Créez votre équipe et commencez l'inscription</p>

      <div class="form-group">
        <label>Nom</label>
        <input v-model="user.lastname" placeholder="Votre nom" />
      </div>

      <div class="form-group">
        <label>Prénom</label>
        <input v-model="user.firstname" placeholder="Votre prénom" />
      </div>

      <div class="form-group">
        <label>Classe</label>
        <input v-model="user.classname" placeholder="Ex: 3A" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="user.email" placeholder="votre.email@ecnv.ch" />
      </div>

      <div class="form-group">
        <label>Nom de l'équipe</label>
        <input v-model="user.team" placeholder="Nom de votre équipe" />
      </div>

      <button class="register-btn" @click="registerUser">
        Créer mon compte
      </button>

      <div v-if="registered" class="success-box">
        Compte créé ! Équipe : <strong>{{ user.team }}</strong>
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
}

.register-card {
  width: 450px;
  padding: 40px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
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

input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

input:focus {
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

.success-box {
  margin-top: 20px;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 8px;
  text-align: center;
}

</style>

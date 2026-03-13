<template>
  <div class="login-container">
    <div class="login-card">

      <h1>Gestion des Équipes Sportives</h1>
      <p class="subtitle">Connectez-vous pour continuer</p>

      <div class="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="votre.email@ecnv.ch"
          v-model="email"
        />
      </div>

      <div class="form-group">
        <label>Mot de passe</label>
        <input
          type="password"
          placeholder="********"
          v-model="password"
        />
      </div>

      <button class="login-btn" @click="login">
        Se connecter
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const email = ref("")
const password = ref("")

const login = () => {
  console.log(email.value, password.value)
}
</script>

<style scoped>

.login-container {
  position: fixed;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 420px;
  padding: 40px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}


h1 {
  font-size: 28px;
  margin-bottom: 5px;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 30px;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

label {
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

input:focus {
  outline: none;
  border-color: #2563eb;
}

.login-btn {
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.login-btn:hover {
  background: #1e4fd1;
}

.demo-box {
  margin-top: 25px;
  background: #f1f5f9;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;
}

</style>

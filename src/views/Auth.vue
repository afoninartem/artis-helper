<template>
  <div class="auth">
    <h1>Пожалуйста, авторизуйтесь</h1>
    <form class="auth__form" @submit.prevent="onSubmit">
      <input
        autofocus
        type="email"
        name="email"
        id="email"
        v-model.trim="email"
        placeholder="example@artis21.ru"
        :class="{
          invalid:
            ($v.email.$dirty && !$v.email.required) ||
            ($v.email.$dirty && !$v.email.email),
        }"
      />
      <label v-if="!$v.email.$dirty && !$v.email.required" for="email"
        >Введите email</label
      >
      <label v-else-if="$v.email.$dirty && !$v.email.email" for="email"
        >Введите корректный email</label
      >
      <label v-else for="email">Введите email</label>

      <input
        type="password"
        name="password"
        id="password"
        placeholder="******"
        v-model.trim="password"
        :class="{
          invalid:
            ($v.password.$dirty && !$v.password.required) ||
            ($v.password.$dirty && !$v.password.minLength),
        }"
      />
      <label
        v-if="
          ($v.password.$dirty && !$v.password.required) ||
          (!$v.password.$dirty && !$v.password.required)
        "
        for="password"
        >Введите пароль</label
      >
      <label
        v-else-if="$v.password.$dirty && !$v.password.minLength"
        for="password"
        >Введите 6-значный пароль</label
      >
      <label v-else for="password">Введите пароль</label>
      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<script>
import { email, required, minLength } from "vuelidate/lib/validators";
export default {
  name: "Auth",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(6) },
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
      };

      try {
        await this.$store.dispatch("login", formData);
        this.$router.push("/about");
      } catch (error) {
        console.log(error.message);
      }
    },
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.auth {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 6em;
  font-size: 20px;
  h1 {
    margin-bottom: 40px;
  }
  &__form {
    border: 1px solid #97999b;
    border-radius: 5px;
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    max-width: 45%;
    margin: 0 auto;
    input {
      margin-bottom: 5px;
      font-size: 24px;
      border: none;
      border-bottom: 1px solid #97999b;
      outline: none;
      padding: 5px 5px;
      text-align: center;
      background: #fbf9fc;
      &::placeholder {
        color: #ccc;
        background: #fbf9fc;
      }
    }
    .invalid {
      border-bottom: 1px solid rgb(236, 50, 50);
      transition: all 0.5s ease-in-out;
      color: rgb(236, 50, 50);
    }
    label {
      margin-bottom: 15px;
      align-self: center;
      padding: 0 0 0 5px;
    }
    button {
      border: 1px solid #f5df4d;
      background: #f5df4d;
      padding: 16px 32px;
      font-size: 20px;

      &:hover {
        transform: scale(1.05);
        cursor: pointer;
      }
      &:active {
        transform: scale(1);
      }
    }
  }
}
</style>
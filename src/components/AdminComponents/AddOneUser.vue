<template>
  <section class="add-one-user">
    <form class="add-one-user__form" @submit.prevent="onSubmit">
      <h2>Добавить пользователя</h2>
      <input
        name="newUserEmail"
        id="newUserEmail"
        placeholder="example@artis21.ru"
        v-model.trim="email"
        :class="{
          invalid:
            ($v.email.$dirty && !$v.email.required) ||
            ($v.email.$dirty && !$v.email.email),
        }"
      />
      <label for="email">Почта пользователя</label>
      <input type="text" name="userGroup" id="userGroup" v-model.trim="group" />
      <label for="userGroup">Группа пользователя</label>
      <button type="submit">Создать</button>
    </form>
  </section>
</template>

<script>
import { email, required } from "vuelidate/lib/validators";
// import firebase from "firebase/app";
import password from "../../store/passGen";

export default {
  data() {
    return {
      email: "",
      password: password(),
      group: "",
      // db: firebase.firestore(),
    };
  },
  methods: {
    async onSubmit() {
      const creationData = {
        email: this.email,
        password: this.password,
        group: this.group,
      };
      try {
        await this.$store.dispatch("createUser", creationData);
        // this.$router.push("/about");
      } catch (error) {
        console.log(error.message);
      }
    },
  },
  validations: {
    email: { email, required },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.add-one-user {
  display: grid;
  height: calc(100vh - 100px);
  .add-one-user__form {
    // justify-self: center;
    // align-self: center;
    place-self: center;
    display: grid;
    gap: 20px;
    border: 1px solid #97999b;
    border-radius: 5px;
    padding: 0 30px 20px;
    max-width: 45%;
    input {
      margin-bottom: 5px;
      font-size: 24px;
      border: none;
      border-bottom: 1px solid #97999b;
      outline: none;
      padding: 5px 5px;
      text-align: center;
      &::placeholder {
        color: #ccc;
      }
    }
    .invalid {
      border-bottom: 1px solid rgb(236, 50, 50);
      transition: all 0.5s ease-in-out;
      color: rgb(236, 50, 50);
    }
    label {
      margin-bottom: 15px;
      align-self: start;
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
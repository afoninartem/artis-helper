<template>
  <section class="add-group-of-users">
    <form class="add-group-of-users__form">
      <h2>Добавить группу пользователей</h2>
      <input type="file" @change="onChange" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setLGroupOfUsers(collection) }}
            </div>
          </template>
        </xlsx-json>
      </xlsx-read>
    </form>
  </section>
</template>

<script>
import { XlsxRead, XlsxJson } from "vue-xlsx/dist/vue-xlsx.es";

import password from "../../store/passGen";
export default {
  components: {
    XlsxRead,
    XlsxJson,
  },
  data() {
    return {
      file: null,
    };
  },
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setLGroupOfUsers(data) {
      if (data) {
        //format to standart form and add to firestore users collection
        // console.log(data);
        Array.from(data).forEach((user) => {
          if (user.isMall === "true") {
            let userPassword = password();
            const newShop = {
              email: user.email,
              password: userPassword,
              group: "retail",
            };
            console.log(newShop)
            try {
              // this.$store.dispatch("createUser", newShop); //работает норм, пока заблочил
            } catch (error) {
              console.log(error.message);
            }
          }
        });
      }
    },
  },
};
</script>
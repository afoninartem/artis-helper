<template>
  <nav class="navbar">
    <button
      v-for="department in getDepartments"
      :key="department.name"
      class="navbar__btn menu"
      @click="
        toggleSidebar();
        pickDepartment({
          dept: department.name,
          depts: Object.keys(getDepartments),
          length: buttonsQuantity,
        });
      "
    >
      {{ department.title }}
    </button>
    <button class="navbar__btn menu" @click="signOut">Выйти</button>
  </nav>
</template>

<script>
export default {
  methods: {
    toggleSidebar() {
      return this.$store.commit("toggleSidebar");
    },
    pickDepartment(payload) {
      return this.$store.dispatch("pickSidebarContent", payload);
    },
    async signOut() {
      await this.$store.dispatch("logout");
      this.$router.push("/");
    },
  },
  computed: {
    getCurrentUser() {
      return this.$store.getters.getCurrentUser;
    },
    getDepartments() {
      return this.$store.getters.getDepartments;
    },
    buttonsQuantity() {
      return document.querySelectorAll(".menu").length;
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  router-link {
    text-decoration: none;
    vertical-align: middle;
    padding: 0px 15px;
    border: none;
    font-size: 22px;
    font-weight: bold;
    background: transparent;
    height: 100px;
    width: 150px;
    &:hover {
      background: #f5df4d;
      color: #97999d;
      cursor: pointer;
    }
  }
  button {
    padding: 0px 15px;
    border: none;
    font-size: 22px;
    font-weight: bold;
    background: transparent;
    height: 100px;
    width: 150px;
    &:hover {
      background: #f5df4d;
      color: #97999d;
      cursor: pointer;
    }
  }
}
</style>
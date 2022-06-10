<template>
  <nav class="navbar">
    <div
      class="admin-buttons"
      v-if="currentUser && currentUser.group === 'admin'"
    >
      <button
        v-for="department in getDepartments"
        :key="department.name"
        class="navbar__btn menu"
        @click.stop="
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
    </div>
    <div class="user-links" v-if="currentUser && currentUser.group !== 'admin'">
      <router-link
        class="user-links__item"
        v-for="service in getDepartments"
        :key="service.title"
        :to="service.link"
        >{{ service.title }}</router-link
      >
    </div>
    <button class="navbar__btn menu" @click="signOut">Выйти</button>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
    };
  },
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
    currentUser() {
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
  align-items: center;
  .user-links {
    display: flex;
    // align-items: center;
    .user-links__item {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 0px 15px;
      border: none;
      font-size: 18px;
      font-weight: bold;
      background: transparent;
      height: 100px;
      &:hover {
        background: #f5df4d;
        color: #97999d;
        cursor: pointer;
      }
    }
    // .active {
    //   background: #f5df4d;
    // }
    .router-link-active {
      background: #f5df4d;
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
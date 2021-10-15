<template>
  <div
    @click="closeSideBar"
    class="sidebar"
    v-if="isVisible"
    v-bind:style="{ right: `${setRightIndent}px` }"
  >
    <router-link
      class="sidebar__link"
      v-for="service in linkList"
      :key="service.title"
      :to="service.link"
      >{{ service.title }}</router-link
    >
  </div>
</template>


<script>
export default {
  name: "Sidebar",
  methods: {
    closeSideBar() {
      return this.$store.commit("hideSidebar");
    },
  },
  computed: {
    linkList() {
      return this.$store.getters.pickList;
    },
    isVisible() {
      return this.$store.getters.getSidebarState;
    },
    setSidebarDefaultPosition() {
      const headerHeight = document.querySelector(".header").clientHeight;
      document.querySelector(".sidebar").style.setProperty("top", headerHeight);
      return null;
    },
    setRightIndent() {
      return this.$store.getters.getIndent;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  display: grid;
  width: 150px;
  background: #97999b;
  z-index: 10;
  .sidebar__link {
    font-size: 20px;
    text-decoration: none;
    padding: 10px 10px;
  }
}
</style>
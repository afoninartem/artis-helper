<template>
  <div
    class="sidebar"
    v-if="isVisible"
    v-bind:style="{ right: `${setRightIndent}px` }"
    v-click-outside="setInvisible"
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
// @click.stop="closeSideBar"
import ClickOutside from 'vue-click-outside'
export default {
  name: "Sidebar",
  methods: {
    // closeSideBar() {
    //   return this.$store.commit("hideSidebar");
    // },
    setInvisible() {
      return this.$store.commit("hideSidebar");
    },
  },
  directives: {
    ClickOutside,
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
  border-radius: 5px;
  transform: translateY(5px);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.75);
  .sidebar__link {
    font-size: 20px;
    text-decoration: none;
    padding: 10px 10px;
    border-radius: 5px;
  }
}
</style>
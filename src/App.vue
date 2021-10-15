<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";

export default {
  components: {
    AuthLayout,
    MainLayout,
  },
  computed: {
    layout() {
      return this.$route.meta.layout || "AuthLayout";
    },
  },
  created: function() {
   return this.$store.dispatch("getCurrentUser");
  }  
};
</script>

<style lang="scss">
body {
  margin: 0 !important;
  padding: 0 !important;
}
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
}

.wrapper {
  width: 100%;
  margin: 0 auto;
  // border: 1px solid black;
}

a {
  font-weight: bold;
  // color: #2c3e50;
  color: #000;
  &:hover {
    color: #8d949c;
    background: #f5df4d;
  }
  &.router-link-exact-active {
    color: #8d949c;
    background: #f5df4d;
  }
}
</style>

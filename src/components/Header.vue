<template>
  <div class="header wrapper">
    <!-- <Logo /> -->
    <router-link to="/about" class="header__logo">ArtisHelper</router-link>
    <Navbar />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
// import Logo from "@/components/Logo";
export default {
  components: {
    Navbar,
    //  Logo
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 0px 0px 0px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #97999b;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.75);
  // position: sticky;
  // top: 0;
  // left: 0;
  z-index: 10;
  .header__logo {
    text-decoration: none;
    background: transparent;
    color: #2c3e50;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  // .header__nav {
  //   border: 1px solid red;
  // }
}
</style>
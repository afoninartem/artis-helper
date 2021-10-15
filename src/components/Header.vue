<template>
  <div class="header wrapper">
    <router-link to="/about" class="header__logo">ArtisHelper</router-link>
    <Navbar />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  components: {
    Navbar,
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 0px 0px 0px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #97999B;
  .header__logo {
    text-decoration: none;
    background: transparent;
    color: #2c3e50;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .header__nav {
    border: 1px solid red;
  }
}
</style>
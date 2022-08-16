<template>
  <div class="alien-positions" v-if="aliens.length">
    <h1>В отгрузку попали чужие материалы:</h1>
    <p>(или наши совсем закончились и не попали в выгрузку остатков)</p>
    <ul>
      <li v-for="alien, a in aliens" :key="a">
        {{alien.shop}} - {{alien.material}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    aliens() {
      return this.$store.getters.getALiens;
    }
  }
}
</script>

<style lang="scss" >
.alien-positions {
  width: 80%;
  top: 0;
  left: 0;
  background: #97999b;
  padding-bottom: 20px;
  margin: 0 auto;
  h1 {
    padding-top: 20px;
  }
  ul {
    list-style: none;
    li {
      padding: 5px;
      p {
        margin: 0;
        .name {
          font-weight: bold;
        }
        .left {
          font-weight: bold;
          color: red;
        }
      }
    }
  }
}
</style>
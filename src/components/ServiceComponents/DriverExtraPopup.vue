<template>
  <div class="popup" v-if="show">
    <div class="popup__content">
      <h1>{{ info.driver.name }}</h1>
      <h2>{{info.driver.car}}</h2>
      <button class="close-btn" @click.prevent="close">Закрыть</button>
    </div>
  </div>
</template>

<script>
// import ClickOutside from "vue-click-outside";
export default {
  name: "DriverExtraPopup",
  // directives: {
  //   ClickOutside,
  // },
  methods: {
    close() {
      return this.$store.dispatch("closeDriverExtraPopup");
    },
  },
  computed: {
    show() {
      return this.$store.getters.getDriverExtraPopupVisibility;
    },
    info() {
      return this.$store.getters.getDriverExtraPopupDetails;
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  position: absolute;
  top: 100px;
  bottom: 100px;
  left: 100px;
  right: 100px;
  background: #fff;
  border-radius: 25px;
  .content {
    position: relative;
    top: 20px;
    bottom: 20px;
    left: 20px;
    right: 20px;
    .close-btn {
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
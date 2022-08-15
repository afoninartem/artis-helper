<template>
  <div class="bg-markers">
    <h1>Маркировка отгружаемых позиций цветами</h1>
    <div class="bg-markers__content">
      <form action="">
        <input
          type="text"
          name="material"
          id="material"
          placeholder="Копия из 1С"
        />
        <input type="color" name="color" id="color" />
        <button @click.prevent="setMarker">Добавить маркировку</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      material: "",
      color: "",
    };
  },
  methods: {
    async addMarker() {
      if (!this.material || !this.color)
        return alert("Необходимо заполнить оба поля");
      return await this.$store.dispatch("addMarker", {
        material: this.material,
        color: this.color,
      });
    },
  },
};
</script>
<template>
  <div class="testing">
    <h1>Поиск по номеру телефона</h1>
    <form action="">
      <input
        type="tel"
        name=""
        id=""
        v-model="phone"
        placeholder="79991112233"
      />
      <button @click.prevent="checkTests">Проверить</button>
    </form>
    <div class="testing__results">
      <h2 v-if="candidate.length && !results.length">
        Кандидат еще не проходил тестирование
      </h2>
      <div v-if="results.length"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: "",
      candidate: [],
      results: [],
    };
  },
  computed: {
    parsedResults() {
      return this.results.map(result => JSON.parse(result.results))
    }
  },
  methods: {
    async checkTests() {
      const candidates = await fetch("http://localhost:8080/api/candidates")
        .then((res) => res.json())
        .then((data) => data);
      console.log(candidates);
      this.candidate = candidates.filter(
        (candidate) => candidate.phone === this.phone
      );
      if (this.candidate.length) {
        this.results = await fetch(
          `http://localhost:8080/api/results?id=${this.candidate[0].id}`
        )
          .then((res) => res.json())
          .then((data) => data);
      }
    },
  },
};
</script>
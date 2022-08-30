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
      <div v-if="results.length">
        <ul>
          <li v-for="(item, i) in parsedResults" :key="i">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Тест</th>
                  <th v-for="(question, q) in item.parsed" :key="q">
                    {{ question.question }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ dateConverter(item.test_date) }}</td>
                  <td>{{ item.test }}</td>
                  <td
                    :style="{
                      background: question.answerisCorrect ? `rgba(113, 223, 141, 0.8)` : `rgba(206, 106, 106, 0.8)`,
                    }"
                    v-for="(question, q) in item.parsed"
                    :key="q"
                  >
                    {{ question.time }}
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.testing {
  form {
    margin-bottom: 50px;
  }
  .testing__results {
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      li {
        table {
          // border-collapse: collapse;
          border-spacing: 0;
          border-radius: 5px;
          th, td {
            padding: 5px 10px;
          }
          thead, td {
            background: rgba(107, 150, 190, 0.8);
          }

        }
      }
    }
  }
}
</style>

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
      return this.results
        .map((result) =>
          Object.assign(result, { parsed: JSON.parse(result.results) })
        )
        .reverse();
    },
  },
  methods: {
    dateConverter(str) {
      const converter = require("../../store/dateHandler");
      return converter.localeStringToReadableFormat(str);
    },
    async checkTests() {
      const candidates = await fetch("http://localhost:3000/api/candidates")
        .then((res) => res.json())
        .then((data) => data);
      console.log(candidates);
      this.candidate = candidates.filter(
        (candidate) => candidate.phone === this.phone
      );
      if (this.candidate.length) {
        this.results = await fetch(
          `http://localhost:3000/api/results?id=${this.candidate[0].id}`
        )
          .then((res) => res.json())
          .then((data) => data);
      }
    },
  },
};
</script>


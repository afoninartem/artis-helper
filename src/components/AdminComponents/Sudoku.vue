<template>
  <div class="sudoku">
    <h1>Sudoku!</h1>
    <div class="choose-size" @click.prevent="chooseSize" v-if="!this.size">
      <div class="option 9">9х9</div>
      <div class="option 16">16х16</div>
      <div class="option 25">25х25</div>
    </div>
    <div
      class="choose-mode"
      @click.prevent="chooseMode"
      v-if="this.size && !this.mode"
    >
      <div class="option 1">Легко</div>
      <div class="option 2">Средне</div>
      <div class="option 3">Тяжело</div>
    </div>
    <div class="gameboard" v-if="ready">
      <!-- <div class="row" v-for="row, i in board" :key="`row-${i}`">
        <div class="cell" v-for="cell, c in row" :key="`cell-${c}`">
          {{cell}}
        </div>
      </div> -->
      {{board ? board.length : null}}
      <div class="grid-board">
        <div class="grid-board__item" v-for="cell, i in board" :key="i">
          {{cell.value}}
        </div>
      </div>
      <!-- <table>
        <tbody>
          <tr v-for="row, i in board" :key="`row-${i}`">
            <td v-for="cell, c in row" :key="`cell-${c}`"> {{cell}}</td>
          </tr>
        </tbody>
      </table> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      size: null,
      mode: null,
    };
  },
  methods: {
    chooseSize(event) {
      this.size = +event.target.classList[1];
    },
    chooseMode(event) {
      this.mode = +event.target.classList[1];
    },
    async start() {
      await this.$store.dispatch("generateGameBoard", {
        size: this.size,
        mode: this.mode,
      });
      await this.$store.dispatch("swapRows")
    },
  },
  computed: {
    ready() {
      if (this.size && this.mode) this.start();
      return { size: this.size, mode: this.mode };
    },
    board() {
      return this.$store.getters.getBoard;
    }
  },
};
</script>

<style lang="scss" scoped>
.sudoku {
  display: flex;
  flex-direction: column;
  align-items: center;
  .choose-size,
  .choose-mode {
    display: flex;
    gap: 30px;
  }
  .option {
    border: 1px solid black;
    width: 150px;
    height: 150px;
    display: grid;
    place-items: center;
    cursor: pointer;
    font-size: 36px;
  }
  .grid-board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 1px;
    padding: 10px;
    .grid-board__item {
      padding: 5px;
      width: 50px;
      height: 50px;
      border: 1px solid black;
      font-size: 36px;
    }
  }
}
</style>
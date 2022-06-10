<template>
  <div class="warehouse-needs">
    <h1>Потребность склада</h1>
    <form action="" class="add-request" v-if="user === `admin`">
      <label for="name">Материал:</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Название"
        v-model.trim="newRequest.name"
      />
      <label for="quantity">Количество:</label>
      <input
        type="text"
        name="quantity"
        id="quantity"
        placeholder="В штуках"
        v-model.trim="newRequest.quantity"
      />
      <label for="reserve">Запас до:</label>
      <input
        type="date"
        name="reserve"
        id="reserve"
        v-model.trim="newRequest.reserve"
      />
      <label for="urgent">Срочно?</label>
      <input
        type="checkbox"
        name="urgent"
        id="urgent"
        v-model.trim="newRequest.urgent"
      />
      <button class="submit" @click.prevent="addRequest">Добавить</button>
    </form>
    <div class="warehouse-needs__content">
      <div class="requests" v-if="requests">
        <h2>
          В ожидании заказа {{ requests.length }}
          {{ this.casesHandler(requests.length, "заявка") }}:
        </h2>
        <ul>
          <li v-for="(req, i) in requests" :key="`request-${i}`">
            <div class="requests__item">
              <h4
                @click.prevent="showPopUp(req, `edit`)"
                v-if="user === `admin`"
              >
                {{ req.name }}
              </h4>
              <h4 v-if="user !== `admin`">{{ req.name }}</h4>
              <p>Заявка от {{ req.created }}</p>
              <p>Заказано: {{ req.ordered ? req.ordered : `Нет` }}</p>
              <p>
                Заказать: {{ Number(req.quantity).toLocaleString("ru-Ru") }}
              </p>
              <p>Доставить до: {{ req.deadline }}</p>
              <p v-if="req.daysLeft >= 0">
                Осталось {{ req.daysLeft }}
                {{ casesHandler(req.daysLeft, "день") }}
              </p>
              <p v-if="req.daysLeft < 0" class="overdue">
                Просрочено на {{ Math.abs(req.daysLeft) }}
                {{ casesHandler(Math.abs(req.daysLeft), "день") }}
              </p>
              <div class="buttons">
                <button @click.prevent="showPopUp(req, `createOrder`)">
                  Заказано
                </button>
                <button @click.prevent="showPopUp(req, `denyRequest`)">
                  Отказано
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="orders" v-if="orders">
        <h2>
          В работе {{ orders.length }}
          {{ this.casesHandler(orders.length, "заказ") }}:
        </h2>
        <ul>
          <li v-for="(ord, o) in orders" :key="`order-${o}`">
            <div class="orders__item">
              <h4>{{ ord.name }}</h4>
              <p>Заявка от {{ ord.created }}</p>
              <p>Заказано: {{ ord.ordered }}</p>
              <p>
                Заказать: {{ Number(ord.quantity).toLocaleString("ru-Ru") }}
              </p>
              <p>Доставить до: {{ ord.deadline }}</p>
              <p v-if="ord.daysLeft >= 0">
                Осталось {{ ord.daysLeft }}
                {{ casesHandler(ord.daysLeft, "день") }}
              </p>
              <p v-if="ord.daysLeft < 0" class="overdue">
                Просрочено на {{ Math.abs(ord.daysLeft) }}
                {{ casesHandler(Math.abs(ord.daysLeft), "день") }}
              </p>
              <div class="buttons">
                <button @click.prevent="showPopUp(ord, `gotOrder`)">
                  Поступило на склад
                </button>
                <button @click.prevent="showPopUp(ord, `backToRequest`)">
                  Вернуть в заявки
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <NeedsPopUp />
  </div>
</template>

<script>
import NeedsPopUp from "@/components/MarketingComponents/needs/NeedsPopUp.vue";
export default {
  components: {
    NeedsPopUp,
  },
  data() {
    return {
      newRequest: {
        name: null,
        quantity: null,
        reserve: null,
        urgent: false,
        inProgress: false,
        created: null,
        ordered: null,
      },
    };
  },

  methods: {
    async showPopUp(data, context) {
      await this.$store.dispatch("showPopUp", { data, context });
    },
    async addRequest() {
      if (
        this.newRequest.name &&
        this.newRequest.quantity &&
        this.newRequest.reserve
      ) {
        const quan = this.newRequest.quantity.match(/\d+/);
        if (quan) {
          const req = Object.assign(this.newRequest, { id: Date.now() });
          await this.$store.dispatch("createNewRequest", req);
          await this.$store.dispatch("updateNeedsDate");
          await this.$store.dispatch("setActualNeeds");
        } else {
          alert(
            `Количество должно быть числом, а Вы указали - ${this.newRequest.quantity}`
          );
        }
      } else {
        alert(`Необходимо заполнить все поля формы!`);
      }
    },
    casesHandler(num, word) {
      const ch = require("../../store/casesHandler");
      return ch(num, word);
    },
  },

  computed: {
    user() {
      const userGroup = localStorage.getItem("RT")
        ? JSON.parse(localStorage.getItem("RT")).group
        : null;
      return userGroup;
    },
    needs() {
      return this.$store.getters.getActualStates.needs?.map((req) => {
        const date = new Date(req.reserve);
        const millis = date.getTime();
        const daysLeft =
          1 + Math.floor((millis - Date.now()) / (24 * 60 * 60 * 1000));
        return Object.assign(req, {
          daysLeft,
        });
      });
    },
    requests() {
      return this.needs
        ? Array.from(this.needs).filter((f) => !f.ordered)
        : null;
    },
    orders() {
      return this.needs
        ? Array.from(this.needs).filter((f) => f.ordered)
        : null;
    },
  },

  mounted: async function () {
    await this.$store.dispatch("setActualNeeds");
  },
};
</script>


<style lang="scss" scoped>
@import "@/scss/multiButtons.scss";
@include multi-buttons;
.add-request {
  display: grid;
  padding: 20px;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: max-content;
  margin: 0 auto;

  label {
    text-align: right;
    // vertical-align: middle;
    // display: grid;
    // place-content: center;
  }
  input {
    // width: max-content;
    text-align: center;
    width: 150px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none; // не работает в FF почему-то
    margin: 0;
  }

  .submit {
    grid-column: 1/3;
  }
}
.overdue {
  color: red;
}
.warehouse-needs__content {
  display: flex;
  justify-content: space-between;
  .requests,
  .orders {
    width: 100%;
    ul {
      list-style: none;
      // display: flex;
      // flex-direction: column;
      // gap: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
      li {
        .requests__item,
        .orders__item {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 0;
          h4 {
            background: rgba(16, 189, 219, 0.562);
            padding: 10px;
            margin: 0;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
          }
          .buttons {
            display: flex;
            justify-content: space-between;
            button {
              width: 100%;
              padding: 5px;
              border: none;
              transition: width 0.5s ease-in-out 100ms,
                background 0.5s ease-in-out 100ms;
              font-weight: bold;
              cursor: pointer;
              &:first-child {
                &:hover {
                  width: 175%;
                  background: rgba(133, 175, 139, 0.5);
                }
              }
              &:last-child {
                &:hover {
                  width: 175%;
                  background: rgba(165, 72, 77, 0.5);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
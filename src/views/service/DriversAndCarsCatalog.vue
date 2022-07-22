<template>
  <div class="catalog" v-if="cars">
    <div class="catalog__cars">
      <h1>Справочник машин</h1>
      <div class="menu">
        <button @click.prevent="addCar">Добавить машину</button>
      </div>
      <!-- <PrintShedule /> -->
      <table>
        <thead>
          <tr>
            <th>Марка</th>
            <th>Номер</th>
            <th>Экипаж</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(car, c) in cars" :key="c">
            <td class="car-info" @click.prevent="openChangeCarPopup(car)">
              {{ car.mark.toUpperCase() }}
            </td>
            <td class="car-info" @click.prevent="openChangeCarPopup(car)">
              {{ car.number }}
            </td>
            <td @click.prevent="openCarCrewPopup(car.carID)" class="crew">
              <div v-if="car.crew.length">
                <p v-for="(member, m) in car.crew" :key="m">
                  <span
                    v-if="drivers.filter((d) => d.driverID === member).length"
                    >{{
                      drivers.filter((d) => d.driverID === member)[0].name
                    }}</span
                  >
                  -
                  <span
                    v-if="drivers.filter((d) => d.driverID === member).length"
                    >{{
                      drivers
                        .filter((d) => d.driverID === member)[0]
                        .position.toLowerCase()
                    }}</span
                  >
                </p>
              </div>
              <div v-if="!car.crew.length">
                <p>Никто не закреплён за машиной</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="catalog__drivers" v-if="drivers">
      <h1>Справочник сотрудников доставки</h1>
      <!-- <AddDriversCatalog /> -->
      <!-- <button @click.prevent="addDriver">Добавить сотрудника</button> -->
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Машина</th>
            <th>График</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(driver, d) in drivers" :key="d">
            <td>{{ d + 1 }}</td>
            <td>{{ driver.name }}</td>
            <td>{{ driver.position }}</td>
            <td>
              <p
                v-for="(car, c) in driver.carslist"
                :key="c"
                class="car"
                @click.prevent="openCarCrewPopup(car.carID)"
              >
                {{ typeof car == "string" ? car : car.car }}
              </p>
            </td>
            <td @click.prevent="openShedulePopup(driver.name)" class="shedule">
              <p v-for="(shedule, s) in driver.carslist" :key="s">
                <span>{{ shedule.car }}</span> -
                <span>{{ shedule.sheduleType || `не указан` }}</span>
                <span v-if="shedule.sheduleType === `2/2/3`">
                  смена {{ shedule.sheduleShift }}</span
                >
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AddCarPopUp />
    <CarCrewPopUp />
    <ShedulePopUp />
    <AddPositionPopup />
  </div>
</template>

<script>
import AddCarPopUp from "@/components/ServiceComponents/AddCarPopUp";
import CarCrewPopUp from "@/components/ServiceComponents/CarCrewPopUp";
import ShedulePopUp from "@/components/ServiceComponents/ShedulePopUp";
import AddPositionPopup from "@/components/ServiceComponents/AddPositionPopup";
// import PrintShedule from "@/components/ServiceComponents/PrintShedule";
// import AddDriversCatalog from "@/components/PersonalComponents/AddDriversCatalog";
export default {
  components: {
    AddCarPopUp,
    CarCrewPopUp,
    ShedulePopUp,
    AddPositionPopup,
    // PrintShedule,
    // AddDriversCatalog,
  },
  methods: {
    async addCar() {
      return await this.$store.dispatch("openCarPopup");
    },
    async openCarCrewPopup(car_id) {
      return await this.$store.dispatch("openCarCrewPopup", car_id);
    },
    async openShedulePopup(name) {
      return await this.$store.dispatch("openShedulePopup", name);
    },
    async openAddPositionPopup() {
      return await this.$store.dispatch("openAddPositionPopup");
    },
    async openChangeCarPopup(car) {
      return await this.$store.dispatch("openChangeCarPopup", car);
    },
  },
  computed: {
    drivers() {
      return this.$store.getters.getActualStates.catalogDrivers
        ? Array.from(this.$store.getters.getActualStates.catalogDrivers)
            .filter((driver) => {
              return driver.carslist && driver.carslist.length;
            })
            .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
        : null;
    },
    cars() {
      return this.$store.getters.getActualStates.catalogCars && this.drivers
        ? Array.from(this.$store.getters.getActualStates.catalogCars)

            // .map((car) => {
            // return car.crew.map(cm => this.drivers.filter(d => d.driverID === cm)[0])
            // })
            .sort((a, b) =>
              a.number > b.number ? 1 : b.number > a.number ? -1 : 0
            )
        : null;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCatalogDrivers");
    await this.$store.dispatch("setActualCatalogCars");
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
.crew,
.shedule,
.car-info,
.car {
  cursor: pointer;
  &:hover {
    background: rgba(133, 177, 133, 0.534);
    font-weight: bold;
  }
}
</style>
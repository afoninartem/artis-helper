<template>
  <div
    class="catalog"
    v-if="cars"
  >
    <div class="catalog__cars">
      <h1>Справочник машин</h1>
      <div class="menu">
        <button @click.prevent="addCar">Добавить машину</button>
        <button @click.prevent="addDriver">Добавить сотрудника</button>
        <!-- <button @click.prevent="buggedDriver">Fix сотрудника</button> -->
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
          <tr
            v-for="(car, c) in cars"
            :key="c"
          >
            <td
              class="car-info"
              @click.prevent="openChangeCarPopup(car)"
            >
              {{ car.mark.toUpperCase() }}
            </td>
            <td
              class="car-info"
              @click.prevent="openChangeCarPopup(car)"
            >
              {{ car.number }}
            </td>
            <td
              @click.prevent="openCarCrewPopup(car.carID)"
              class="crew"
            >
              <div v-if="car.crew.length">
                <p
                  v-for="(member, m) in car.crew"
                  :key="m"
                >
                  <span v-if="drivers.filter((d) => d.driverID === member).length">{{
                      drivers.filter((d) => d.driverID === member)[0].name
                    }}</span>
                  -
                  <span v-if="drivers.filter((d) => d.driverID === member).length">{{
                      drivers
                        .filter((d) => d.driverID === member)[0]
                        .carslist.filter((cl) => cl.carID === car.carID)[0]
                        .position
                    }}</span>
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
    <div
      class="catalog__drivers"
      v-if="drivers"
    >
      <h1>Справочник сотрудников доставки</h1>
      <!-- <AddDriversCatalog /> -->
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
          <tr
            v-for="(driver, d) in drivers"
            :key="d"
          >
            <td>{{ d + 1 }}</td>
            <td
              @click.prevent="openShedulePopup(driver.driverID)"
              class="driver"
              :class="[driver.tin ? null : 'no-tin']"
            >{{ driver.name }}</td>
            <td>{{ driver.mainPosition }}</td>
            <td>
              <p
                v-for="(car, c) in driver.carslist.filter(car => car.carID)"
                :key="c"
                class="car"
                @click.prevent="openCarCrewPopup(car.carID)"
              >
                {{ typeof car == "string" ? car : car.car }}
              </p>
            </td>
            <td
              @click.prevent="openShedulePopup(driver.driverID)"
              class="shedule"
            >
              <p
                v-for="(shedule, s) in driver.carslist"
                :key="s"
              >
                <span>{{ shedule.car }}</span> -
                <span>{{ shedule.sheduleType || `не указан` }}</span>
                <span v-if="shedule.sheduleType === `2/2/3`">
                  смена {{ shedule.sheduleShift }}</span>
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
    <AddDriverPopup />
  </div>
</template>

<script>
import { db } from "../../main.js";
import AddCarPopUp from "@/components/ServiceComponents/AddCarPopUp";
import CarCrewPopUp from "@/components/ServiceComponents/CarCrewPopUp";
import ShedulePopUp from "@/components/ServiceComponents/ShedulePopUp";
import AddPositionPopup from "@/components/ServiceComponents/AddPositionPopup";
import AddDriverPopup from "@/components/ServiceComponents/AddDriverPopup";
// import PrintShedule from "@/components/ServiceComponents/PrintShedule";
// import AddDriversCatalog from "@/components/PersonalComponents/AddDriversCatalog";
export default {
  components: {
    AddCarPopUp,
    CarCrewPopUp,
    ShedulePopUp,
    AddPositionPopup,
    AddDriverPopup,
    // PrintShedule,
    // AddDriversCatalog,
  },
  methods: {
    async addCar() {
      return await this.$store.dispatch("openCarPopup");
    },
    async addDriver() {
      return await this.$store.dispatch("openAddDriverPopup");
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
    // async fixExtras() {
    //   if (!this.drivers) return;
    //   this.drivers.forEach(async (driver) => {
    //     driver.extras = [];
    //     driver.carslist.forEach(cl => delete cl.extras)
    //     await db
    //       .collection("service/catalog/drivers_JSON")
    //       .doc(driver.driverID)
    //       .update({ json: JSON.stringify(driver) });
    //   });
    //   localStorage.removeItem("catalogDriversLastUpdateLS");
    // },
    // async buggedDriver() {
    //   const driver = this.$store.getters.getActualStates.catalogDrivers
    //     ? Array.from(this.$store.getters.getActualStates.catalogDrivers).filter(
    //         (d) => d.driver
    //       )[0].driver
    //     : null;
    //   await db
    //     .collection("service/catalog/drivers_JSON")
    //     .doc(driver.driverID)
    //     .set({
    //       json: JSON.stringify({
    //         ...driver,
    //       }),
    //     });
    // },
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
              +a.number > +b.number ? 1 : +b.number > +a.number ? -1 : 0
            )
            .filter((car) => car.number.length && car.crew.length)
        : null;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCatalogDrivers");
    await this.$store.dispatch("setActualCatalogCars");

    // const catalogCarsLastUpdateLS = localStorage.getItem(
    //   "catalogCarsLastUpdateLS"
    // );
    // const catalogDriversLastUpdateLS = localStorage.getItem(
    //   "catalogDriversLastUpdateLS"
    // );
    // console.log(catalogCarsLastUpdateLS >= catalogDriversLastUpdateLS);
    // console.log(
    //   `catalogCarsLastUpdateLS: ${catalogCarsLastUpdateLS}; catalogDriversLastUpdateLS: ${catalogDriversLastUpdateLS}`
    // );

    const cars = this.cars.filter(
      (car) => car.number.length && car.crew.length
    );
    const carsIdList = cars.map((c) => c.carID);

    this.drivers.forEach(async (driver) => {
      const currCarslistLength = driver.carslist.length;
      let currCarslistCarNumber, newCarslistCarNumber;
      const filteredCarslist = driver.carslist.filter((cl) =>
        carsIdList.includes(cl.carID)
      );
      const updatedCarslist = filteredCarslist.map((f) => {
        const currCar = cars.filter((car) => car.carID === f.carID)[0];
        currCarslistCarNumber, (newCarslistCarNumber = f.car), currCar.number;
        f.car = currCar.number;
        // console.log(f);
        return f;
      });
      driver.carslist = updatedCarslist;
      // console.log(
      //   filteredCarslist.length != currCarslistLength ||
      //     currCarslistCarNumber != newCarslistCarNumber
      // );
      // console.log(currCarslistCarNumber, newCarslistCarNumber);
      if (
        filteredCarslist.length != currCarslistLength ||
        currCarslistCarNumber != newCarslistCarNumber
      ) {
        await db
          .collection("service/catalog/drivers_JSON")
          .doc(driver.driverID)
          .update({ json: JSON.stringify(driver) });
      }
    });
    // console.log(cars, drivers);
    // localStorage.setItem(
    //   "catalogDriversLastUpdateLS",
    //   JSON.stringify(Date.now())
    // );
    // localStorage.setItem("actualCatalogDrivers", JSON.stringify(drivers));
    await this.$store.dispatch("updateCatalogDriversDate");
    await this.$store.dispatch("setActualCatalogDrivers");
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
.crew,
.driver,
.shedule,
.car-info,
.car {
  cursor: pointer;
  &:hover {
    background: rgba(133, 177, 133, 0.534);
    font-weight: bold;
  }
}
.no-tin::after {
  content: "не заполнен ИНН";
  position: relative;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: rgba(204, 204, 204, .4);
  color: red;
  padding: 4px;
  right: -5px;
  font-weight: bold;

}
</style>
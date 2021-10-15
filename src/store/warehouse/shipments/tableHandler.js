export default {
  state: {
    tableBody: null,
    tableHeader: `<div class="table__header-item">№</div><div class="table__header-item">Машина</div>
    <div class="table__header-item">Салон</div>
    <div class="table__header-item">Кат. 80</div>
    <div class="table__header-item">Кат. 20</div>
    <div class="table__header-item">Блок.</div>
    <div class="table__header-item">Кружки</div>
    <div class="table__header-item">Упак.</div>
    <div class="table__header-item">Папки</div>
    <div class="table__header-item" v-if="towels">Полот</div>
    <div class="table__header-item">Шамп.</div>
    <div class="table__header-item">Другое</div>
    <div class="table__header-item">П/П</div>
    <div class="table__header-item">Заявка</div>
  `,
    testHTML: null,
  },
  mutations: {
    fillTableBody(state, payload) {
      state.tableBody = payload;
    },
    testSet(state, payload) {
      state.testHTML = payload;
    },
  },
  actions: {
    async createTable({ commit, getters }) {
      const room = getters.getRoomMaterials;
      let html = [];
      const allShipments = getters.getTableSwitcherState;
      const activeRegion =
        allShipments.filter((el) => el.active).length === 1
          ? allShipments.filter((el) => el.active)[0].region
          : null;
      const shipment = getters.getSortedShipment;
      const currentData = shipment[activeRegion];
      currentData.forEach((shop, i) => {
        //number of row
        const num = `<div class="cell num">${i + 1}</div>`;
        //car name
        const car = `<div class="cell car">${shop.car}</div>`;
        //shop name
        const shopName = `<div class="cell shop-name">${shop.name}</div>`;
        //thick catalogs
        const thickCatalog = shop.thickCatalog
          ? `<div class="cell thick"><p>${shop.thickCatalog.quan}</p><p>${shop.thickCatalog.region}</p></div>`
          : `<div class="cell thick"></div>`;
        //thin catalogs
        const thinCatalog = shop.thinCatalog
          ? `<div class="cell thin"><p>${shop.thinCatalog.quan}</p><p>${shop.thinCatalog.region}</p></div>`
          : `<div class="cell thin"></div>`;
        //notebooks
        const notebook = shop.notebook
          ? `<div class="cell notebook">${shop.notebook}</div>`
          : `<div class="cell notebook"></div>`;
        //cups
        const cup = shop.cup
          ? `<div class="cell cup">${shop.cup}</div>`
          : `<div class="cell cup"></div>`;
        //pack
        const pack = shop.pack
          ? `<div class="cell pack">${shop.pack}</div>`
          : `<div class="cell pack"></div>`;
        //folder
        const folder = shop.folder
          ? `<div class="cell folder">${shop.folder}</div>`
          : `<div class="cell folder"></div>`;
        //towels
        const towel = shop.towel
          ? `<div v-if="towels" class="cell towel">${shop.towel}</div>`
          : `<div v-if="towels" class="cell towel"></div>`;
        //vine
        const vine = shop.vine
          ? `<div class="cell vine">${shop.vine}</div>`
          : `<div class="cell vine"></div>`;
        //other materials
        let otherMats = ``;
        if (shop.otherMats) {
          Array.from(shop.otherMats).forEach((mat) => {
            otherMats += `<p class=${
              room.includes(mat.name)
                ? "other-material"
                : "other-material warehouse-stored"
            }>${mat.name} - ${mat.quan}</p>`;
          });
        }
        //boxes
        const boxes = `<div></div>`;
        //orders
        let orders = ``;
        shop.orders.forEach((order) => {
          order.picked
            ? (orders += `<div class="order room-is-done">Р-${
                order.name.match(/\d+/)[0]
              }</div>`)
            : (orders += `<div class="order">Р-${
                order.name.match(/\d+/)[0]
              }</div>`);
          // order.comment ? order.comment.includes(`213`) ? orders += `<div class="order room-is-done">Р-${order.name.match(/\d+/)[0]}</div>`
        });
        html.push(
          `${num}${car}${shopName}${thickCatalog}${thinCatalog}${notebook}${cup}${pack}${folder}${towel}${vine}<div class="other">${otherMats}</div>${boxes}<div>${orders}</div>`
        );
      });
      commit("fillTableBody", html);
    },
  },
  getters: {
    getTestHTML: (state) => {
      return state.testHTML;
    },
    getTableHeader: (state) => {
      return state.tableHeader;
    },
    getTableBody: (state) => {
      return state.tableBody;
    }
  },
};

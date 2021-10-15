<template>
  <div class="about">
    <p>
      <span
        >Приложение ArtisHelper предназначено для автоматизации рутинных задач,
        стоящих перед сотрудниками компании.</span
      >
      <span
        >Оно помогает экономить время, выполняя монотонную работу с таблицами и
        не только.</span
      >
      <span
        >С его помощью ведется учет рабочего времени, производятся отгрузки
        рекламной продукции,</span
      >
      <span>собирается отчетность по акциям, поступлениям и много другое.</span>
      <br />
      <span
        >Ознакомиться с возможностями и способом работы можно в разделе
        <router-link to="/help">Помощь</router-link></span
      >
    </p>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style lang="scss" scoped>
.about {
  height: 75vh;
  display: grid;
  place-content: center;
  p {
    font-size: 22px;
    display: grid;
    gap: 10px;
    a {
      &:hover {
        background: transparent;
      }
    }
  }
}
</style>

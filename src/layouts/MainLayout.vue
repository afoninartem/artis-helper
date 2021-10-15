<template>
  <div class="main-layout">
    <Header />
    <Sidebar />
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default {
  components: {
    Sidebar,
    Header,
  },
};
</script>
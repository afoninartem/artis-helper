<template>
  <section class="stickers">
    <div class="stickers__shipment">
      <StickersShipment />
    </div>
    <div class="stickers__gifts">
      <StickersGifts />
    </div>
    <div class="stickers__custom">
      <form action=""></form>
    </div>
    
  </section>
</template>

<script>
import StickersGifts from "@/components/WarehouseComponents/StickersGifts";
import StickersShipment from "@/components/WarehouseComponents/StickersShipment";
export default {
  components: {
    StickersGifts,
    StickersShipment,
  },
};
</script>
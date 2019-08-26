<template>
  <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright" class="wrapper">
    <div class="menu-container" ref="menuContainer">
      这个是内容
    </div>
  </v-touch>
</template>
<script>
export default {
  name: 'Queue',
  data () {
    return {
    }
  },
  methods: {
    swiperleft: function () {
      console.log(666)
    },
    swiperright: function () {
      console.log(777)
    }
  }
}
</script>

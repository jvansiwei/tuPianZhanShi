<template>
  <div>
      <pull-to @infinite-scroll="loadmore">
    <ul class="list">
      <li v-for="(item, index) in dataList" :key="index">
        {{ item }}
      </li>
    </ul>
    <div class="loading-bar">
      <svg class="icon icon-loading"
           aria-hidden="true">
        <use xlink:href="#icon-loading"></use>
      </svg>
      加载中...
    </div>
  </pull-to>
  </div>
</template>

<script>
import PullTo from 'vue-pull-to'

export default {
  name: 'example',
  components: {
    PullTo
  },
  data () {
    return {
      dataList: [1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1],
      iconLink: ''
    }
  },
  methods: {
    loadmore (loaded) {
      console.log('565656')
      this.dataList += this.dataList
    }
  }
}
</script>
<style scoped>
  .loading-bar {
    height: 40px;
    text-align: center;
    line-height: 40px;
  }
  .icon-loading {
    transform: rotate(0deg);
    animation-name: loading;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  @keyframes loading
  {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
</style>

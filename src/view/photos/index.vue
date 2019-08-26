<template>
  <div>
    <!-- <pull-to @infinite-scroll="loadmore"> -->
      <img class="image" @click="$router.push('/')" src="../../assets/lunhua.jpg">
      <div>
        <span class="span">{{title}}</span>
      </div>
      <div>
        <span class="span1 el-icon-picture">{{table_all.length}}张</span>
        <!-- <i></i> -->
        <span v-if="total>=1000" class="span1 el-icon-user-solid">{{(total/10000).toFixed(2)}}万次</span>
        <span v-else class="span1 el-icon-user-solid">{{0.10}}万次</span>
      </div>
      <div v-if="table_all.length==0">暂无数据</div>
        <el-row style="overflow:auto">
          <el-col v-for="(item, index) in table" :key="index" :span="8" >
            <el-card :body-style="{ padding: '0px' }">
              <!-- <el-image :src="item" class="images" fit="cover" /> -->
              <el-image @click="clicks(item,index)" :src="item" class="images" fit="cover">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </el-card>
          </el-col>
        </el-row>
      <el-dialog :fullscreen="true" :visible.sync="dialogVisible">
        <v-touch v-on:swipeleft="jia" v-on:swiperight="jian" class="wrapper">
          <div class="dialog" style="height:100vh">
            <!-- <div style="width:8%;height:100%;float:left">
              <div style="top:50%;position: relative;margin-top:-15px" @click="jian">
                <span style="font-size:20px">👈</span>
              </div>
            </div> -->
            <img class="img" width="100%;float:left" :src="form.image" alt="">
            <!-- <div style="width:8%;height:100%;float:right">
              <div style="top:50%;position: relative;margin-top:-15px" @click="jia">
                <span style="font-size:20px">👉</span>
              </div>
            </div> -->
          </div>
         </v-touch>
      </el-dialog>
      <div v-if="!dialogVisible" style="width:100px;height:50px;position:fixed;right:0;bottom:50px;z-index:999">
        <el-button style="opacity:0.8" type="primary" size="mini" icon="el-icon-top" @click="up"></el-button>
      </div>
      <!-- <div class="loading-bar">
        <svg class="icon icon-loading"
            aria-hidden="true">
          <use xlink:href="#icon-loading"></use>
        </svg>
        <span v-if="k<table_all.length">加载中...</span>
        <span v-else>已加载全部数据</span>
      </div> -->
    <!-- </pull-to> -->
  </div>
</template>

<script>
// import PullTo from 'vue-pull-to'
export default {
  name: 'Photos',
  // components: {
  //   PullTo
  // },
  data () {
    return {
      height: 400,
      iconLink: '',
      total: 1024,
      dialogVisible: false,
      url: 'http://moveclub-file.oss-cn-hangzhou.aliyuncs.com/mpms/20190724/1563935439-5d37c2cfb2d60.jpeg?x-oss-process=image/crop,x_0,y_0,w_1600,h_1000',
      table: [],
      title: '',
      number: 0,
      table_all: [],
      form: {
        index: 0,
        image: ''
      },
      length: 0,
      k: 0
    }
  },
  watch: {
    'k' () {
      console.log(this.k + '安思危')
    }
  },
  created () {
    var timestamp = (new Date()).getTime()
    console.log(timestamp)
    if (localStorage.getItem('photos')) {
      var time = localStorage.getItem('time')
      console.log(time)
      this.title = localStorage.getItem('title')
      this.total = (timestamp - time) / 1000
      console.log(this.total)
      this.getData()
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    swiperleft: function () {
      console.log(666)
    },
    swiperright: function () {
      console.log(777)
    },
    loadmore (loaded) {
      var _this = this
      console.log('666')
      console.log(_this.k)
      let j = 0
      if (_this.k + 20 > _this.table_all.length) {
        j = _this.table_all.length
      } else {
        j = _this.k + 20
      }
      for (let i = _this.k; i < j; i++) {
        console.log(i)
        _this.getImage1(_this.table_all[i])
      }
    },
    up () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    clicks (item, index) {
      this.form.index = index
      this.form.image = item
      this.dialogVisible = true
    },
    jia () {
      if (this.form.index < this.table.length - 1) {
        this.form.index++
        this.form.image = this.table[this.form.index]
      } else {
        this.$message.success({
          duration: 2000,
          message: '已经是最后一张图片'
        })
      }
    },
    jian () {
      if (this.form.index > 0) {
        this.form.index--
        this.form.image = this.table[this.form.index]
      } else {
        this.$message.success({
          duration: 2000,
          message: '已经是第一张图片'
        })
      }
    },
    tiaozhuan (val) {
      this.$router.push({
        path: '/',
        query: {
          name: val.name
        }
      })
    },
    async getData () {
      var Minio = require('minio')
      var _this = this
      var minioClient = new Minio.Client({
        endPoint: 'minio.langjukeji.com',
        // endPoint: '47.111.154.230',
        port: 9100,
        useSSL: false,
        accessKey: 'langju',
        secretKey: 'langju.327'
      })
      // minioClient.listBuckets(function (err, buckets) {
      //   if (err) return console.log(err)
      //   console.log('buckets :', buckets)
      // })
      var stream = await minioClient.listObjects(localStorage.getItem('photos'), '', true)
      stream.on('data', function (obj) {
        _this.table_all.push(obj)
        if (_this.table_all.length < 10000) {
          _this.getImage1(obj)
        } else {
          console.log(888)
        }
      })
      stream.on('error', function (err) {
        console.log(err)
      })
    },
    getImage () {
      console.log(9999999999999999999)
      var _this = this
      var Minio = require('minio')
      var minioClient = new Minio.Client({
        endPoint: 'minio.langjukeji.com',
        // endPoint: '47.111.154.230',
        port: 9100,
        useSSL: false,
        accessKey: 'langju',
        secretKey: 'langju.327'
      })
      // for (let i = _this.k; i < 10; i++) {
      //   if (i < _this.table_all.length) {
      minioClient.presignedUrl('GET', localStorage.getItem('photos'), _this.table_all[_this.k].name, 7 * 24 * 60 * 60, function (err, presignedUrl) {
        if (err) {
          console.log(err)
        } else {
          _this.table.push(presignedUrl)
        }
      })
      // i++
      // _this.k++
      console.log(_this.k + '++')
      //   } else {
      //     break
      //   }
      // }
    },
    async getImage1 (val) {
      var _this = this
      var Minio = require('minio')
      var minioClient = new Minio.Client({
        endPoint: 'minio.langjukeji.com',
        // endPoint: '47.111.154.230',
        port: 9100,
        useSSL: false,
        accessKey: 'langju',
        secretKey: 'langju.327'
      })
      await minioClient.presignedUrl('GET', localStorage.getItem('photos'), val.name, 7 * 24 * 60 * 60, function (err, presignedUrl) {
        if (err) {
          console.log(err)
        } else {
          _this.table.push(presignedUrl)
        }
      })
      _this.k++
      console.log(_this.k)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .loading-bar {
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
  } */
.span{
    word-break:normal;
    width:auto;
    display:block;
    white-space:pre-wrap;
    word-wrap : break-word ;
    overflow: hidden ;
    color: rgb(216, 99, 115);
    font-size: 30px;
    padding: 10px 18px;
}
.span1{
  color: rgb(216, 99, 115);
  font-size: 16px;
  margin: 0 10px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.home{
  margin: 0 auto;
  width: 100%;
  /* height: 300px; */
  overflow: auto;
}
.image{
  width: 100%;
  /* height: 200px; */
}
.images{
  border-radius: 10px;
  width: 100%;
  padding: 0 3px;
  height: 150px;
}
.img{
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 8px 16px rgba(0, 0, 0, .24), 0 0 24px rgba(0, 0, 0, .08);
}
.dialog{
  background-color: black;
  width: 100%;
  /* height: 100%; */
}
</style>
<style>
.el-dialog__body {
    padding: 0px 5px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    height: 100%;
}
.el-dialog {
    position: relative;
    margin: 0 auto 50px;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    /* height: 100%;
    width: 100%; */
}
.el-dialog__header {
    padding: 0 !important;
}
.el-message {
    /* width: 250px!important; */
    min-width: 200px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    /* position: fixed;
    left: 50%;
    top: 20px; */
    transform: translateX(-50%);
    background-color: #edf2fc;
    transition: opacity .3s,transform .4s,top .4s;
    overflow: hidden;
    padding: 10px;
    display: flex;
    align-items: center;
}
</style>

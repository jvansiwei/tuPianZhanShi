<template>
  <div v-loading="loading" class="hello">
    <div class="home">
    <img class="image" src="../../assets/lunhua.jpg">
      <el-row>
        <el-col v-for="(item, index) in table" :key="index" :span="12" >
          <el-card :body-style="{ padding: '0px' }">
            <img v-if="urls[index].length" @click="tiaozhuan(item)" :src="urls[index]" class="image-logo">
            <img v-else @click="tiaozhuan(item)" src="../../assets/lunhua-logo.png" class="image-logo">
            <div @click="tiaozhuan(item)" style="padding: 14px;height:25px">
              <span class="span">{{item.name.split(".")[1]}}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- <button id="test" style="position:fixed;right:0;bottom:0">回到顶部</button> -->
 <!-- <script>
 test.onclick = function(){
 document.body.scrollTop = document.documentElement.scrollTop = 0;
 }
 </script> -->
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      loading: true,
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      table: [],
      table_ls: [],
      urls: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    tiaozhuan (val) {
      var time = new Date('Fri Aug 23 2019 12:52:16 GMT+0800 (中国标准时间)').getTime()
      if (val.name.split('.').length > 3) {
        time = time - val.name.split('.')[2] * 1000
      }
      localStorage.removeItem('time')
      localStorage.setItem('time', time)
      localStorage.removeItem('photos')
      localStorage.setItem('photos', val.value)
      localStorage.removeItem('title')
      localStorage.setItem('title', val.name.split('.')[1])
      // localStorage.removeItem('total')
      // localStorage.setItem('total', val.name.split('.')[2])
      this.$router.push('/photos')
    },
    getData () {
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
      minioClient.listBuckets(function (err, buckets) {
        if (err) return console.log(err)
        console.log('buckets :', buckets)

        // 获取第一个桶的图片地址
        var stream = minioClient.listObjects(buckets[0].name, '', true)
        stream.on('data', function (obj) {
          minioClient.presignedUrl('GET', buckets[0].name, obj.name, 7 * 24 * 60 * 60, function (err, presignedUrl) {
            if (err) {
              console.log(err)
            } else {
              _this.urls.push(presignedUrl)
            }
          })
        })

        _this.table_ls = buckets
        var i = buckets.length - 1
        // var stream = minioClient.listObjects(buckets[0].name, '', true)
        stream.on('data', function (obj) {
          console.log(obj)
          if (i >= 0) {
            _this.table.push({
              name: obj.name,
              value: buckets[buckets.length - i].name,
              time: buckets[buckets.length - i].creationDate
            })
            i--
          }
        })
        stream.on('error', function (err) { console.log(err) })
        console.log(_this.table)
        _this.loading = false
      })
      // var stream = minioClient.listObjects('2323', '', true)
      // stream.on('data', function (obj) { console.log(obj) })
      // stream.on('error', function (err) { console.log(err) })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.span{
    word-break:normal;
    width:auto;
    display:block;
    white-space:pre-wrap;
    word-wrap : break-word ;
    overflow: hidden ;
    font-size: 12px
}
.home{
  margin: 0 auto;
  width: 100%;
  /* height: 300px; */
  overflow: auto;
}
.image{
  width: 100%;
  max-height: 300px
}
</style>
<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }
 .image {
    width: 100%;
    display: block;
  }

  .image-logo {
    width: 100%;
    height: 120px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
</style>

<template>
  <div>
    <header class="header_cont container">
      <router-link to="/home" class="iconfont back">&#xe779;</router-link>
      <span>{{cityName}}</span>
      <router-link to="/home" slot="changecity" class="change_city">切换城市</router-link>
    </header>
    <section class="container contCss city_form">
      <input type="text" placeholder="输入学校、商务楼、地址" v-model="inputValue">
      <input type="button" value="查询" @click="postpois">
    </section>
    <section>
      <header v-if="historytitle" class="pois_search_history">搜索历史</header>
      <ul class="getpois_ul">
          <li class="container" v-for="(item, index) in placelist" :key="index" @click="nextpage(index, item.geohash)">
              <h4 class="pois_name ellipsis">{{item.name}}</h4>
              <p class="pois_address ellipsis">{{item.address}}</p>
          </li>
      </ul>
      <footer v-if="historytitle&&placelist.length" class="clear_all_history" @click="clearAll()">清空所有</footer>
    </section>
  </div>
</template>

<script>
import {currentcity, searchplace} from '../../service/getData'
import {setStort, getStort, removeStore} from '../../config/mUtils.js'
export default{
  data () {
    return {
      inputValue: '',
      cityID: '',
      cityName: '',
      placelist: [],
      placeHistory:[], // 历史搜索记录
      historytitle: true
    }
  },
  mounted () {
    const self = this
    this.cityID = this.$route.params.id

    currentcity(this, this.cityID).then(function (response) {
      self.cityName = response.data.name
    }).catch(function (err) {
      console.log(err)
    })

    this.initData()
  },
  methods: {
    /**
     * 如果有历史记录，则吧历史记录（placeHistory）赋值给 placelist
     * 在页面mounted时和点击‘清除记录按钮’时调用
     */
    initData () {
      if(getStort('placeHistory')){
        this.placelist = JSON.parse(getStort('placeHistory'))
      } else {
        this.placelist = []
      }
    },
    // 发送搜索信息
    postpois () {
      const self = this
      if (this.inputValue) {
        searchplace(this, this.cityID, this.inputValue).then(function (response) {
          self.historytitle = false
          self.placelist = response.data
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    /**
     * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
     * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
     */
    nextpage (index, geohash) {
      let history = getStort('placeHistory')
      let choosePlace = this.placelist[index]
      if (history) {
        let checkrepeat = false
        this.placeHistory = JSON.parse(history)
        this.placeHistory.forEach(function(item) {
          if(item.geohash == geohash){
            checkrepeat = true
          }
        }, this)
        if (!checkrepeat) {
          this.placeHistory.push(choosePlace)
        }
      } else {
        this.placeHistory.push(choosePlace)
      }
      setStort('placeHistory', this.placeHistory)
      this.$router.push({path: '/msite', query: {geohash}})
    },
    // 清除历史记录
    clearAll () {
      removeStore('placeHistory')
      this.placeHistory = []
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin.scss';
.header_cont{
  display: flex;
  justify-content: space-between;
  align-content: center;
  background-color: $themeC;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: pxFrem(65);
  line-height: pxFrem(65);
  a{
    color: #fff;
  }
  .back{
    font-size: pxFrem(40);
  }
  span{
    font-size: pxFrem(30);
    font-weight: bold;
  }
  .chang_city{
    font-size: pxFrem(24);
  }
}

.city_form{
  margin-top: pxFrem(20);
}

.getpois_ul{
  li{
    background-color: #fff;
    border-top: 1px solid #e4e4e4;
    padding-top: pxFrem(26);
    padding-bottom: pxFrem(26);
    .pois_name{
      font-size: pxFrem(28);
      margin-bottom: pxFrem(16);
    }
    .pois_address{
      font-size: pxFrem(24);
      color: #999;
    }
  }
}
</style>

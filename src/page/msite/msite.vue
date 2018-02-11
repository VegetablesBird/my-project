<template>
  <div>
    <header class="header_top container">
      <span>{{msiteTitle}}</span>
      <router-link to="/home" slot="changecity" class="change_city">切换城市</router-link>
    </header>
    <!--<p>geohash:{{geohash}}</p>-->
    <nav class="msite_nav contCss">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide class="food_types_container" v-for="(item, index) in foodTypes" :key="index">
          <router-link :to="'/home'" v-for="foodItem in item" :key="foodItem.id" class="link_to_food">
            <figure>
              <img :src="imgBaseUrl + foodItem.image_url">
              <figcaption>{{foodItem.title}}</figcaption>
            </figure>
          </router-link>
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination"></div>
    </nav>
    <!--<section>
      <ul class="list">
        <li v-for="(item, key) in shopListArr" :key="key">
          <img src="" alt="">
          <span>{{item.title}}</span>
        </li>
      </ul>
    </section>-->
    <section class="contCss">
      <header>附近的商家</header>
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </section>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import {msiteFoodTypes, cityGuess, msiteAddress} from '../../service/getData'
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import '../../style/swiper.css'

import shopList from '../../components/common/shopList'

export default{
  data () {
    return {
      offset: 0,
      geohash: '',
      foodTypes: [],
      shopListArr: [],
      msiteTitle: '头部地址',
      hasGetData: false,
      imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
      swiperOption: {
        // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        // swiper configs 所有的配置同swiper官方api配置
        autoplay: 3000,
        direction: 'horizontal',
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: true,
        pagination: { el:'.swiper-pagination'},
        paginationClickable: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
        scrollbar: '.swiper-scrollbar',
        mousewheelControl: true,
        observeParents: true,
        // if you need use plugins in the swiper, you can config in here like this
        // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
        debugger: true,
        // swiper callbacks
        // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
        onTransitionStart (swiper) {
          // console.log(swiper)
        },
        // more Swiper configs and callbacks...
        // ...
      }
    }
  },
  components: {
    shopList,
    swiper,
    swiperSlide
  },
  async beforeMount () {
    if (!this.$route.query.geohash) {
      const address = await cityGuess(this)
      this.geohash = address.data.latitude + ',' + address.data.longitude
    } else {
      this.geohash = this.$route.query.geohash
    }
    // 保存gerohash到vuex
    this.SAVE_GEOHASH(this.geohash)
    // 获取位置信息
    let res = await msiteAddress(this, this.geohash)
    this.msiteTitle = res.data.name
    // 记录金纬度
    this.RECORD_ADDRESS(res.data)
    this.hasGetData = true
  },
  mounted () {
    const self = this
    this.geohash = this.$route.query.geohash

    msiteFoodTypes(this, this.geohash).then(function (res) {
      let resLength = res.data.length
      let resArr = [...res.data]
      let foodArr = []
      for (let i = 0, j = 0; i < resLength; i += 8, j++) {
        foodArr[j] = resArr.splice(0, 8)
      }
      self.foodTypes = foodArr
    }).catch(function (err) {
      console.log(err)
    })
  },
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  methods: {
    ...mapMutations([
      'SAVE_GEOHASH', 'RECORD_ADDRESS'
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '../../style/mixin.scss';
  .header_top{
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
    z-index: 2;
    a {
      color: #fff;
    }

    .back {
      font-size: pxFrem(40);
    }

    span {
      font-size: pxFrem(30);
      font-weight: bold;
    }

    .chang_city {
      font-size: pxFrem(24);
    }
  }
  .food_types_container{
    display: flex;
    flex-wrap: wrap;
    .link_to_food{
      width: 25%;
      font-size: pxFrem(24);
      color: #666;
      display: flex;
      justify-content: center;
      text-align: center;
      margin-bottom: pxFrem(10);
      img{
        width: pxFrem(80);
        height: pxFrem(80);
        margin-bottom: pxFrem(6);
      }
    } 
  }
  .msite_nav{
    padding-top: pxFrem(15);
    padding-bottom: pxFrem(15);
  }
  .swiper-pagination{
    font-size: pxFrem(16);
  }
</style>

<template>
  <div class="shop_container">
    <header class="shop_detail_header">
      <img :src="imgBaseUrl + shopDetailData.image_path" :alt="shopDetailData.name" class="header_cover_img">
      <section class="description_header">
        <router-link :to="''" class="description_top">
          <section class="description_left">
            <img :src="imgBaseUrl + shopDetailData.image_path" :alt="shopDetailData.name">
          </section>
          <section class="description_right">
            <h4 class="description_title ellipsis">{{shopDetailData.name}}</h4>
            <p class="description_text">商家配送／{{shopDetailData.order_lead_time}}分钟送达／配送费¥{{shopDetailData.float_delivery_fee}}</p>
            <p class="description_promotion ellipsis">公告：{{promotionInfo}}</p>
          </section>
        </router-link>
      </section>
    </header>
    <section class="food_container">
      <section class="menu_container">
        <section class="menu_left wrapper_menu">
          <ul>
            <li v-for="(item, index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu: index == menuIndex}" @click="chooseMenu(index)">
              <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </section>
        <section class="menu_right" ref="menuFoodList">
          <ul>
            <li v-for="(item, index) in menuList" :key="index" :class="{on: index == menuIndex}">
              <header class="menu_detail_header">
                <section class="menu_detail_header_left ellipsis">
                  <strong class="menu_item_title">{{item.name}}</strong>
                  <span class="menu_item_description">{{item.description}}</span>
                </section>
                <span class="menu_detail_header_right iconfont" @click="showTitleDetail(index)">&#xe73a;</span>
                <p class="description_tip" v-if="index == TitleDetailIndex">
                  <span>{{item.name}}</span>
                  {{item.description}}
                </p>
              </header>
              <section v-for="(foods, foodIndex) in item.foods" :key="foodIndex" class="menu_detail_list">
                <router-link :to="''">
                  <section class="menu_food_img">
                    <img :src="imgBaseUrl + foods.image_path">
                  </section>
                  <section class="menu_food_description">
                    <h3 class="description_foodname">{{foods.name}}</h3>
                    <p class="food_description_content">{{foods.description}}</p>
                    <p class="food_description_sale_rating">
                        <span>月售{{foods.month_sales}}份</span>
                        <span>好评率{{foods.satisfy_rate}}%</span>
                    </p>
                  </section>
                </router-link>
                <footer class="menu_detail_footer">
                  <section class="food_price">
                    <span>¥</span>
                    <span>{{foods.specfoods[0].price}}</span>
                    <span v-if="foods.specifications.length">起</span>
                  </section>
                  <!--<buy-cart :shopId='shopId' :foods='foods' @moveInCart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>-->
                </footer>
              </section>
            </li>
          </ul>
        </section>
      </section>
    </section>
    <section>
      
    </section>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {shopDetails, foodMenu} from '../../service/getData'
import {getImgPath} from '../../../src/components/common/mixin'
import BScroll from 'better-scroll'

export default {
  data () {
    return {
      imgBaseUrl: 'http://cangdu.org:8001/img/', // 图片地址
      shopId: null, // 商铺id
      shopDetailData: {}, // 商铺详情
      menuList: null, // 食品列表
      TitleDetailIndex: null, // 点击显示食品列表头部详情
      foodScroll: null,
      showLoading: true,
      menuIndex: 0, // 当前选择菜单的索引值，默认为0
      menuIndexChange: true, // 防止点击左侧菜单是，触发右侧滚动事件
    }
  },
  created () {
    this.shopId = this.$route.query.id
  },
  mounted () {
    this.initData()
  },
  watch: {
    showLoading: function (value) {
      // console.log(value)
      // if(!value){
      //   const listContainer = this.$refs.menuFoodList
      //   this.$nextTick(function() {
      //     this.foodScroll = new BScroll(listContainer, {
      //       probeType: 3,
      //       deceleration: 0.001,
      //       bounce: false,
      //       swipeTime: 2000,
      //       click: true,
      //     })
      //   })
      // }
    }
  },
  mixins: [getImgPath],
  computed: {
    ...mapState([
      'latitude','longitude'
    ]),
    promotionInfo () {
      return this.shopDetailData.promotion_info || '欢迎光临，用餐高分期请提前下单，谢谢！'
    }
  },
  methods: {
    // 获取数据
    async initData () {
      const self = this
      // 商铺信息
      let shopDetailData = await shopDetails(this, this.shopId, this.latitude, this.longitude).then(function (res) {
        self.shopDetailData = res.data
      }).catch(function (err) {
        console.log(err)
      })

      // 商铺菜单列表
      let menuList = await foodMenu(this, this.shopId).then(function (res) {
        self.menuList = res.data
        self.$nextTick(() => {
          self.foodScroll = new BScroll(self.$refs.menuFoodList, {
            probeType: 3,
            deceleration: 0.001,
            // bounce: false,
            swipeTime: 2000,
            click: true,
          })
          self.foodScroll.on('scroll', (pos) => {
            if(self.menuIndexChange){
              const listContainer = self.$refs.menuFoodList
              const listArr = Array.from(listContainer.children[0].children)
              listArr.forEach(function(element, index) {
                if(element.offsetTop <= Math.abs(Math.round(pos.y))){
                  self.menuIndex = index
                  // console.log(self.menuIndex)
                }
              }, this)
            }
          })
        })
      }).catch(function (err) {
        console.log(err)
      })

      //隐藏加载动画
      this.showLoading = false
    },
    showTitleDetail (index) {
      this.TitleDetailIndex = this.TitleDetailIndex == index ? null : index
    },
    // 点击左侧列表时，变更menuIndex的值，跟新列表状态，右侧列表滚动到相应位置
    chooseMenu (index) {
      this.menuIndex = index
      // 通过index获取右侧列表的元素
      const listContainer = this.$refs.menuFoodList
      this.foodScroll.scrollToElement(listContainer.children[0].children[index], 800, 0, 0)
      this.menuIndexChange = false
      this.foodScroll.on('scrollEnd', () => {
        this.menuIndexChange = true;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';

  .shop_container{
    height: 100%;
    display: flex;
    flex-direction: column;
    .food_container{
      flex: 1;
      display: flex;
      flex-direction: column;
      .buy_cart_container{
        flex: 1;
      }
    }
  }
  .shop_detail_header{
    position: relative;
    overflow: hidden;
    .header_cover_img{
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      filter: blur(10px);
      z-index: 1;
    }
  }
  .description_top{
    position: relative;
    z-index: 2;
    display: flex;
    color: #fff;
    padding: pxFrem($pw);
    background-color: rgba(119,103,137,.43);
    .description_left{
      width: pxFrem(126);
      margin-right: pxFrem(10);
      img{
        width: pxFrem(126);
        height: pxFrem(126);
      }
    }
    .description_right{
      flex: 1;
      overflow: hidden;
      .description_title{
        font-size: pxFrem(35);
        margin-bottom: pxFrem(15);
      }
      .description_text, .description_promotion{
        font-size: pxFrem(26);
      }
      .description_text{
        margin-bottom: pxFrem(10);
      }
    }
  }
  .menu_container{
    display: flex;
    overflow-y: hidden;
    .menu_left{
      width: pxFrem(150);
    }
    .menu_right{
      flex: 1;
      overflow: hidden;
    }
  }
  .wrapper_menu{
    li{
      border-left: pxFrem(6) solid #fff;
      border-bottom: pxFrem(2) solid #ededed;
      padding: pxFrem(30) pxFrem(15);
      font-size: pxFrem(24);
      line-height: pxFrem(35);
      color: #666;
      &.activity_menu{
        border-left-color: #3190e8;
        background-color: #fff;
        span{
          font-weight: bold;
        }
      }
      img{
        width: pxFrem(24);
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
  }
  .router-link-active{
    display: flex;
    .menu_food_img{
      width: pxFrem(100);
      height: pxFrem(100);
      margin-right: pxFrem(20);
      img{
        width: 100%;
        height: 100%;
      }
    }
    .menu_food_description{
      flex: 1;
      overflow: hidden;
      .description_foodname{
        color: #333;
        font-size: pxFrem(30);
        font-weight: bold;
      }
      .food_description_content{
        color: #999;
      }
    }
  }
  .menu_detail_footer{
    margin-left: pxFrem(100 + 20);
    margin-top: pxFrem(10);
    .food_price{
      span{
        &:nth-child(1), &:nth-child(2){
          color: #f60;
          font-weight: bold;
          font-size: pxFrem(26);
        }
      }
    }
  }
  .menu_detail_header{
    display: flex;
    position: relative;
    padding: pxFrem(30);
    .menu_item_title{
      color: #666;
      font-size: pxFrem(26);
    }
    .menu_item_description{
      color: #999;
      font-size: pxFrem(24);
    }
    .menu_detail_header_left{
      flex: 1;
      overflow: hidden;
    }
    .menu_detail_header_right{
      margin-left: 1em;
      font-size: pxFrem(24);
      color: #999;
    }
    .description_tip{
      background-color: #39373a;
      opacity: .95;
      font-size: pxFrem(24);
      color: #fff;
      position: absolute;
      top: pxFrem(65);
      z-index: 14;
      width: 60%;
      right: .2rem;
      padding: pxFrem(15);
      border: 1px;
      border-radius: pxFrem(10);
      &:after{
        content: "";
        position: absolute;
        width: pxFrem(20);
        height: pxFrem(20);
        background-color: #39373a;
        transform: rotate(45deg);
        top: pxFrem(-8);
        right: pxFrem(20);
      }
    }
  }
  .menu_detail_list{
    background-color: #fff;
    padding: pxFrem(20) pxFrem(10);
  }
</style>

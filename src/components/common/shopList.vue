<template>
  <div class="shoplist_container contCss">
    <ul>
      <router-link tag="li" :to="{path: 'shop', query:{geohash, id: item.id}}" class="shop_li" v-for="(item, index) in shopListArr" :key="index">
        <section><img :src="imgBaseUrl + item.image_path" class="shop_img"></section>
        <section class="shop_right">
          <header class="shop_detail_header">
            <h4 class="shop_title ellipsis">{{item.name}}</h4>
            <ul class="shop_detail_ul">
              <li v-for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
            </ul>
          </header>
          <h5 class="rating_order_num">
            <section class="rating_order_num_left">
              <section class="rating_section">
                <span class="rating_num">{{item.rating}}</span>
              </section>
              <section class="order_section">
                月售{{item.recent_order_num}}单
              </section>
            </section>
            <section class="rating_order_num_right">
              <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
              <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
            </section>
          </h5>
          <h5 class="fee_distance">
            <p class="fee">
              ¥{{item.float_minimum_order_amount}}起送 
              <span class="segmentation">/</span>
              {{item.piecewise_agent_fee.tips}}
            </p>
            <p class="distance_time">
              <span v-if="Number(item.distance)">{{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}
                <span class="segmentation">/</span>
              </span>
              <span v-else>{{item.distance}}</span>
              <span class="segmentation">/</span>
              <span class="order_time">{{item.order_lead_time}}</span>
            </p>
          </h5>
        </section>
      </router-link>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getShopList} from '../../service/getData'
export default{
  data () {
    return {
      imgBaseUrl: 'http://cangdu.org:8001/img/', //图片域名地址
      shopListArr: []
    }
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
	props: ['geohash'],
  methods: {
    async initData () {
      let res = await getShopList(this, this.latitude, this.longitude, this.offset, this.restaurantCategoryId)
      this.shopListArr = [...res.data]
    },
    zhunshi(supports) {
      let zhunStatus;
      if((supports instanceof Array) && supports.length){
        supports.forEach(item => {
          if (item.icon_name === '准') zhunStatus = true
        })
      }else{
        zhunStatus = false
      }
      return zhunStatus
    }
  }
}
</script>


<style lang="scss" scoped>
	@import 'src/style/mixin';
	.shoplist_container{
		background-color: #fff;
		margin-bottom: 2rem;
	}
	.shop_li{
		display: flex;
		border-bottom: 0.025rem solid #f1f1f1;
		padding: pxFrem(30) pxFrem($pw);
	}
	.shop_img{
		width: pxFrem(100);
    height: pxFrem(100);
		display: block;
		margin-right: 0.4rem;
	}
	.list_back_li{
		height: 4.85rem;
		.list_back_svg{
			width: 100%;
      height: 100%;
		}
	}
	.shop_right{
		flex: auto;
		.shop_detail_header{
      display: flex;
      justify-content: space-between;
			align-items: center;
			.shop_title{
				// width: 8.5rem;
				color: #333;
				padding-top: .01rem;
        font-size: pxFrem(30);
        line-height: 1;
				font-weight: 700;
			}
			.premium::before{
				content: '品牌';
				display: inline-block;
				font-size: 0.5rem;
				line-height: .6rem;
				color: #333;
				background-color: #ffd930;
				padding: 0 0.1rem;
				border-radius: 0.1rem;
				margin-right: 0.2rem;
			}
			.shop_detail_ul{
				display: flex;
				transform: scale(.8);
				margin-right: -0.3rem;
				.supports{
          color: #999;
          font-size: pxFrem(24);
					border: 0.025rem solid #f1f1f1;
					padding: 0 0.04rem;
					border-radius: 0.08rem;
					margin-left: 0.05rem;
				}
			}
		}
		.rating_order_num{
			display: flex;
      justify-content: space-between;
			height: 0.6rem;
			margin-top: pxFrem(10);
			.rating_order_num_left{
        display: flex;
        justify-content: flex-start;
				.rating_section{
					display: flex;
					.rating_num{
            font-size: pxFrem(24);
            color: #ff6000;
						margin: 0 0.2rem;
					}
				}
				.order_section{
					transform: scale(.8);
					margin-left: -0.2rem;
          font-size: pxFrem(24);
          color: #666;
				}
			}
			.rating_order_num_right{
				display: flex;
				align-items: center;
				transform: scale(.7);
				min-width: 5rem;
				justify-content: flex-end;
				margin-right: -0.8rem;
				.delivery_style{
					font-size: 0.4rem;
					padding: 0.04rem 0.08rem 0;
					border-radius: 0.08rem;
					margin-left: 0.08rem;
					border: 1px;
				}
				.delivery_left{
					color: #fff;
					background-color: $themeC;
					border: 0.025rem solid $themeC;
				}
				.delivery_right{
					color: $themeC;
					border: 0.025rem solid $themeC;
				}
			}
		}
		.fee_distance{
			margin-top: pxFrem(15);
		  display: flex;
      justify-content: space-between;
      font-size: pxFrem(24);
      color: #333;
			.fee{
				transform: scale(.9);
        font-size: pxFrem(24);
        color: #666;
			}
			.distance_time{
				transform: scale(.9);
				span{
					color: #999;
				}
				.order_time{
					color: blue;
				}
				.segmentation{
					color: #ccc;
				}
			}
		}
	}
	.loader_more{
    font-size: pxFrem(26);
    line-height: 3;
		text-align: center;
	    color: #999;
	}
	.empty_data{
    font-size: pxFrem(24);
    color: #666;
		text-align: center;
		line-height: 2rem;
	}
	.return_top{
		position: fixed;
		bottom: 3rem;
		right: 1rem;
		.back_top_svg{
      width: pxFrem(20);
      height: pxFrem(20);
		}
	}
	.loading-enter-active, .loading-leave-active {
		transition: opacity 1s
	}
	.loading-enter, .loading-leave-active {
		opacity: 0
	}
</style>
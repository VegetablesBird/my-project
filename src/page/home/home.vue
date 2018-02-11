<template>
  <div>
    <header class="container">
      <span>me</span>
      <span>登陆</span>
    </header>
    <nav class="container contCss">
      <div class="city-tip">
        <span>当前定位位置：{{guessCity}}</span>
        <small>定位不准时，请重新选择城市</small>
      </div>
      <router-link class="city-btn" :to="'/city/' + guessID">
        <span>{{guessCity}}</span>
        <span class="iconfont">&#xe775;</span>
      </router-link>
    </nav>
    <section class="hot-city contCss">
      <h4 class="city-title">热门城市</h4>
      <ul class="citylistul clear">
        <router-link tag="li" v-for="(value, key) in hotcity" :key="key" :to="'/city/' + value.id">{{value.name}}</router-link>
      </ul>
    </section>
    <section class="group-city">
      <ul class="clear">
        <li v-for="(value, key, index) in sortgroupcity" :key="key"  class="letter_classify_li contCss">
          <h4 class="city-title">{{key}}
              <span v-if="index == 0">（按字母排序）</span>
          </h4>
          <ul class="citylistul clear">
            <router-link  tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="ellipsis">
              {{item.name}}
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import {cityGuess, hotcity, groupcity} from '../../service/getData'

export default{
  data () {
    return {
      guessCity: '',
      guessID: '',
      hotcity: [],
      groupcity: {}
    }
  },
  beforeMount () {
  },
  mounted () {
    const self = this
    // 获取当前的城市
    cityGuess(self).then(function (response) {
      self.guessCity = response.data.name
      self.guessID = response.data.id
    }).catch(function (err) {
      console.log(err)
    })

    // 获取当前的热门城市
    hotcity(self).then(function (response) {
      self.hotcity = response.data
    }).catch(function (err) {
      console.log(err)
    })

    // 获取所有城市
    groupcity(self).then(function (response) {
      self.groupcity = response.data
    }).catch(function (err) {
      console.log(err)
    })
  },
  computed: {
    // 将获取的groupcity数据按照A-Z字母开头排序
    sortgroupcity () {
      // String.fromCharCode() 可接受一个指定的 Unicode 值，然后返回一个字符串。
      // 汉字、英文字母、数字的unicode范围
      // 数字：[0x30,0x39]（或十进制[48, 57]）
      // 小写字母：[0x61,0x7a]（或十进制[97, 122]）
      // 大写字母：[0x41,0x5a]（或十进制[65, 90]）
      let sortobj = {}
      for (let i = 65; i <= 90; i++) {
        if (this.groupcity[String.fromCharCode(i)]) {
          sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)]
        }
      }
      return sortobj
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin';

header{
  display: flex;
  justify-content: space-between;
  background-color: $themeC;
  color: #fff;
  font-size: pxFrem(30);
  line-height: 1;
  padding-top: pxFrem(20);
  padding-bottom: pxFrem(15);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

nav{
  padding-top: pxFrem(10);
  @at-root .city-tip{
    font-size: pxFrem(24);
    height: pxFrem(70);
    line-height: pxFrem(70);

    display: flex;
    justify-content: space-between;
    small {
      color: #9f9f9f;
      font-weight: bold;
      font-size: pxFrem(26);
    }
  }
  @at-root .city-btn{
    display: flex;
    justify-content: space-between;
    align-content: center;
    border-top: 1px solid #e4e4e4;
    font-size: pxFrem(28);
    height: 2.6em;
    line-height: 2.6em;
    span:first-child{
      color: $themeC;
    }
  }
}

.city-title {
  border-bottom: 1px solid #e4e4e4;
  height: pxFrem(50);
  line-height: pxFrem(50);
  padding-left: pxFrem($pw);
  padding-right: pxFrem($pw);
  color: #666;
  font-size: pxFrem(26);
}

.citylistul {
  li {
    width: 25%;
    height: pxFrem(70);
    line-height: pxFrem(70);
    text-align: center;
    float: left;
    border-right: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    &:nth-child(4n) {
      border-right: none;
    }
  }
}

.hot-city{
  ul{
    li{
      color: $themeC;
    }
  }
}

.group-city{
  .letter_classify_li{
    border-bottom: 1px solid #e4e4e4;
  }
}
</style>

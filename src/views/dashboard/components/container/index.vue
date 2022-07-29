<template>
  <el-card class="box-card" style="margin: 20px 0">
    <div class="top">
      <div class="left">
        <div class="item">
          <p>销售量</p>
          <div class="line"></div>
        </div>
        <div class="item" style="margin-left: 10px">
          <p>访问量</p>
          <div class="line"></div>
        </div>
      </div>
      <div class="right">
        <div class="r_left">
          <div class="item">今日</div>
          <div class="item">本周</div>
          <div class="item">本月</div>
          <div class="item">本年</div>
        </div>
        <div class="r_right">
          <el-date-picker
            v-model="value"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div ref="charts" class="charts"></div>
      <div class="list">
        <h4>门店销售额排名</h4>
        <ul>
          <li class="item" v-for="(item, index) in listData" :key="index">
            <div class="number">
              <div v-if="index > 2">{{ index + 1 }}</div>
              <div v-else class="back">{{ index + 1 }}</div>
            </div>
            <div class="name">{{ item.name }}</div>
            <div class="money">{{ item.money }}</div>
          </li>
        </ul>
      </div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Container",
  data() {
    return {
      value: "",
      title: "销售额趋势",
      listData: [
        { name: "肯德基", money: "321546" },
        { name: "麦当劳", money: "326548" },
        { name: "必胜客", money: "526421" },
        { name: "海底捞", money: "652326" },
        { name: "麦当劳", money: "326548" },
        { name: "必胜客", money: "526421" },
        { name: "海底捞", money: "652326" },
      ],
    };
  },
  mounted() {
    this.bar();
  },
  methods: {
    bar() {
      let myCharts = echarts.init(this.$refs.charts);
      myCharts.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        title: {
          text: "销售额趋势",
          textStyle: {
            fontSize: 14,
          },
          left: 0,
          top: 20,
        },
        xAxis: {
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: [23, 45, 58, 32, 44, 66, 57, 58, 32, 44, 66, 57],
          },
        ],
        grid: {
          left: 30,
          right: 10,
          bottom: 40,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 5px;
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    .item {
      position: relative;
    }
    p {
      margin: 0;
      font-size: 14px;
      color: #00aeec;
    }
    .line {
      position: relative;
      bottom: -12px;
      width: 100%;
      height: 2px;
      border-radius: 5px;
      background-color: #00aeec;
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .r_left {
      display: flex;
      flex-direction: row;
      margin-right: 16px;
      .item {
        margin: 0 8px;
        font-size: 14px;
      }
    }
  }
}
.number > div {
  min-height: 20px;
  //   min-width: 20px;
  text-align: center;
}
.bottom {
  display: flex;
  flex-direction: row;
  height: 400px;
  .charts {
    flex: 7.5;
    height: 100%;
  }
  .list {
    flex: 2.5;
    height: 100%;
    h4 {
      margin: 20px 0;
    }
    .item {
      padding: 10px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .number {
        flex: 1;
        text-align: left;
      }
      .back {
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        background-color: #333;
        margin: 0 auto;
        color: #fff;
      }
      .name {
        flex: 1;
        text-align: center;
      }
      .money {
        flex: 1.5;
        text-align: right;
      }
    }
  }
}
</style>
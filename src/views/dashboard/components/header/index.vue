<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <Card top_title="销售总额" bottom_title="日销售额 ￥1324">
        <div slot="content">
          <div class="number">￥ 126560</div>
          <div class="visualization">周同比 55.67% 日同比 19.76%</div>
        </div>
      </Card>
    </el-col>
    <el-col :span="6">
      <Card top_title="访问量" bottom_title="日访问量 1234">
        <div slot="content">
          <div class="number">88460</div>
          <div ref="line" class="visualization"></div>
        </div>
      </Card>
    </el-col>
    <el-col :span="6">
      <Card top_title="支付笔数" bottom_title="转化率 65%">
        <div slot="content">
          <div class="number">88460</div>
          <div ref="bar" class="visualization">周同比 55.67% 日同比 19.76%</div>
        </div>
      </Card>
    </el-col>
    <el-col :span="6">
      <Card top_title="运营活动效果" bottom_title="周同比 55.67% 日同比 19.76%">
        <div slot="content">
          <div class="number">78%</div>
          <div class="visualization center">
            <el-progress
              class="center"
              color="#67c23a"
              :show-text="false"
              :stroke-width="14"
              :percentage="78"
            ></el-progress>
          </div>
        </div>
      </Card>
    </el-col>
  </el-row>
</template>

<script>
import Card from "./card/card";
import * as echarts from "echarts";
export default {
  components: {
    Card,
  },
  mounted() {
    this.line();
    this.bar();
  },
  methods: {
    line() {
      let myChartsLine = echarts.init(this.$refs.line);
      myChartsLine.setOption({
        xAxis: {
          show: false,
          type: "category",
        },
        yAxis: {
          show: false,
        },
        series: [
          {
            type: "line",
            smooth: true,
            data: [10, 40, 15, 30, 5, 18, 3],
            itemStyle: {
              opacity: 0,
            },
            areaStyle: {
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#a575ea", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
        //图表布局调试
        grid: {
          //   left: -40,
          //   top: 5,
          //   right: -40,
          //   bottom: 5,
          left: 0,
          top: 5,
          right: 0,
          bottom: 5,
        },
      });
    },
    bar() {
      let mycharts = echarts.init(this.$refs.bar);
      mycharts.setOption({
        xAxis: {
          show: false,
          type: "category",
        },
        yAxis: {
          show: false,
        },
        series: [
          {
            type: "bar",
            data: [10, 13, 18, 30, 25, 10, 13, 18, 30, 25],
          },
        ],
        grid: {
          // top: 5,
          // bottom: 5,
          // left: -40,
          // right: -40
          top: 5,
          bottom: 5,
          left: 0,
          right: 0,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.number {
  padding: 5px 0;
  font-size: 28px;
  color: #333;
}
.visualization {
  width: 100%;
  height: 60px;
}
.center {
  padding-top: 10px;
  width: 100%;
}
</style>
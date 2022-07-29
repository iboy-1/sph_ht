<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <Card>
        <template slot="top">
          <span>线上热门搜索</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            ><i class="el-icon-more"></i
          ></el-button>
        </template>
        <template slot="container">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="container_title">
                <span>搜索用户数</span>
                <i class="el-icon-info"></i>
              </div>
              <div class="info">
                <span class="big">12321</span>
                <span class="small">17.1</span>
                <i></i>
              </div>
              <div ref="left" class="left_box"></div>
            </el-col>
            <el-col :span="12">
              <div class="container_title">
                <span>人均搜索次数</span>
                <i class="el-icon-info"></i>
              </div>
              <div class="info">
                <span class="big">12321</span>
                <span class="small">17.1</span>
                <i></i>
              </div>
              <div class="info"></div>
              <div ref="right" class="right_box"></div>
            </el-col>
          </el-row>
          <el-table :data="tableData" border style="width: 100%; margin-top: 10px">
            <el-table-column type="index" label="排名" width="80">
            </el-table-column>
            <el-table-column prop="keyword" label="搜索关键字" width="width">
            </el-table-column>
            <el-table-column prop="name" label="用户名" width="width">
            </el-table-column>
            <el-table-column prop="increase" label="周涨幅" width="width">
            </el-table-column>
          </el-table>
          <el-pagination style="text-align: center; margin-top: 15px" layout="prev, pager, next" :total="1000">
          </el-pagination>
        </template>
      </Card>
    </el-col>
    <el-col :span="12">
      <Card>
        <template slot="top">
          <span>销售额类别占比</span>
          <el-radio-group v-model="isCollapse" size="mini" style="float: right">
            <el-radio-button label="all">全部渠道</el-radio-button>
            <el-radio-button label="onLine">线上</el-radio-button>
            <el-radio-button label="Offline">门店</el-radio-button>
          </el-radio-group>
        </template>
        <template slot="container">
          <el-row :gutter="20">
            <el-col :span="24">
              <div ref="pie" class="box"></div>
            </el-col>
          </el-row>
        </template>
      </Card>
    </el-col>
  </el-row>
</template>

<script>
import Card from "./card";
import * as echarts from "echarts";
export default {
  name: "Footer",
  components: {
    Card,
  },
  data() {
    return {
      isCollapse: "all",
      tableData: [
        { keyword: "烧烤", name: "速度就是快", increase: "25" },
        { keyword: "烧烤", name: "速度就是快", increase: "25" },
      ],
    };
  },
  mounted() {
    this.pie();
    this.line1();
    this.line2();
  },
  methods: {
    pie() {
      let myCharts = echarts.init(this.$refs.pie);
      myCharts.setOption({
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              formatter: "{b}: {c}",
            },
            data: [
              { name: "视频广告", value: 300 },
              { name: "联盟广告", value: 484 },
              { name: "邮件营销", value: 580 },
              { name: "直接访问", value: 735 },
              { name: "搜索引擎", value: 1048 },
            ],
          },
        ],
      });
    },
    line1() {
      let myCharts = echarts.init(this.$refs.left);
      myCharts.setOption({
        xAxis: {
          type: "category",
          show: false,
        },
        yAxis: {
          show: false,
        },
        series: [
          {
            type: "line",
            data: [54, 35, 45, 21, 54],
            smooth: true,
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
        grid: {
          top: 0,
          left: -25,
          right: -25,
          bottom: 0,
        },
      });
    },
    line2() {
      let myCharts = echarts.init(this.$refs.right);
      myCharts.setOption({
        xAxis: {
          type: "category",
          show: false,
        },
        yAxis: {
          show: false,
        },
        series: [
          {
            type: "line",
            data: [54, 35, 45, 21, 54],
            smooth: true,
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
        grid: {
          top: 0,
          left: -25,
          right: -25,
          bottom: 0,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 350px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.left_box {
  width: 100%;
  height: 80px;
}
.right_box {
  width: 100%;
  height: 80px;
}
.container_title {
    span {
        font-size: 14px;
        color: #555;
        margin-right: 10px;
    }
    i {
        color: #666;
    }
}
.info {
    margin: 10px 0 5px;
    .big {
        font-size: 26px;
        color: #333;
        margin-right: 25px;
    }
}
</style>
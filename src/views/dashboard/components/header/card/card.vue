<template>
  <el-card class="box-card">
    <div class="top">
      <div class="p">{{top_title}}</div>
      <i class="el-icon-info"></i>
    </div>
    <slot name="content"></slot>
    <div class="bottom">
      <div class="p">{{bottom_title}}</div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Card",
  props: {
    top_title: {
      type: String,
      required: true
    },
    bottom_title: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .p {
    font-size: 14px;
    color: #555;
  }
  i {
    color: #555;
  }
}
.bottom {
  padding-top: 10px;
  border-top: 1px solid #eee;
  .p {
    font-size: 14px;
    color: #333;
  }
}

</style>
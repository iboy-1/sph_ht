<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <slot name="top"></slot>
    </div>
    <slot name="container"></slot>
    <slot name="bottom"></slot>
  </el-card>
</template>

<script>
export default {
    name: 'Card'
};
</script>

<style>
.clearfix{
    height: 28px;
    line-height: 28px;
}
</style>
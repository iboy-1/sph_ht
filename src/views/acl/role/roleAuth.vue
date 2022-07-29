<template>
  <div>
    <el-input placeholder="请输入内容" v-model="roleName" disabled></el-input>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      :default-expanded-keys="checkedKeys"
      :default-checked-keys="checkedKeys"
      :props="defaultProps"
      ref="tree"
      style="margin: 20px 0"
    >
    </el-tree>
    <div class="button_box">
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="goBack">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoleAuth",
  data() {
    return {
      id: null,
      roleName: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkedKeys: [],
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.roleName = this.$route.query.name
    this.getData();
  },
  methods: {
    goBack() {
        this.$router.push({
            name: 'Role'
        })
    },
    submit() {
        /**
         * element ui tree树形控件获取所有父节点id
         * 修改源码：
         * 情况1：element-ui没有实现按需引入打包（也就是全局引入的情况下）
         * node_modules\element-ui\lib\element-ui.common.js  25382行修改源码 去掉'includeHalfChecked &&'
         * if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf))
         * 变为
         * if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf))
         * 
         * 情况2：element-ui实现了按需引入打包
         * node_modules\element-ui\lib\tree.js  1051行修改源码 去掉'includeHalfChecked &&'
         * if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf))
         * 变为
         * if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf))
         */
        let ids = this.$refs.tree.getCheckedKeys().join(',')
        let obj = {
            roleId: this.id,
            permissionId: ids
        }
        this.$API.role.setAuth(obj).then(res => {
            console.log(res)
            if (res.code === 20000) {
                this.$message({
                    type: 'success',
                    message: res.message
                })
                this.getData()
            }
        }).catch(fail => {

        })
        console.log(ids)
    },
    async getData() {
      this.checkedKeys = []
      let result = await this.$API.role.getRole(this.id);
      if (result.code === 20000) {
        this.data = result.data.children;
        await this.getCheckedKeys(this.data);
      }
    },
    getCheckedKeys(val) {
      val.forEach((item) => {
        if (item.select && item.level === 4) {
          this.checkedKeys.push(item.id);
        }
        if (item.children && item.children.length > 0) {
          this.getCheckedKeys(item.children);
        }
      });
    },
  },
};
</script>

<style>
</style>
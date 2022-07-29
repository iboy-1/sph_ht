<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      v-loading="loading"
    >
      <el-table-column prop="name" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="code" label="权限值" width="width">
      </el-table-column>
      <el-table-column prop="toCode" label="跳转权限值" width="width">
      </el-table-column>
      <el-table-column label="操作" width="width" align="center">
        <template scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            :disabled="scope.row.level === 4"
            @click="dml(scope.row, 0)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="dml(scope.row, 1)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="del(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="close">
      <el-form :model="menuItem" :rules="rules" ref="ruleForm">
        <el-form-item
          label="名称"
          :label-width="formLabelWidth"
          prop="pname"
          v-if="type === 1"
        >
          <el-input v-model="menuItem.pname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="名称"
          :label-width="formLabelWidth"
          prop="name"
          v-else
        >
          <el-input v-model="menuItem.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="功能权限值"
          :label-width="formLabelWidth"
          prop="code"
        >
          <el-input v-model="menuItem.code" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Menu",
  computed: {
    title() {
      const { level } = this.menuItem;
      if (this.type === 1) {
        return level === 4 ? "修改功能" : "修改菜单";
      } else {
        return level === 4
          ? "添加功能"
          : `添加${level === 2 ? "一级" : "二级"}菜单`;
      }
    },
  },
  data() {
    return {
      loading: true,
      tableData: [],
      name: "",
      menuItem: {
        level: 0,
        name: "",
        code: "",
        toCode: "",
      },
      rules: {
        pname: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        code: [
          { required: true, message: "请输入功能权限值", trigger: "blur" },
        ],
      },
      type: null, // 0添加 1修改
      formLabelWidth: "120px",
      dialogFormVisible: false,
    };
  },
  methods: {
    getMenuList() {
      this.$API.menu
        .getMenuList()
        .then((res) => {
          this.loading = false
          this.tableData = res.data.children;
        })
        .catch((fail) => {});
    },
    dml(val, type) {
      if (type === 1) {
        // this.menuItem.id = val.id
        this.menuItem = val;
        this.$set(this.menuItem, "pname", val.name);
      } else {
        this.menuItem.pname = val.name;
        this.menuItem.pid = val.id;
        this.menuItem.level = val.level + 1;
        this.menuItem.type = this.menuItem.level === 4 ? 2 : 1;
      }
      this.type = type;
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
      this.menuItem = {
        level: 0,
        name: "",
        code: "",
        toCode: "",
      };
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
    },
    submit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          this.menuItem.name =
            this.type === 0 ? this.menuItem.name : this.menuItem.pname;
          const { pname, ...perm } = this.menuItem;
          let result = await this.$API.menu[
            this.type === 0 ? "addMenu" : "updateMenu"
          ](perm);
          if (result.code === 20000) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getMenuList();
            this.close();
          }
        } else {
          return false;
        }
      });
    },
    del(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let result = await this.$API.menu.deleteMenu(id)
        if (result.code === 20000) {
          this.$message({
            type: 'success',
            message: result.message
          })
          this.getMenuList()
        }
      }).catch(() => {});
    },
  },
  mounted() {
    this.getMenuList();
  },
};
</script>

<style>
</style>
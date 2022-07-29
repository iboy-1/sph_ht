<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input
          v-model="roleName"
          autocomplete="off"
          placeholder="角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >查询</el-button
        >
        <el-button @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="addUser">添加</el-button>
      <el-button
        type="danger"
        :disabled="!multipleSelection.length"
        @click="delUserList"
        >批量删除</el-button
      >
    </div>
    <el-table
      :data="resultData"
      height="450"
      border
      style="width: 100%; margin-top: 20px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column type="index" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" min-width="280">
        <template slot-scope="scope">
          <div class="button" v-if="scope.row.isShow">
            <el-input
              size="mini"
              ref="input"
              v-model="scope.row.roleName"
              @blur="cancel(scope.row)"
              @keypress.enter.native="update(scope.row)"
            ></el-input>
            <el-button
              type="warning"
              icon="el-icon-refresh"
              size="mini"
              style="margin-left: 20px"
              @click="cancel(scope.row)"
              >取消</el-button
            >
          </div>
          <div v-else>{{ scope.row.roleName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="width">
        <template slot-scope="scope">
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="goAuth(scope.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
      style="text-align: center; padding-top: 20px"
    >
    </el-pagination>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="close">
      <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm">
        <el-form-item
          label="请输入角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    // resultData() {
    //   if (this.roleName === '') {
    //     return this.tableData
    //   } else {
    //     return this.tableData.filter(item => {
    //       return item.roleName.indexOf(this.roleName) !== -1
    //     })
    //   }
    // }
  },
  data() {
    var validateRoleName = (rule, value, callback) => {
      console.log(rule, value);
      if (value === "") {
        callback(new Error("请输入角色名称！"));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      title: "",
      dialogFormVisible: false,
      roleName: "",
      tableData: [],
      resultData: [],
      multipleSelection: [],
      currentPage: 1,
      total: null,
      formLabelWidth: "120px",
      form: {
        deleted: false,
        gmtCreate: "",
        gmtModified: "",
        id: "",
        remark: "",
        roleName: "",
      },
      rules: {
        roleName: [
          { required: true, validator: validateRoleName, trigger: "blur" },
        ],
      },
      lock: false, //锁，作用：点击取消按钮时防止更新角色
    };
  },
  methods: {
    async getRoleList() {
      let result = await this.$API.role.getRoleList(this.currentPage, 10);
      if (result.code === 20000) {
        this.loading = false;
        this.total = result.data.total;
        this.tableData = result.data.items;
        this.tableData.forEach((item) => {
          this.$set(item, "isShow", false);
        });
        this.resultData = this.tableData
      }
    },
    search() {
      this.resultData = this.tableData.filter((item) => {
        return item.roleName.indexOf(this.roleName) !== -1;
      });
    },
    clear() {
      this.roleName = "";
      this.resultData = this.tableData;
    },
    addUser() {
      this.title = "添加角色";
      this.dialogFormVisible = true;
    },
    close() {
      this.$refs["ruleForm"].clearValidate();
      this.dialogFormVisible = false;
    },
    async goAuth(val) {
      // let result = await this.$API.role.getRole(id)
      // console.log(result)
      this.$router.push({
        name: "RoleAuth",
        query: {
          id: val.id,
          name: val.roleName,
        },
      });
    },
    edit(val) {
      val.isShow = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    cancel(val) {
      console.log("取消");
      val.isShow = false;
      this.getRoleList();
    },
    del(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.role.deleteRole(id);
          if (result.code === 20000) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getRoleList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async update(val) {
      console.log("更新");
      val.isShow = false;
      let result = await this.$API.role.updateRole(val);
      if (result.code === 20000) {
        this.$message({
          type: "success",
          message: result.message,
        });
        this.getRoleList();
      }
    },
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let result = await this.$API.role.addRole(this.form);
          if (result.code === 20000) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getRoleList();
          }
          this.dialogFormVisible = false;
        } else {
          alert("error");
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delUserList() {
      let arr = this.multipleSelection.map((item) => item.id);
      this.$API.role
        .deleteRoleList(arr)
        .then((res) => {
          console.log(res);
          if (res.code === 20000) {
          }
        })
        .catch((fail) => {});
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getRoleList();
    },
  },
  mounted() {
    this.getRoleList();
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  flex-direction: row;
}
</style>
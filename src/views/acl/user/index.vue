<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input
          v-model="userName"
          autocomplete="off"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="addUser(0)">添加</el-button>
      <el-button type="danger" :disabled="!multipleSelection.length" @click="delUserList"
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
      <el-table-column prop="username" label="用户名" width="width">
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" width="width">
      </el-table-column>
      <el-table-column prop="roleName" label="权限列表" width="width">
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="width">
      </el-table-column>
      <el-table-column prop="gmtModified" label="权限列表" width="width">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        align="center"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="info"
            icon="el-icon-user-solid"
            size="mini"
            @click="addUser(2, scope.row.id)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="addUser(1, scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row)"
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
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            v-model="form.username"
            :disabled="dialogType === 2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="dialogType !== 2"
          label="用户昵称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          v-show="dialogType === 0"
          label="用户密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          v-show="dialogType === 2"
          label="角色列表"
          :label-width="formLabelWidth"
        >
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox v-for="city in cities" :label="city.roleName" :key="city.id">{{
              city.roleName
            }}</el-checkbox>
          </el-checkbox-group>
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
  name: "User",
  computed: {
    // resultData() {
    //   if (this.userName === '') {
    //     return this.tableData
    //   } else {
    //     return this.tableData.filter(item => {
    //       return item.username.indexOf(this.userName) !== -1
    //     })
    //   }
    // }
  },
  data() {
    var validatePassWord = (rule, value, callback) => {
      if (this.dialogType === 0 && value === "") {
        callback(new Error("请输入用户密码！"));
      } else {
        callback();
      }
    };
    var validateUserName = (rule, value, callback) => {
      console.log(rule, value);
      if (value === "") {
        callback(new Error("请输入用户名！"));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      userName: "",
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
        nickName: "",
        password: "",
        roleName: "",
        salt: "",
        token: "",
        username: "",
      },
      title: "",
      dialogFormVisible: false,
      dialogType: 0, // 0添加, 1 修改, 2 设置
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      rules: {
        username: [
          { required: true, validator: validateUserName, trigger: "blur" },
        ],
        password: [
          { required: true, validator: validatePassWord, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let result = await this.$API.user.getUserList(this.currentPage, 10);
      if (result.code === 20000) {
        this.loading = false
        this.total = result.data.total;
        this.tableData = result.data.items;
        this.resultData = this.tableData
      }
    },
    search() {
      this.resultData = this.tableData.filter((item) => {
        return item.username.indexOf(this.userName) !== -1;
      });
    },
    clear() {
      this.userName = "";
      this.resultData = this.tableData;
    },
    async getUser(id) {
      let result = await this.$API.user.getUser(id);
      console.log(result);
      if (result.code === 20000) {
        this.form = result.data.item;
      }
    },
    async getUserRole(id) {
      let result = await this.$API.user.getUserRole(id);
      console.log(result);
      // this.checkedCities = ['上海', '北京']
      if (result.code === 20000) {
        this.cities = result.data.allRolesList;
        const arr = []
        result.data.assignRoles.forEach((item,index) => {
          arr[index] = item.roleName
        });
        this.checkedCities = arr
      }
    },
    del(val) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.user.delUser(val.id);
          if (result.code === 20000) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async delUserList() {
      let arr = this.multipleSelection.map(item => item.id)
      let result = await this.$API.user.delUserList(arr)
      console.log(result)
    },
    addUser(type, id) {
      switch (type) {
        case 0:
          this.title = "添加用户";
          this.dialogType = 0;
          this.dialogFormVisible = true;
          return;
        case 1:
          this.title = "修改用户";
          this.dialogType = 1;
          this.getUser(id);
          this.dialogFormVisible = true;
          return;
        case 2:
          this.title = "设置角色";
          this.dialogType = 2;
          this.getUser(id);
          this.getUserRole(id)
          this.dialogFormVisible = true;
          return;
      }
    },
    close() {
      this.form = {
        deleted: false,
        gmtCreate: "",
        gmtModified: "",
        id: "",
        nickName: "",
        password: "",
        roleName: "",
        salt: "",
        token: "",
        username: "",
      }
      this.checkedCities = []
      this.$refs["ruleForm"].clearValidate();
      this.dialogFormVisible = false;
    },
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.dialogType === 0) {
            let result = await this.$API.user.addUser(this.form);
            if (result.code === 20000) {
              this.$message({
                type: "success",
                message: result.message,
              });
              this.getUserList();
            }
          } else if (this.dialogType === 1) {
            let result = await this.$API.user.updateUser(this.form)
            if (result.code === 20000) {
              this.$message({
                type: "success",
                message: result.message,
              });
              this.getUserList();
            }
          } else {
            const arr = this.cities.filter(item => {
              if (this.checkedCities.indexOf(item.roleName) !== -1) {
                return true
              }
            });
            // map方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成
            const roleList = arr.map(item => item.id)
            // ==小坑==，这里需要把checkedRoles角色id数组转为字符串，并用','隔开
            let roleId = roleList.join(',')
            let obj = {
              userId: this.form.id,
              roleId: roleId
            }
            let result = await this.$API.user.assignRoles(obj)
            console.log(result)
            if (result.code === 20000) {
              this.$message({
                type: 'success',
                message: result.message
              })
              this.getUserList()
            }
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.getUserList();
    },
    handleCheckAllChange(val) {
      if (val) {
        const arr = []
        this.cities.forEach((item, index) => {
          arr[index] = item.roleName
        });
        this.checkedCities = arr
      } else {
        this.checkedCities = []
      }
      // this.checkedCities = val ? this.cities : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
  },
};
</script>

<style>
</style>
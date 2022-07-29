<template>
  <div class="box">
    <div class="header">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="dialogFormVisible = true"
        v-show="$store.state.user.buttons.indexOf('btn.Trademark.add') !== -1"
        >新增</el-button
      >
    </div>
    <div class="table">
      <el-table height="250" :data="tableData" border v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="tmName" label="品牌名称" width="width">
        </el-table-column>
        <el-table-column width="width" label="品牌Logo">
          <template slot-scope="scope">
            <img
              style="width: 206px; height: 54px"
              :src="scope.row.logoUrl"
              alt=""
            />
          </template>
        </el-table-column>
        <el-table-column min-width="width" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row, 'edit')"
              v-show="$store.state.user.buttons.indexOf('btn.Trademark.update') !== -1"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              v-show="$store.state.user.buttons.indexOf('btn.Trademark.remove') !== -1"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加分类弹出框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
        @close="close"
      >
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item
            label="品牌名称"
            :label-width="formLabelWidth"
            prop="tmName"
          >
            <el-input v-model="form.tmName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="品牌LOGO"
            :label-width="formLabelWidth"
            prop="logoUrl"
          >
            <el-upload
              class="avatar-uploader"
              action="http://localhost:9528/my_api/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="change"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // 自定义表单验证
    var tmNameRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("品牌名称不得为空！"));
      }
      if (value.length < 2 || value.length > 10) {
        callback(new Error("长度在2到10个字符之间！"));
      }
      callback();
    };
    return {
      loading: true,
      page: 1,
      limit: 10,
      total: null,
      tableData: [],
      dialogFormVisible: false,
      form: {
        id: "",
        tmName: "",
        logoUrl: "",
      },
      //表单验证规则
      rules: {
        tmName: [{ required: true, validator: tmNameRule, trigger: "change" }],
        logoUrl: [{ required: true, message: "请选择图片！" }],
      },
      dialogTitle: "添加品牌",
      formLabelWidth: "120px",
    };
  },
  methods: {
    async getList() {
      const { page, limit } = this;
      let result = await this.$API.tradeMark.getTradeMarkList(page, limit);
      if (result.code === 200) {
        this.loading = false
        this.tableData = result.data.records;
        this.total = result.data.total;
      }
    },
    close() {
      this.dialogTitle = "添加品牌";
      this.dialogFormVisible = false;
      this.form = {
        id: "",
        tmName: "",
        logoUrl: "",
      };
    },
    change(index) {
      this.page = index;
      this.getList();
    },
    handleDelete(index, val) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.tradeMark.delTradeMark(val.id);
          console.log(result);
          if (result.code === 200) {
            this.$message({
              message: result.message,
              type: "success",
            });
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleEdit(index, val) {
      this.dialogTitle = "更新品牌";
      this.dialogFormVisible = true;
      this.form = val;
    },
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submit() {
      this.$refs.ruleForm.validate(async (val) => {
        if (val) {
          if (this.dialogTitle === "添加品牌") {
            let result = await this.$API.tradeMark.addTradeMark(this.form);
            this.dialogFormVisible = false;
            this.form = {
              tmName: "",
              logoUrl: "",
            };
            if (result.code === 200) {
              this.$message({
                message: result.message,
                type: "success",
              });
              this.getList();
            }
          } else {
            let result = await this.$API.tradeMark.updateTradeMark(this.form);
            this.dialogFormVisible = false;
            this.form = {
              id: "",
              tmName: "",
              logoUrl: "",
            };
            if (result.code === 200) {
              this.$message({
                message: result.message,
                type: "success",
              });
              this.getList();
            }
          }
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss">
.box {
  display: flex;
  flex-direction: column;
  height: 85vh;

  .table {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    height: 0;
    overflow: hidden;
    overflow-y: auto;
    flex-grow: 1;
  }

  .page {
    padding: 20px 0 0 0;
    margin: 0 auto;
  }
}

.el-table__body-wrapper::-webkit-scrollbar {
  width: 0 !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
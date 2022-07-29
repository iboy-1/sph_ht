<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <LinkageSelect
        :options_one="options_one"
        :options_two="options_two"
        :options_three="options_three"
        @change_one="change_one"
        @change_two="change_two"
        @change_three="change_three"
      ></LinkageSelect>
    </el-card>

    <el-card class="box-card">
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!isClick"
          @click="dialogFormAdd = true"
          >添加Spu</el-button
        >
        <el-table
          :data="tableData"
          height="330"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                @click="addSku(scope.row)"
              ></el-button>
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="appear(scope.row)"
              ></el-button>
              <el-button
                type="info"
                size="mini"
                icon="el-icon-info"
                @click="getSkuList(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete-solid"
                @click="del(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :total="total"
          style="text-align: center; padding-top: 20px"
          v-show="tableData.length > 0"
        >
        </el-pagination>
      </div>

      <el-dialog top="5vh" width="70%" :visible.sync="dialogFormAdd">
        <SpuForm
          @close="close"
          @getList="getList"
          :itemid="id"
          :category3Id="category3Id"
          type="add"
        ></SpuForm>
      </el-dialog>

      <el-dialog top="5vh" width="70%" :visible.sync="dialogFormUpdate">
        <SpuForm
          @close="close"
          @getList="getList"
          :itemid="id"
          type="update"
          :dialogFormUpdate="dialogFormUpdate"
        ></SpuForm>
      </el-dialog>

      <el-dialog
        top="5vh"
        width="70%"
        :visible.sync="dialogSkuFormAdd"
        @close="close"
      >
        <SkuForm
          @close="close"
          :spuInfo="spuInfo"
          :spuName="spuName"
          type="skuAdd"
          ref="skuForm"
          v-if="dialogSkuFormAdd"
        ></SkuForm>
      </el-dialog>

      <el-dialog :title="`${title}的列表`" :visible.sync="dialogTableVisible" @close="reset">
        <el-table :data="SkuList" height="400">
          <el-table-column
            property="skuName"
            label="名称"
            width="width"
          ></el-table-column>
          <el-table-column
            property="price"
            label="价格"
            width="width"
          ></el-table-column>
          <el-table-column
            property="weight"
            label="重量"
            width="width"
          ></el-table-column>
          <el-table-column
            property="skuDefaultImg"
            label="默认图片"
            width="width"
          >
            <template scope="scope">
              <img style="width: 100%" :src="scope.row.skuDefaultImg" alt="">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./components/SpuForm";
import SkuForm from "./components/SkuForm";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      isClick: false,
      dialogFormAdd: false,
      dialogFormUpdate: false,
      dialogSkuFormAdd: false,
      category1Id: null,
      category2Id: null,
      category3Id: null,
      options_one: [],
      options_two: [],
      options_three: [],
      tableData: [],
      page: 1,
      limit: 10,
      total: null,
      id: null,
      spuInfo: {}, // 传给skuForm组件的数据
      spuName: "",
      title: "",
      dialogTableVisible: false,
      SkuList: [],
    };
  },
  methods: {
    appear(val) {
      this.dialogFormUpdate = true;
      this.id = val.id;
    },
    addSku(val) {
      console.log(val);
      this.dialogSkuFormAdd = true;
      // this.id = val.id;
      this.spuInfo.id = val.id;
      this.spuInfo.category3Id = this.category3Id;
      this.spuInfo.tmId = val.tmId;
      this.spuName = val.spuName;
      this.$nextTick(() => {
        this.$refs.skuForm.init(
          this.category1Id,
          this.category2Id,
          this.category3Id
        );
      });
    },
    async getList() {
      let result = await this.$API.spu.getSpuList(
        this.page,
        this.limit,
        this.category3Id
      );
      if (result.code === 200) {
        this.tableData = result.data.records;
        this.total = result.data.total;
      }
    },
    async getCategoryOne() {
      let result = await this.$API.attr.getCategoryOne();
      if (result.code === 200) {
        this.options_one = result.data;
      }
    },
    async change_one(id) {
      let result = await this.$API.attr.getCategoryTwo(id);
      if (result.code === 200) {
        this.options_two = result.data;
      }
      this.tableData = [];
      this.isClick = false;
    },
    async change_two(id) {
      let result = await this.$API.attr.getCategoryThree(id);
      if (result.code === 200) {
        this.options_three = result.data;
      }
      this.tableData = [];
      this.isClick = false;
    },
    change_three(one_id, two_id, three_id) {
      // this.form.categoryId = three_id
      this.category1Id = one_id;
      this.category2Id = two_id;
      this.category3Id = three_id;
      this.isClick = true;
      this.getList();
    },
    handleCurrentChange(val) {
      this.getList();
    },
    close(type) {
      if (type === "add") {
        this.dialogFormAdd = false;
      } else if (type === "update") {
        this.dialogFormUpdate = false;
      } else {
        // this.$nextTick(() => {
        //   this.$refs.skuForm.reset();
        // });
        this.dialogSkuFormAdd = false;
      }
    },
    del(val) {
      console.log(val);
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.spu.del(val.id);
          if (result.code === 200) {
            this.$message({
              message: result.message,
              type: "success",
            });
            this.getList();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(() => {});
    },
    async getSkuList(val) {
      this.dialogTableVisible = true
      this.title = val.spuName
      let result = await this.$API.sku.getSkuList(val.id);
      console.log(result);
      if (result.code === 200) {
        this.SkuList = result.data
      }
    },
    reset() {
      this.SkuList = [],
      this.title = ''
    }
  },
  mounted() {
    // this.getList();
    this.getCategoryOne();
  },
};
</script>
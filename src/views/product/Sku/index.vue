<template>
  <div>
    <el-table :data="tableData" border height="80vh" style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        label="名称"
        prop="skuName"
        width="width"
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="skuDesc"
        width="width"
      ></el-table-column>
      <el-table-column label="默认图片" align="center" width="120">
        <template scope="scope">
          <img style="width: 80%" :src="scope.row.skuDefaultImg" alt="" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(KG)"
        prop="weight"
        width="width"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        prop="price"
        width="80"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-bottom"
            @click="setSkuCancelSale(scope.row.id)"
            v-if="scope.row.isSale === 1"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-top"
            @click="setSkuOnSale(scope.row.id)"
            v-else
          ></el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="look(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
      style="text-align: center; padding-top: 20px"
    >
    </el-pagination>

    <el-drawer :visible.sync="drawer" :with-header="false" size="50%">
      <div class="box" style="padding: 20px 50px">
        <div class="item">
          <h4>名称</h4>
          <p>{{skuInfo.skuName}}</p>
        </div>
        <div class="item">
          <h4>描述</h4>
          <p>{{skuInfo.skuDesc}}</p>
        </div>
        <div class="item">
          <h4>价格</h4>
          <p>{{skuInfo.price}}</p>
        </div>
        <div class="item">
          <h4>平台属性</h4>
          <p>是看得见</p>
        </div>
        <div class="item" style="align-items: flex-start;flex: 1">
          <h4>商品图片</h4>
          <el-carousel height="300">
            <el-carousel-item v-for="item in 4" :key="item">
              <h3 class="small">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      total: null,
      tableData: [{}],
      drawer: false,
      skuInfo: {}
    };
  },
  methods: {
    async getSkuList() {
      let result = await this.$API.sku.getSkuListData(this.page, 10);
      if (result.code === 200) {
        this.total = result.data.total;
        this.tableData = result.data.records;
      }
    },
    async setSkuOnSale(id) {
      let result = await this.$API.sku.setSkuOnSale(id);
      if (result.code === 200) {
        this.$message({
          type: "success",
          message: result.message,
        });
        this.getSkuList();
      }
    },
    async setSkuCancelSale(id) {
      let result = await this.$API.sku.setSkuCancelSale(id);
      if (result.code === 200) {
        this.$message({
          type: "success",
          message: result.message,
        });
        this.getSkuList();
      }
    },
    look(val) {
      this.skuInfo = val
      this.drawer = true
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.sku.deleteSku(id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getSkuList();
          }
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getSkuList();
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  h4 {
    width: 120px;
    text-align: right;
    color: #333;
    margin: 10px 20px 10px 0;
  }
  p {
    margin: 10px;
    flex: 1;
  }
}
</style>
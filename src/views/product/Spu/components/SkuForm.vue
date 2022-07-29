<template>
  <div class="model">
    <div class="form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="SPU名称" prop="name">
          {{ spuName }}
        </el-form-item>
        <el-form-item label="SKU名称" prop="skuName">
          <el-input v-model="ruleForm.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格（元）" prop="price">
          <el-input v-model="ruleForm.price"></el-input>
        </el-form-item>
        <el-form-item label="重量（千克）" prop="weight">
          <el-input v-model="ruleForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述" prop="skuDesc">
          <el-input type="textarea" v-model="ruleForm.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性" prop="name">
          <div class="item_box">
            <div
              class="item"
              v-for="(item, index) in skuAttrValueList"
              :key="item.id"
            >
              <h4>{{ item.attrName }}</h4>
              <el-select v-model="ruleForm.skuAttrValueList[index].valueId" placeholder="请选择">
                <el-option
                  v-for="val in item.attrValueList"
                  :key="val.id"
                  :label="val.valueName"
                  :value="val.id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="销售属性" prop="name">
          <div class="item_box">
            <div
              class="item"
              v-for="(item, index) in skuSaleAttrValueList"
              :key="item.id"
            >
              <h4>{{ item.saleAttrName }}</h4>
              <el-select v-model="ruleForm.skuSaleAttrValueList[index].saleAttrValueId" placeholder="请选择">
                <el-option
                  v-for="val in item.spuSaleAttrValueList"
                  :key="val.id"
                  :label="val.saleAttrValueName"
                  :value="val.id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="图片列表">
          <el-table
            :data="spuImgList"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%"
          >
            <el-table-column type="selection" width="80"> </el-table-column>
            <el-table-column prop="date" label="图片" width="width">
              <template scope="scope">
                <img class="img" :src="scope.row.imgUrl" alt="" />
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称" width="width">
            </el-table-column>
            <el-table-column label="操作" width="width">
              <template scope="scope">
                <el-button type="primary" size="mini" v-if="scope.row.isDefault === 0" @click="setDefault(scope.row)">设为默认</el-button>
                <el-button type="success" plain size="mini" v-else>默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close(type)">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  props: {
    type: {
      type: String,
      required: true,
    },
    // id: {
    //   type: Number,
    //   required: true,
    // },
    spuName: {
      type: String,
      required: true,
    },
    spuInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ruleForm: {
        category3Id: this.spuInfo.category3Id,
        createTime: "",
        isSale: null,
        price: null,
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuDesc: "",
        skuImageList: [],
        skuName: "",
        skuSaleAttrValueList: [],
        spuId: this.spuInfo.id,
        tmId: this.spuInfo.tmId,
        weight: "",
      },
      rules: {

      },
      spuImgList: [],
      // 平台属性列表
      skuAttrValueList: [],
      // 销售属性列表
      skuSaleAttrValueList: [],
      value: "",
    };
  },
  methods: {
    async init(category1Id, category2Id, category3Id) {
      let result1 = await this.$API.spu.getSpuImg(this.spuInfo.id);
      if (result1.code === 200) {
        this.spuImgList = result1.data
        this.spuImgList.forEach(item => {
          this.$set(item, 'isDefault', 0)
        })
      }
      let result2 = await this.$API.sku.getSpuSaleAttrList(this.spuInfo.id);
      if (result2.code === 200) {
        // this.ruleForm.skuSaleAttrValueList = result2.data;
        this.skuSaleAttrValueList = result2.data;
        this.skuSaleAttrValueList.forEach(item => {
          const {id, baseSaleAttrId, spuSaleAttrValueList, ...obj} = item
          obj.saleAttrId = id
          obj.saleAttrValueId = null
          obj.saleAttrValueName = ""
          this.ruleForm.skuSaleAttrValueList.push(obj)
        });
      }
      let result3 = await this.$API.attr.getCategoryDetail(
        category1Id,
        category2Id,
        category3Id
      );
      if (result3.code === 200) {
        this.skuAttrValueList = result3.data;
        this.skuAttrValueList.forEach(item => {
          let obj = {}
          obj.attrId = item.id
          obj.attrName = item.attrName
          obj.valueId = null
          obj.valueName = ""
          this.ruleForm.skuAttrValueList.push(obj)
        });
      }
    },
    close(type) {
      this.$emit("close", type);
    },
    setDefault(val) {
      console.log(this.spuImgList)
      this.spuImgList.forEach(item => {
        item.isDefault = 0
      })
      val.isDefault = 1
      this.ruleForm.skuDefaultImg = val.imgUrl
    },
    async submit() {
      let result = await this.$API.sku.addSku(this.ruleForm)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: result.message
        })
      }
    },
    handleSelectionChange(val) {
      val.forEach(item => {
        const { id, spuId, ...obj } = item
        obj.spuImgId = id
        this.ruleForm.skuImageList.push(obj)
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.model {
  height: 78vh;
  display: flex;
  flex-direction: column;
}
.form {
  height: 0;
  overflow: hidden;
  overflow-y: auto;
  flex-grow: 1;
}
.item_box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
    h4 {
      width: 60px;
      margin: 0 20px;
      text-align: right;
    }
  }
}
.img {
  // width: 100%;
  margin: 0 auto;
  height: 100px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: center;
}
.form::-webkit-scrollbar {
  width: 0 !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
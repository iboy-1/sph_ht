<template>
  <div class="model">
    <div class="form">
      <el-form label-position="right">
        <el-form-item label="SPU名称" :label-width="formLabelWidth">
          <el-input v-model="spu.spuName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌" :label-width="formLabelWidth">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="item in tradeMarkList"
              :key="item.id"
              :label="item.tmName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="spu.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="SPU图片" :label-width="formLabelWidth">
          <el-upload
            action="/my_api/admin/product/fileUpload"
            list-type="picture-card"
            :file-list="spuImgList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性" :label-width="formLabelWidth">
          <el-select v-model="salesAttr" :placeholder="tips">
            <el-option
              v-for="item in attrFormList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            style="margin-left: 20px"
            type="primary"
            icon="el-icon-plus"
            :disabled="!salesAttr"
            @click="addAttr"
            >添加销售属性</el-button
          >
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-table :data="spu.spuSaleAttrList" border style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              label="序号"
              width="80"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名" width="180">
            </el-table-column>
            <el-table-column label="属性名称列表" min-width="180">
              <template scope="scope">
                <el-tag
                  :key="tag.id"
                  v-for="(tag, index) in scope.row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row, index)"
                >
                  {{ tag.saleAttrValueName }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"
                ></el-button>
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
  name: "SpuForm",
  props: {
    type: {
      type: String,
      default: "add",
    },
    itemid: {
      type: Number,
      default: -1,
    },
    category3Id: {
      type: Number,
      default: -1,
    },
    dialogFormUpdate: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    attrFormList() {
      const arr = this.attrList.filter((item) => {
        //every——数组方法，返回一个布尔值
        return this.spu.spuSaleAttrList.every((element) => {
          return item.name != element.saleAttrName;
        });
      });
      this.tips = "还有" + arr.length + "项未选择";
      return arr;
    },
  },
  data() {
    return {
      spuId: null,
      spu: {
        category3Id: this.category3Id, // 3级分类id
        description: "", // spu描述
        spuName: "", // spu名称
        tmId: null, // 品牌id
        spuImageList: [
          // spu图片列表信息收集
          // {
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // 平台属性与属性值的收集
          // {
          //   baseSaleAttrId: null,
          //   saleAttrName: null,
          //   spuId: null,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: null,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: null,
          //     },
          //   ],
          // },
        ],
      },
      salesAttr: null,
      formLabelWidth: "120px",
      dialogImageUrl: "",
      dialogVisible: false,
      attrList: [],
      tradeMarkList: [],
      spuImgList: [],
      inputVisible: false,
      tips: "",
    };
  },
  methods: {
    async getTradeMarkList() {
      let result = await this.$API.spu.getTradeMarkList();
      console.log(result);
      if (result.code === 200) {
        this.tradeMarkList = result.data;
      }
    },
    async getSpuImg(id) {
      let result = await this.$API.spu.getSpuImg(id);
      console.log(result);
      if (result.code === 200) {
        result.data.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImgList = result.data;
        const arr = [];
        this.spuImgList.forEach((item) => {
          const obj = {
            imgName: item.imgName,
            imgUrl: item.imgUrl,
            spuId: item.spuId,
          };
          arr.push(obj);
        });
        this.spu.spuImageList = arr;
      }
    },
    async getSpuById(id) {
      let result = await this.$API.spu.getSpuById(id);
      console.log(result);
      if (result.code === 200) {
        // this.spu.spuName = result.data.spuName;
        // this.spu.description = result.data.description;
        // this.spu.tmId = result.data.tmId;
        // this.spu.spuSaleAttrList = result.data.spuSaleAttrList;
        this.spu = result.data;
        this.spu.spuSaleAttrList.forEach((item) => {
          this.$set(item, "inputValue", "");
          this.$set(item, "inputVisible", false);
        });
      }
    },
    async getBaseSaleAttrList() {
      let result = await this.$API.spu.getBaseSaleAttrList();
      console.log(result);
      this.attrList = result.data;
    },
    handleRemove(file, fileList) {
      this.spuImgList = fileList;
      const arr = [];
      this.spuImgList.forEach((item) => {
        const obj = {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          spuId: item.spuId,
        };
        arr.push(obj);
      });
      this.spu.spuImageList = arr;
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      if (response.code === 200) {
        this.spuImgList = fileList;
        const arr = [];
        this.spuImgList.forEach((item) => {
          if (item["response"]) {
            item.imgUrl = response.data;
            item.imgName = item.name;
            item.spuId = this.itemid;
          }
          const obj = {
            imgName: item.name,
            imgUrl: item.imgUrl,
            spuId: item.spuId,
          };
          arr.push(obj);
        });
        this.spu.spuImageList = arr;
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    addAttr() {
      let index = -1;
      for (let i = 0; i < this.attrList.length; i++) {
        if (this.attrList[i].id === this.salesAttr) {
          index = i;
        }
      }
      const obj = {
        baseSaleAttrId: this.attrList[index].id,
        saleAttrName: this.attrList[index].name,
        spuId: this.itemid,
        spuSaleAttrValueList: [],
        inputVisible: false,
        inputValue: "",
      };
      this.spu.spuSaleAttrList.push(obj);
      this.salesAttr = null;
      console.log(this.spu.spuSaleAttrList);
    },
    handleDelete(index, val) {
      this.spu.spuSaleAttrList.splice(index, 1);
    },
    close(type) {
      this.spu = {
        category3Id: this.category3Id, // 3级分类id
        description: "", // spu描述
        spuName: "", // spu名称
        tmId: null, // 品牌id
        spuImageList: [],
        spuSaleAttrList: [],
      },
      this.spuImgList = []
      this.$emit("close", type);
    },
    handleClose(val, index) {
      val.spuSaleAttrValueList.splice(index, 1);
    },

    showInput(val) {
      console.log(val);
      val.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(val) {
      console.log(val);
      let inputValue = val.inputValue;
      if (inputValue) {
        const obj = {
          baseSaleAttrId: val.baseSaleAttrId,
          isChecked: null,
          saleAttrName: val.saleAttrName,
          saleAttrValueName: inputValue,
          spuId: val.spuId,
        };
        val.spuSaleAttrValueList.push(obj);
      }
      val.inputVisible = false;
      val.inputValue = "";
    },
    async submit() {
      if (this.dialogFormUpdate) {
        let result = await this.$API.spu.update(this.spu);
        console.log(result);
        if (result.code === 200) {
          this.$message({
            message: result.message,
            type: "success",
          });
        } else {
          this.$message.error(result.message);
        }
        this.close('update');
      } else {
        let result = await this.$API.spu.add(this.spu);
        if (result.code === 200) {
          this.$message({
            message: result.message,
            type: "success",
          });
        } else {
          this.$message.error(result.message);
        }
        this.close('add');
      }
      this.$emit("getList");
    },
  },
  watch: {
    dialogFormUpdate: {
      immediate: true,
      handler(val) {
        if (val === true) {
          this.getSpuById(this.itemid);
          this.getSpuImg(this.itemid);
        }
      },
    },
  },
  mounted() {
    this.getTradeMarkList();
    this.getBaseSaleAttrList();
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


[1,2,3]
[2,3]
[1, ]
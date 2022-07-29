<template>
  <div class="box">
    <el-card shadow="always" style="margin-bottom: 20px">
      <LinkageSelect
        :options_one="options_one"
        :options_two="options_two"
        :options_three="options_three"
        :state="isForm"
        @clear="clear"
        @change_one="change_one"
        @change_two="change_two"
        @change_three="change_three"
      >
      </LinkageSelect>
    </el-card>

    <el-card shadow="always">
      <div v-show="!isForm">
        <el-button
          style="margin-bottom: 20px"
          type="primary"
          icon="el-icon-plus"
          @click="isForm = true"
          :disabled="isDisabled"
        >
          新增属性
        </el-button>
        <el-table height="380" :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="160">
          </el-table-column>
          <el-table-column min-width="646" label="属性值列表">
            <template slot-scope="scope">
              <el-tag
                type="success"
                style="margin-right: 10px"
                v-for="item in scope.row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性表单 -->
      <div v-show="isForm">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="属性名称">
            <el-input style="width: 200px" v-model="form.attrName"></el-input>
          </el-form-item>

          <el-button
            style="margin-bottom: 20px"
            type="primary"
            icon="el-icon-plus"
            @click="addValue"
            :disabled="form.attrName === ''"
          >
            添加属性值
          </el-button>
          <el-button @click="clearAttrValue">取消</el-button>
          <el-table height="260" :data="form.attrValueList" border style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column width="width" label="属性值名称">
              <template slot-scope="scope">
                <div v-if="!scope.row.isInput" @click="scope.row.isInput = true">{{scope.row.valueName}}</div>
                <div v-else>
                  <el-input ref="attr_val" v-model="scope.row.valueName" placeholder="" size="mini" @blur="addAttr(scope.$index, scope.row)"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="width" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="delAttrValue(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="padding: 20px 0">
            <el-button
              style="margin-bottom: 20px"
              type="primary"
              @click="submit"
              :disabled="form.attrName === ''"
            >
              保存
            </el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: null,
      category2Id: null,
      category3Id: null,
      options_one: [],
      options_two: [],
      options_three: [],
      tableData: [],
      isDisabled: true,
      isForm: false,
      form: {
        attrName: "",
        attrValueList: [],
        categoryId: null,
        categoryLevel: 3,
      },
      attrId: undefined
    };
  },
  mounted() {
    this.getCategoryOne();
  },
  methods: {
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
    },
    async change_two(id) {
      let result = await this.$API.attr.getCategoryThree(id);
      if (result.code === 200) {
        this.options_three = result.data;
      }
    },
    async change_three(one_id, two_id, three_id) {
      this.form.categoryId = three_id
      this.category1Id = one_id
      this.category2Id = two_id
      this.category3Id = three_id
      this.isDisabled = false;
      let result = await this.$API.attr.getCategoryDetail(
        one_id,
        two_id,
        three_id
      );
      if (result.code === 200) {
        this.tableData = result.data;
      }
    },
    clear() {
      this.tableData = [];
      this.isDisabled = true;
    },
    clearAttrValue() {
      this.form.attrValueList = []
    },
    addValue() {
      let obj = {
        isInput: true,
        attrId: this.attrId,
        valueName: ''
      }
      this.form.attrValueList.push(obj)
      this.$nextTick(() => {
        this.$refs.attr_val.focus()
      })
    },
    delAttrValue(index) {
      console.log(index)
      this.form.attrValueList.splice(index, 1)
    },
    addAttr(index, val) {
      if (val.valueName !== '') {
        val.isInput = false
      } else {
        this.delAttrValue(index)
      }
    },
    close() {
      this.isForm = false
      this.form.attrName = ''
      this.clearAttrValue()
    },
    handleDelete(id) {
      console.log(id)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$API.attr.delAttr(id)
        if (result.code === 200) {
          this.$message({
            message: result.message,
            type: 'success'
          })
          this.change_three(this.category1Id, this.category2Id, this.category3Id)
        }
      }).catch(() => {

      })
    },
    handleEdit(val) {
      this.isForm = true
      this.attrId = val.id
      this.form = JSON.parse(JSON.stringify(val))
      this.form.attrValueList.forEach(item => {
        this.$set(item, 'isInput', false)
      })
    },
    async submit() {
      console.log(this.form)
      let result = await this.$API.attr.addAttr(this.form)
      if (result.code === 200) {
        this.$message({
            message: result.message,
            type: 'success'
        });
        this.close()
        this.change_three(this.category1Id, this.category2Id, this.category3Id)
      }
    }
  },
};
</script>

<style lang="scss">
.box {
  height: 85vh;
  display: flex;
  flex-direction: column;
}
.el-table__body-wrapper::-webkit-scrollbar {
  width: 0 !important;
}
</style>
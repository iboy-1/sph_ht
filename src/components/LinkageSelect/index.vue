<template>
  <div>
    <span class="title">一级分类</span>
    <el-select
     v-model="select_one.value"
      filterable 
      :disabled="state" 
      placeholder="请选择" 
      @change="change_one"
      style="margin: 0 15px;padding: 20px 0">
        <el-option
         v-for="item in options_one"
         :key="item.id"
         :label="item.name"
         :value="item.id">
        </el-option>
  </el-select>
  <span class="title">二级分类</span>
    <el-select
     v-model="select_two.value" 
     filterable 
     :disabled="state" 
     placeholder="请选择" 
     @change="change_two"
     style="margin: 0 15px;">
        <el-option
         v-for="item in options_two"
         :key="item.id"
         :label="item.name"
         :value="item.id">
        </el-option>
  </el-select>
  <span class="title">三级分类</span>
    <el-select
     v-model="select_three.value" 
     filterable 
     :disabled="state" 
     placeholder="请选择" 
     @change="change_three"
     style="margin: 0 15px;">
        <el-option
         v-for="item in options_three"
         :key="item.id"
         :label="item.name"
         :value="item.id">
        </el-option>
  </el-select>
  </div>
</template>

<script>
export default {
    name: 'LinkageSelect',
    props: {
        options_one: {
            type: Array,
            required: true
        },
        options_two: {
            type: Array,
            required: true
        },
        options_three: {
            type: Array,
            required: true
        },
        state: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            select_one: {
                id: '',
                value: ''
            },
            select_two: {
                id: '',
                value: ''
            },
            select_three: {
                id: '',
                value: ''
            }
        }
    },
    watch: {
        select_three: {
            deep: true,
            handler(item) {
                if (item.value === '') {
                    this.$emit('clear')
                }
            }
        }
    },
    methods: {
        change_one(val) {
            this.select_two.value = ''
            this.select_three.value = ''
            this.select_one.id = val
            this.$emit('change_one', val)
        },
        change_two(val) {
            this.select_three.value = ''
            this.select_two.id = val
            this.$emit('change_two', val)
        },
        change_three(val) {
            this.$emit('change_three', this.select_one.id, this.select_two.id, val)
        }
    }
}
</script>

<style lang="scss" scoped>
    .title {
        font-weight: 600;
        color: #333333;
    }
</style>
<template>
  <div>
    <!--<div class="condition">-->
    <!--<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm"-->
    <!--size="small">-->
    <!--<el-form-item label="年龄段" prop="wordname">-->
    <!--<el-select v-model="ruleForm.agerange" placeholder="请选择">-->
    <!--<el-option-->
    <!--v-for="item in ageranges"-->
    <!--:key="item.value"-->
    <!--:label="item.label"-->
    <!--:value="item.value">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="口音" prop="groupname">-->
    <!--<el-select v-model="ruleForm.kouyin" placeholder="请选择">-->
    <!--<el-option-->
    <!--v-for="item in kouyins"-->
    <!--:key="item.value"-->
    <!--:label="item.label"-->
    <!--:value="item.value">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="口音类型" prop="groupname">-->
    <!--<el-select v-model="ruleForm.kouyinType" placeholder="请选择">-->
    <!--<el-option-->
    <!--v-for="item in kouyinTypes"-->
    <!--:key="item.value"-->
    <!--:label="item.label"-->
    <!--:value="item.value">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!--<el-form-item class="btn-box">-->
    <!--<el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>-->
    <!--<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</div>-->
    <div class="main-box">
      <div class="btn-add">
        <el-button type="primary" @click="addWord('ruleForm')" size="small">添加</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        size="small"
        :header-cell-style="headerRowClassName"
        style="width: 100%">
        <el-table-column
          prop="id"
          width="150"
          align="center"
          label="唯一标示"
        >
        </el-table-column>
        <el-table-column
          prop="ageLabel"
          align="center"
          label="年龄段"
        >
        </el-table-column>
        <el-table-column
          prop="sexLabel"
          align="center"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="typeLabel"
          align="center"
          label="口音">
        </el-table-column>
        <el-table-column
          prop="accentLabel"
          align="center"
          label="口音类型">
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="updateWord(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteWord(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="titlename" :visible.sync="dialogFormVisible" @close="close">
      <el-form :model="addFrom" size="small" ref="addFrom" :rules="rules">
        <el-form-item label="年龄段" label-width="120px" class="maginbox" prop="agerange">
          <el-select v-model="addFrom.agerange" placeholder="请选择">
            <el-option
              v-for="item in ageranges"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" v-model="addFrom.sex" placeholder="请选择" label-width="120px" prop="sex">
          <el-radio-group v-model="addFrom.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="口音" label-width="120px" class="maginbox" prop="kouyin">
          <el-select v-model="addFrom.kouyin" placeholder="请选择">
            <el-option
              v-for="item in kouyins"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="口音" label-width="120px" class="maginbox" prop="kouyinType">
          <el-select v-model="addFrom.kouyinType" placeholder="请选择">
            <el-option
              v-for="item in kouyinTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        total: 0,
        ageranges: [{
          value: '1',
          label: '儿童 1-9 岁'
        }, {
          value: '2',
          label: '少年 10-17 岁'
        }, {
          value: '3',
          label: '青年 18-40 岁'
        }, {
          value: '4',
          label: '中年 41-64 岁'
        }, {
          value: '5',
          label: '老年 65 以上'
        }],
        kouyins: [{
          value: '1',
          label: '普通话口音'
        }, {
          value: '2',
          label: '方言'
        }],
        kouyinTypes: [
          {
            value: '1',
            label: '南方口音'
          }, {
            value: '2',
            label: '北方口音'
          }, {
            value: '3',
            label: '两广口音'
          }, {
            value: '4',
            label: '东北口音'
          }
        ],
        dialogFormVisible: false,
        titlename: '',
        isAdd: true,
        currentPage: 1,
        tableData: [],
        ruleForm: {
          agerange: '',
          kouyin: '',
          kouyinType: ''
        },
        rules: {
          agerange: [
            { required: true, message: '请选择年龄段', trigger: 'change' }
          ],
          kouyin: [
            { required: true, message: '请选择口音', trigger: 'change' }
          ],
          kouyinType: [
            { required: true, message: '请选择口型', trigger: 'change' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ]
        },
        addFrom: {
          agerange: '',
          kouyin: '',
          kouyinType: '',
          sex: ''
        },
        currentrow: {}
      }
    },
    mounted () {
      this.getListData()
    },
    methods: {
      getListData () {
        let params = {
          current: this.currentPage,
          size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/speaker/getPageList', params, res => {
          if (res.code == 200) {
            that.tableData = res.data.records
            that.total = res.data.total
          }
        })
      },
      headerRowClassName () {
        return 'background: #2196f3;color:#ffffff'
      },
      deleteWord (row) {
        let that = this
        this.$confirm('此操作将删除该词条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.Axios.allRequestPost(`/voice/speaker/delete/${row.id}`, {}, res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                showClose: true,
                message: '删除成功!'
              })
              that.getListData()
            } else {
              this.$message({
                type: 'error',
                showClose: true,
                message: '删除失败'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            showClose: true,
            message: '已取消删除'
          })
        })
      },
      handleSizeChange (page) {
        this.currentPage = page
        this.getListData()
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getListData()
      },
      addWord () {
        this.isAdd = true
        this.titlename = '新增说话人'
        this.dialogFormVisible = true
      },
      updateWord (row) {
        this.isAdd = false
        this.titlename = '修改说话人'
        this.currentrow = row
        this.dialogFormVisible = true
        this.addFrom.agerange = row.age + ''
        this.addFrom.kouyin = row.type + ''
        this.addFrom.sex = row.sex
        this.addFrom.kouyinType = row.accent + ''
      },
      close () {
        this.$refs.addFrom.clearValidate()
        this.$refs.addFrom.resetFields()
      },
      save () {
        let that = this
        this.$refs.addFrom.validate((valid) => {
            if (valid) {
              let params = {
                age: that.addFrom.agerange,
                'accent': that.addFrom.kouyinType,
                'sex': that.addFrom.sex,
                'type': that.addFrom.kouyin
              }
              let url = '/voice/speaker/update'
              if (this.isAdd) {
                url = '/voice/speaker/add'
              } else {
                params.id = this.currentrow.id
              }
              that.Axios.allRequestPost(url, params, (res) => {
                if (res.code == 200) {
                  that.$refs.addFrom.resetFields()
                  that.$refs.addFrom.clearValidate()
                  that.dialogFormVisible = false
                  that.currentPage = 1
                  that.getListData()
                }
              })
            } else {
              return false
            }
          }
        )
      }
    }
  }
</script>
<style lang="less" scoped>
  .condition {
    background: #f2f2f2;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    .line {
      text-align: center;
    }
  }

  .btn-box {
    margin-left: 20px;
  }

  .main-box {
    margin-top: 20px;
    .btn-add {
      margin: 10px 0;
    }
  }

  .maginbox {
    margin: 20px 0 !important;
  }

  .el-form-item__content .el-input,
  .el-form-item__content .el-select,
  .el-form-item__content .el-textarea,
  .el-form-item__content .el-radio-group {
    width: 200px !important;
  }
</style>

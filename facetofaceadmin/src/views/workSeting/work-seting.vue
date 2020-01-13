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
          prop="number"
          align="center"
          label="人数">
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
        <el-form-item label="说话人信息" label-width="120px" class="maginbox" prop="speekPerson">
          <el-dropdown>
            <el-input v-model="addFrom.speekPerson" clearable @clear="clearSelectionChange"></el-input>
            <el-dropdown-menu slot="dropdown">
              <el-table
                :data="speekPersonList"
                border
                ref="multipleTable"
                size="small"
                max-height="250"
                :header-cell-style="headerRowClassName"
                style="width: 100%"
                @current-change="handleCurrentTableChange"
              >
                <el-table-column
                  prop="id"
                  align="center"
                  show-overflow-tooltip
                  label="唯一标示"
                >
                </el-table-column>
                <el-table-column
                  prop="ageLabel"
                  align="center"
                  show-overflow-tooltip
                  label="年龄段"
                >
                </el-table-column>
                <el-table-column
                  prop="sexLabel"
                  align="center"
                  show-overflow-tooltip
                  label="性别"
                >
                </el-table-column>
                <el-table-column
                  prop="typeLabel"
                  align="center"
                  show-overflow-tooltip
                  label="口音"
                >
                </el-table-column>
                <el-table-column
                  prop="accentLabel"
                  align="center"
                  show-overflow-tooltip
                  label="口音类型"
                >
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSpeekSizeChange"
                @current-change="handleSpeekCurrentChange"
                layout="prev, pager, next"
                :current-page.sync="speekPage"
                :total="speekPersontotal">
              </el-pagination>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="人数" v-model="addFrom.number" placeholder="请选择" label-width="120px" prop="number">
          <el-input v-model="addFrom.number"></el-input>
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
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('人数不能为空'))
        }
        let reg = /^[1-9]\d*$/
        if (!reg.test(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }
      return {
        speekPersonList: [],
        speekPersontotal: 0,
        speekPage: 1,
        total: 0,
        ageranges: [{
          value: '01',
          label: '儿童 1-9 岁'
        }, {
          value: '02',
          label: '少年 10-17 岁'
        }, {
          value: '03',
          label: '青年 18-40 岁'
        }, {
          value: '04',
          label: '中年 41-64 岁'
        }, {
          value: '05',
          label: '老年 65 以上'
        }],
        kouyins: [{
          value: '01',
          label: '普通话口音'
        }, {
          value: '02',
          label: '方言'
        }],
        kouyinTypes: [
          {
            value: '01',
            label: '南方口音'
          }, {
            value: '02',
            label: '北方口音'
          }, {
            value: '03',
            label: '东北口音'
          }, {
            value: '04',
            label: '东北口音'
          }
        ],
        dialogFormVisible: false,
        titlename: '',
        isAdd: true,
        currentPage: 1,
        tableData: [],
        currentRow: {},
        ruleForm: {
          agerange: '',
          kouyin: '',
          kouyinType: ''
        },
        rules: {
          speekPerson: [
            { required: true, message: '请选择说话人', trigger: 'input' }
          ],
          number: [
            { required: true, message: '请填写人数', trigger: 'blur' },
            { validator: checkAge, trigger: 'blur' }
          ]
        },
        addFrom: {
          speekPerson: '',
          speekPersonId: '',
          number: ''
        }
      }
    },
    mounted () {
      this.getListData()
    },
    methods: {
      clearSelectionChange () {
        this.addFrom.speekPerson = ''
      },
      handleCurrentTableChange (val) {
        if (val) {
          this.addFrom.speekPerson = `${val.id}/${val.ageLabel}/${val.sexLabel}/${val.typeLabel}/${val.accentLabel}`
          this.addFrom.speekPersonId = val.id
        }
      },
      headerRowClassName () {
        return 'background: #2196f3;color:#ffffff'
      },
      getPersonListData () {
        let params = {
          current: this.speekPage,
          size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/speaker/getPageList', params, res => {
          if (res.code == 200) {
            that.speekPersonList = res.data.records
            that.speekPersontotal = res.data.total
          }
        })
      },
      getListData () {
        let params = {
          current: this.currentPage,
          size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/taskControl/getPageList', params, (res) => {
          if (res.code == 200) {
            that.tableData = res.data.records
            that.total = res.data.total
          }
        })
      },
      deleteWord (row) {
        let that = this
        this.$confirm('此操作将删除该词条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.Axios.allRequestPost(`/voice/taskControl/delete/${row.id}`, {}, res => {
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
      handleSpeekSizeChange (page) {
        this.currentPage = page
        this.getPersonListData()
      },
      handleSpeekCurrentChange (page) {
        this.currentPage = page
        this.getPersonListData()
      },
      addWord () {
        this.getPersonListData()
        this.isAdd = true
        this.titlename = '新增词条'
        this.dialogFormVisible = true
      },
      updateWord (row) {
        this.getPersonListData()
        this.isAdd = false
        this.titlename = '修改词条'
        this.currentRow = row
        this.dialogFormVisible = true
        this.addFrom.speekPerson = `${row.id}/${row.ageLabel}/${row.sexLabel}/${row.typeLabel}/${row.accentLabel}`
        this.addFrom.speekPersonId = row.speakerId
        this.addFrom.number = row.number
      },
      close () {
        this.$refs.addFrom.resetFields()
      },
      save () {
        let that = this
        this.$refs.addFrom.validate((valid) => {
          if (valid) {
            if (this.addFrom.speekPersonId.length == 0) {
              this.$message({
                type: 'error',
                showClose: true,
                message: '请选择正确的说话人!'
              })
            }
            let params = {
              number: that.addFrom.number,
              speakerId: this.addFrom.speekPerson.split('/')[0]
            }
            let url = '/voice/taskControl/add'
            if (this.isAdd) {
              url = '/voice/taskControl/add'
            } else {
              params.id = this.currentRow.id
              url = '/voice/taskControl/update'
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
        })
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

<template>
  <div>
    <!--<div class="condition">-->
    <!--<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm"-->
    <!--size="small">-->
    <!--<el-form-item label="词条内容" prop="wordname">-->
    <!--<el-input v-model="ruleForm.wordname"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="关联组合" prop="groupname">-->
    <!--<el-input v-model="ruleForm.groupname"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="创建时间" required>-->
    <!--<el-col :span="11">-->
    <!--<el-form-item prop="startTime">-->
    <!--<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startTime"-->
    <!--style="width: 100%;"></el-date-picker>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col class="line" :span="2">-</el-col>-->
    <!--<el-col :span="11">-->
    <!--<el-form-item prop="endTime">-->
    <!--<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.endTime"-->
    <!--style="width: 100%;"></el-date-picker>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
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
          prop="name"
          align="center"
          label="任务名称"
        >
        </el-table-column>
        <el-table-column
          prop="combinationName"
          align="center"
          label="组合名称">
        </el-table-column>
        <el-table-column
          prop="entryNameLabel"
          align="center"
          label="词条内容">
        </el-table-column>
        <el-table-column
          prop="price"
          align="center"
          label="采集价格">
        </el-table-column>
        <el-table-column
          prop="wxStatus"
          align="center"
          :formatter="formatterWxStatus"
          label="微信可见状态">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="完成状态"
          :formatter="formatterStatus"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="completeTime"
          align="center"
          label="完成时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="stopWord(scope.row)" type="text" size="small" v-if="scope.row.wxStatus==4">停止</el-button>
            <el-button @click="resetWork(scope.row)" type="text" size="small" v-if="scope.row.wxStatus==3">恢复
            </el-button>
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
    <el-dialog :title="titlename" :visible.sync="dialogFormVisible">
      <el-form :model="addFrom" size="small" ref="addFrom" :rules="rules">
        <el-form-item label="采集任务名称" label-width="120px" class="maginbox" prop="name">
          <el-input v-model="addFrom.name" autocomplete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="词条组合" label-width="120px" class="maginbox" prop="combinationName">
          <el-dropdown>
            <el-input v-model="addFrom.combinationName" clearable @clear="clearSelectionChange"></el-input>
            <el-dropdown-menu slot="dropdown">
              <el-table
                :data="groupList"
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
                  width="100"
                  label="唯一标示"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  align="center"
                  label="组合名称"
                >
                </el-table-column>
                <el-table-column
                  prop="description"
                  align="center"
                  label="说明">
                </el-table-column>
                <el-table-column
                  prop="entryNameLabel"
                  align="center"
                  label="包括词条">
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleGroupSizeChange"
                @current-change="handleGroupSizeChange"
                layout="prev, pager, next"
                :current-page.sync="grouppage"
                :total="grouptotal">
              </el-pagination>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="价格" label-width="120px" class="maginbox" prop="price">
          <el-input v-model="addFrom.price" autocomplete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="任务控制" label-width="120px" class="maginbox" prop="taskControlName">
          <el-dropdown>
            <el-input v-model="addFrom.taskControlName" clearable @clear="clearSelectionChange"></el-input>
            <el-dropdown-menu slot="dropdown">
              <el-table
                :data="workSetingList"
                border
                ref="multipleTable"
                size="small"
                max-height="250"
                :header-cell-style="headerRowClassName"
                style="width: 100%"
                @current-change="handleWorkSetingChange"
              >
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
              </el-table>
              <el-pagination
                @size-change="handleWordkSizeChange"
                @current-change="handleWordkSizeChange"
                layout="prev, pager, next"
                :current-page.sync="workpage"
                :total="worktotal">
              </el-pagination>
            </el-dropdown-menu>
          </el-dropdown>
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
        dialogFormVisible: false,
        titlename: '',
        isAdd: true,
        workSetingList: [],
        currentPage: 1,
        currentRow: {},
        tableData: [],
        grouppage: 1,
        grouptotal: 0,
        workpage: 1,
        worktotal: 0,
        groupList: [],
        total: 0,
        ruleForm: {
          endTime: '',
          startTime: '',
          wordname: '',
          groupname: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入采集任务名称', trigger: 'blur' }
          ],
          combinationName: [
            { required: true, message: '请选择组合信息', trigger: 'input' }
          ],
          price: [{ required: true, message: '请输入价格', trigger: 'blur' },
            { validator: checkAge, trigger: 'blur' }
          ],
          taskControlName: [{ required: true, message: '请选择任务', trigger: 'change' }]
        },
        addFrom: {
          name: '',
          combinationName: '',
          combinationId: '',
          price: '',
          taskControlId: '',
          taskControlName: ''
        }
      }
    },
    mounted () {
      this.getListData()
    },
    methods: {
      headerRowClassName () {
        return 'background: #2196f3;color:#ffffff'
      },
      clearSelectionChange () {
        this.addFrom.combinationName = ''
      },
      handleCurrentTableChange (val) {
        if (val) {
          this.addFrom.combinationName = `${val.id}/${val.name}`
          this.addFrom.combinationId = val.id
        }
      },
      handleWorkSetingChange (val) {
        if (val) {
          this.addFrom.taskControlName = `${val.id}/${val.ageLabel}/${val.sexLabel}/${val.typeLabel}/${val.accentLabel}/${val.number}`
          this.addFrom.taskControlId = val.id
        }
      },
      getGroupListData () {
        let params = {
          current: this.grouppage,
          size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/combination/getPageList', params, (res) => {
          if (res.code == 200) {
            that.groupList = res.data.records
            that.grouptotal = res.data.total
          }
        })
      },
      getWordListData () {
        let params = {
          current: this.workpage,
          size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/taskControl/getPageList', params, (res) => {
          if (res.code == 200) {
            that.workSetingList = res.data.records
            that.worktotal = res.data.total
          }
        })
      },
      getListData () {
        let params = {
          current: this.currentPage,
          size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/task/getPageList', params, res => {
          if (res.code == 200) {
            that.tableData = res.data.records
            that.total = res.data.total
          }
        })
      },
      formatterStatus (row, column) {
        switch (row.status) {
        case 1:
          return '进行中'
        case 2:
          return '手动停止'
        case 3:
          return '完成'
        }
      },
      formatterWxStatus (row, column) {
        switch (row.wxStatus) {
        case 1:
          return '隐藏'
        case 2:
          return '公示完成'
        case 3:
          return '公示停止中'
        case 4:
          return '公示进行'
        }
      },
      resetWork (row) {
        let that = this
        this.$confirm('此操作将恢复该词条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.Axios.allRequestPost(`/voice/task/resume/${row.id}`, {}, res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                showClose: true,
                message: '停止成功!'
              })
              that.getListData()
            } else {
              this.$message({
                type: 'error',
                showClose: true,
                message: '停止失败'
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
      stopWord (row) {
        let that = this
        this.$confirm('此操作将停止该词条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.Axios.allRequestPost(`/voice/task/stop/${row.id}`, {}, res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                showClose: true,
                message: '停止成功!'
              })
              that.getListData()
            } else {
              this.$message({
                type: 'error',
                showClose: true,
                message: '停止失败'
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
      deleteWord (row) {
        let that = this
        this.$confirm('此操作将删除该词条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.Axios.allRequestPost(`/voice/task/delete/${row.id}`, {}, res => {
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
      handleGroupSizeChange (page) {
        this.grouppage = page
        this.getGroupListData()
      },
      handleWordkSizeChange (page) {
        this.workpage = page
        this.getWordListData()
      },
      addWord () {
        this.getGroupListData()
        this.getWordListData()
        this.isAdd = true
        this.titlename = '新增采集任务'
        this.dialogFormVisible = true
        this.addFrom = {
          name: '',
          combinationName: '',
          combinationId: '',
          price: '',
          taskControlId: '',
          taskControlName: ''
        }
      },
      updateWord (row) {
        this.getGroupListData()
        this.getWordListData()
        this.isAdd = false
        this.titlename = '修改采集任务'
        this.currentRow = row
        this.Axios.allRequestGet(`/voice/taskControl/info/${row.taskControlId}`, {}, res => {
          if (res.code == 200) {
            res = res.data
            this.addFrom.name = row.name
            this.addFrom.combinationName = `${row.id}/${row.combinationName}`
            this.addFrom.combinationId = `${row.id}`
            this.addFrom.price = row.price
            this.addFrom.taskControlId = row.taskControlId
            this.addFrom.taskControlName = `${res.id}/${res.ageLabel}/${res.sexLabel}/${res.typeLabel}/${res.accentLabel}/${res.number}`
            this.dialogFormVisible = true
          }
        })
      },
      save () {
        let that = this
        if (that.addFrom.combinationId == '' || that.addFrom.taskControlId == '') {
          this.$message({
            type: 'error',
            showClose: true,
            message: '请选择正确组合和控制信息'
          })
          return
        }
        this.$refs.addFrom.validate((valid) => {
          if (valid) {
            let params = {
              combinationId: that.addFrom.combinationId,
              name: that.addFrom.name,
              price: that.addFrom.price,
              taskControlId: that.addFrom.taskControlId
            }
            let url = '/voice/task/add'
            if (this.isAdd) {
              url = '/voice/task/add'
            } else {
              params.id = this.currentRow.id
              url = '/voice/task/update'
            }
            that.Axios.allRequestPost(url, params, (res) => {
              if (res.code == 200) {
                that.$refs.addFrom.resetFields()
                that.dialogFormVisible = false
                that.currentPage = 1
                that.getListData()
              } else {
                that.$message({
                  type: 'error',
                  showClose: true,
                  message: res.message
                })
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
    width: 400px !important;
  }
</style>

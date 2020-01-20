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
    <!--<el-form-item label="活动时间" required>-->
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
    <audio controls>
      <source src="../../assets/aa.pcm" >
      您的浏览器不支持 audio 元素。
    </audio>
    <div class="main-box">
      <div class="btn-add">
        <el-button type="primary" @click="addWord('ruleForm')" size="small">添加</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        :header-cell-style="headerRowClassName"
        size="small"
        style="width: 100%">
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
          label="词条内容"
        >
        </el-table-column>
        <el-table-column
          prop="combinationNameLabel"
          align="center"
          label="已关联组合">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="添加时间">
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
        <el-form-item label="词条内容" label-width="120px" class="maginbox" prop="wordname">
          <el-input v-model="addFrom.wordname" autocomplete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="已关联组合" label-width="120px" class="maginbox" prop="groupname">
          <el-select v-model="addFrom.groupname" placeholder="设置关联的组合" multiple filterable>
            <el-option :label="group.name" :value="group.id" v-for="group in groupList" :key="group.id"></el-option>
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
        dialogFormVisible: false,
        titlename: '',
        currentrow: {},
        isAdd: true,
        currentPage: 1,
        tableData: [],
        groupList: [],
        ruleForm: {
          endTime: '',
          startTime: '',
          wordname: '',
          groupname: ''
        },
        rules: {
          wordname: [
            { required: true, message: '请输入词条名称', trigger: 'blur' }
          ]
        },
        addFrom: {
          wordname: '',
          groupname: []
        }
      }
    },
    mounted () {
      this.getListData()
    },
    methods: {
      getGroupList () {
        let that = this
        this.Axios.allRequestPost('/voice/combination/getAllList', {}, (res) => {
          if (res.code == 200) {
            that.groupList = res.data
          }
        })
      },
      getListData () {
        let params = {
          current: this.currentPage,
          size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/entry/getPageList', params, (res) => {
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
          that.Axios.allRequestPost(`/voice/entry/delete/${row.id}`, {}, res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                showClose: true,
                message: '删除成功!'
              })
              that.currentPage = 1
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
      headerRowClassName () {
        return 'background: #2196f3;color:#ffffff'
      },
      addWord () {
        this.isAdd = true
        this.titlename = '新增词条'
        this.dialogFormVisible = true
        this.addFrom = {
          wordname: '',
          groupname: []
        }
        this.getGroupList()
      },
      updateWord (row) {
        this.isAdd = false
        this.titlename = '修改词条'
        this.dialogFormVisible = true
        this.currentrow = row
        this.addFrom.wordname = row.name
        this.addFrom.groupname = []
        row.combinationList.map(obj => {
          this.addFrom.groupname.push(obj.id)
        })
        this.getGroupList()
      },
      close () {
        this.$refs.addFrom.resetFields()
        this.$refs.addFrom.clearValidate()
      },
      save () {
        let that = this
        this.$refs.addFrom.validate((valid) => {
          if (valid) {
            let params = {
              name: that.addFrom.wordname
            }

            let combinationList = []
            for (let i = 0; i < that.addFrom.groupname.length; i++) {
              combinationList.push({
                name: that.addFrom.groupname[i],
                id: that.addFrom.groupname[i]
              })
            }
            if (combinationList.length > 0) {
              params.combinationList = combinationList
            }
            let url = '/voice/entry/update'
            if (this.isAdd) {
              url = '/voice/entry/add'
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
              } else {
                that.$message({
                  type: 'error',
                  message: res.message,
                  showClose: true
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
    width: 200px !important;
  }
</style>

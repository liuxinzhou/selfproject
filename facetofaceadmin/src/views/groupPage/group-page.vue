<template>
  <div>
    <!--<div class="condition">-->
    <!--<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm"-->
    <!--size="small">-->
    <!--<el-form-item label="组合名称" prop="wordname">-->
    <!--<el-input v-model="ruleForm.wordname"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="词条内容" prop="groupname">-->
    <!--<el-input v-model="ruleForm.groupname"></el-input>-->
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
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)">查看</el-button>
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
      <el-form :model="groupFrom" size="small" ref="groupFrom" :rules="rules">
        <el-form-item label="组合名称" label-width="120px" class="maginbox" prop="groupname">
          <el-input v-model="groupFrom.groupname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明信息" label-width="120px" class="maginbox" prop="description">
          <el-input v-model="groupFrom.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联词语" label-width="120px" class="maginbox" prop="wordname">
          <el-dropdown @visible-change="visibleChange">
            <el-tooltip class="item" effect="dark" :content="groupFrom.wordname" placement="right-start"
                        :disabled="groupFrom.wordname.length==0">
              <el-input v-model="groupFrom.wordname" clearable @clear="clearSelectionChange"></el-input>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-table
                :data="wordData"
                border
                ref="multipleTable"
                size="small"
                height="300"
                :header-cell-style="headerRowClassName"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="id"
                  align="center"
                  show-overflow-tooltip
                  label="唯一标示"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  align="center"
                  show-overflow-tooltip
                  label="组合名称"
                >
                </el-table-column>
              </el-table>
              <!--<el-pagination-->
              <!--@size-change="handleWordSizeChange"-->
              <!--@current-change="handleWordCurrentChange"-->
              <!--layout="prev, pager, next"-->
              <!--:current-page.sync="currentWordPage"-->
              <!--:total="wordTotal">-->
              <!--</el-pagination>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="组合详情" :visible.sync="showDetailFlag">
      <el-table
        :data="showData"
        border
        style="width: 100%">
        <el-table-column
          prop="item"
          label="项目"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="内容"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        total: 0,
        showData: [],
        selectionChange: [],
        selectionChangeText: '',
        showDetailFlag: false,
        dialogFormVisible: false,
        titlename: '',
        currentWordPage: 1,
        isAdd: true,
        currentPage: 1,
        tableData: [],
        ruleForm: {
          endTime: '',
          startTime: '',
          wordname: '',
          groupname: ''
        },
        rules: {
          groupname: [
            { required: true, message: '请填写组合名称', trigger: 'input' }
          ]
        },
        groupFrom: {
          wordname: '',
          groupname: '',
          description: '',
          wordnameList: []
        },
        wordTotal: 0,
        wordData: [],
        currentRow: {}
      }
    },
    mounted () {
      this.getListData()
    },
    methods: {
      visibleChange (val) {
        if (val) {
          let that = this
          this.currentRow.entryList.map((obj) => {
            that.wordData.map(row => {
              if (row.id == obj.id) {
                that.$refs.multipleTable.toggleRowSelection(row)
              }
            })
          })
        }
      },
      getListData () {
        let params = {
          current: this.currentPage,
          size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/combination/getPageList', params, (res) => {
          if (res.code == 200) {
            that.tableData = res.data.records
            that.total = res.data.total
          }
        })
      },
      getWordListData () {
        let params = {
          // current: this.currentWordPage,
          // size: 10
        }
        let that = this
        this.Axios.allRequestPost('/voice/entry/getAllList', params, (res) => {
          if (res.code == 200) {
            that.wordData = res.data
            that.wordTotal = res.data.total
          }
        })
      },
      headerRowClassName () {
        return 'background: #2196f3;color:#ffffff'
      },
      showDetail (row) {
        this.showData = [{
          item: '唯一标识',
          name: row.id
        },
          {
            item: '组合名称',
            name: row.name
          }, {
            item: '组合说明',
            name: row.description
          }, {
            item: '词条内容',
            name: row.entryNameLabel
          }]

        this.showDetailFlag = true
      },
      submitForm () {
        console.log('dsaf')
      },
      clearSelectionChange () {
        this.selectionChange = []
        this.selectionChangeText = ''
        this.$refs.multipleTable.clearSelection()
      },
      handleSelectionChange (selectdata) {
        this.selectionChange = selectdata
        let selectionChangeText = []
        selectdata.map(data => {
          selectionChangeText.push(data.name)
        })
        selectionChangeText = selectionChangeText.join(',')
        this.groupFrom.wordname = selectionChangeText
        this.groupFrom.wordnameList = selectdata
      },
      deleteWord (row) {
        let that = this
        this.$confirm('此操作将删除该词条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.Axios.allRequestPost(`/voice/combination/delete/${row.id}`, {}, res => {
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
        console.log(page)
        this.currentPage = page
        this.getListData()
      },
      handleCurrentChange (page) {
        console.log(page)
        this.currentPage = page
        this.getListData()
      },
      handleWordSizeChange (page) {
        this.currentWordPage = page
        this.getWordListData()
      },
      handleWordCurrentChange (page) {
        this.currentWordPage = page
        this.getWordListData()
      },
      addWord () {
        this.isAdd = true
        this.titlename = '新增组合'
        this.dialogFormVisible = true
        this.getWordListData()
        this.groupFrom = {
          wordname: '',
          groupname: '',
          description: '',
          wordnameList: []
        }
      },
      updateWord (row) {
        this.getWordListData()
        this.isAdd = false
        this.titlename = '修改组合'
        this.currentRow = row
        this.dialogFormVisible = true
        this.groupFrom.wordname = row.entryNameLabel
        this.groupFrom.description = row.description
        this.groupFrom.groupname = row.name
        this.selectionChange = row.entryNameList
        this.groupFrom.wordnameList = row.entryList
      },
      close () {
        this.$nextTick(() => {
          this.$refs['groupFrom'].resetFields()
        })
        // this.dialogFormVisible = false
      },
      save () {
        let that = this
        this.$refs.groupFrom.validate((valid) => {
          if (valid) {
            let params = {
              name: that.groupFrom.groupname,
              description: that.groupFrom.description,
              entryList: this.groupFrom.wordnameList
            }
            let url = '/voice/combination/add'
            if (this.isAdd) {
              url = '/voice/combination/add'
            } else {
              params.id = this.currentRow.id
              url = '/voice/combination/update'
            }
            that.Axios.allRequestPost(url, params, (res) => {
              if (res.code == 200) {
                that.$refs.groupFrom.resetFields()
                that.$refs.groupFrom.clearValidate()
                that.dialogFormVisible = false
                that.currentPage = 1
                that.getListData()
              }
            })
          } else {
            console.log('error submit!!')
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
  .el-form-item__content .el-textarea,
  .el-form-item__content .el-radio-group {
    width: 200px !important;
  }

  .el-form-item__content .el-select {
    min-width: 400px !important;
  }

  .optionbox {
    border: 1px solid red;
  }

  .headerRowClassName {
    background: darkblue;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-dropdown-menu {
    background: #e6e6e6;
    padding: 0;
  }
</style>

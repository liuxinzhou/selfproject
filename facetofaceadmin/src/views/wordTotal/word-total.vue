<template>
  <div>
    <div class="condition">
      <el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm"
               size="small">
        <el-form-item label="搜索关键词" prop="keyname">
          <el-input v-model="ruleForm.keyname"></el-input>
        </el-form-item>
        <el-form-item class="btn-box">
          <el-button type="primary" @click="getListData('ruleForm')" size="small">查询</el-button>
          <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-box">
      <div class="btn-add">
        <el-button type="primary" @click="exportFile('ruleForm')" size="small">导出文件</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        size="small"
        :header-cell-style="headerRowClassName"
        style="width: 100%">
        <el-table-column
          :prop="'key'+index"
          align="center"
          :label="item"
          :fixed="index<4?true:false"
          v-for="(item,index) in columnTitleList"
          :key="index"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        isAdd: true,
        currentPage1: 1,
        columnTitleList: [],
        tableData: [],
        ruleForm: {
          keyname: ''
        },
        addFrom: {
          wordname: '',
          groupname: ['1', '2']
        }
      }
    },
    mounted () {
      this.getListData()
    },
    methods: {
      exportFile () {
        this.Axios.allRequestPost('/voice/taskCompleteHistory/export', {}, res => {
          if (res.code == 200) {
            window.location.href = res.data
          }
        })
      },
      resetForm () {
        this.ruleForm.keyname = ''
        this.getListData()
      },
      getListData () {
        let params = {
          current: this.currentPage,
          size: 10,
          searchKey: this.ruleForm.keyname
        }
        let that = this
        this.Axios.allRequestPost('/voice/taskCompleteHistory/getStatisticsResult', params, res => {
          if (res.code == 200) {
            that.tableData = []
            that.columnTitleList = res.data.columnTitleList
            let dataList = res.data.dataList
            for (let i = 0; i < dataList.length; i++) {
              let datas = {}
              for (let j = 0; j < dataList[i].length; j++) {
                datas['key' + j] = dataList[i][j]
              }
              that.tableData.push(datas)
            }
          }
        })
      },
      deleteWord (row) {
        this.$confirm('此操作将删除该词条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            showClose: true,
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            showClose: true,
            message: '已取消删除'
          })
        })
      },
      addWord () {
        this.isAdd = true
        this.titlename = '新增词条'
        this.dialogFormVisible = true
      },
      updateWord (row) {
        this.isAdd = false
        this.titlename = '修改词条'
        this.dialogFormVisible = true
        this.addFrom.wordname = row.name
        this.addFrom.groupname = row.address
      },
      headerRowClassName () {
        return 'background: #2196f3;color:#ffffff'
      },
      save () {
        this.$refs.addFrom.validate((valid) => {
          if (valid) {
            alert('submit!')
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
  .el-form-item__content .el-select,
  .el-form-item__content .el-textarea,
  .el-form-item__content .el-radio-group {
    width: 200px !important;
  }
</style>

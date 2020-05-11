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
    <el-dialog :title="titlename" :visible.sync="dialogFormVisible">
      <el-form :model="groupFrom" size="small" ref="groupFrom" :rules="rules">
        <el-form-item label="组合名称" label-width="120px" class="maginbox" prop="groupname">
          <el-input v-model="groupFrom.groupname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明信息" label-width="120px" class="maginbox" prop="description">
          <el-input v-model="groupFrom.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联词语" label-width="120px" class="maginbox" prop="wordname">
          <el-select v-model="groupFrom.wordname" placeholder="请选择" multiple filterable>
            <el-option
              v-for="item in wordData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left; color: #8492a6; font-size: 13px;margin-right: 10px">{{ item.id }}</span>
              <span style="float: left">{{ item.name }}</span>
            </el-option>
          </el-select>
          <!--<el-dropdown @command="visibleChange" trigger="click">-->
          <!--<el-input v-model="groupFrom.wordname" clearable @clear="clearSelectionChange"></el-input>-->
          <!--<el-popover-->
          <!--placement="top-start"-->
          <!--title=""-->
          <!--width="200"-->
          <!--trigger="click"-->
          <!--popper-class="popperClass"-->
          <!--:content="groupFrom.wordname">-->
          <!--<el-button type="text" slot="reference" style="margin-left: 10px"> 查看</el-button>-->
          <!--</el-popover>-->
          <!--<el-dropdown-menu slot="dropdown">-->
          <!--<el-table-->
          <!--:data="wordData"-->
          <!--border-->
          <!--ref="multipleTable"-->
          <!--size="small"-->
          <!--height="500"-->
          <!--:header-cell-style="headerRowClassName"-->
          <!--style="width: 100%"-->
          <!--filtered-value="小大发放"-->
          <!--@selection-change="handleSelectionChange">-->
          <!--<el-table-column-->
          <!--type="selection"-->
          <!--width="55">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--prop="id"-->
          <!--align="center"-->
          <!--width="100"-->
          <!--show-overflow-tooltip-->
          <!--label="唯一标示"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--prop="name"-->
          <!--align="center"-->
          <!--width="250"-->
          <!--show-overflow-tooltip-->
          <!--label="组合名称"-->
          <!--&gt;-->
          <!--<template slot="header" slot-scope="scope">-->
          <!--<div style="display: flex;justify-content: center;align-items: center">-->
          <!--<span style="white-space: nowrap;margin-right: 10px">组合名称</span>-->
          <!--<el-input-->
          <!--v-model="search"-->
          <!--size="mini"-->
          <!--@change="filterHandler"-->
          <!--style="width: 150px"-->
          <!--placeholder="输入关键字搜索"/>-->
          <!--</div>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--</el-table>-->
          <!--&lt;!&ndash;<el-pagination&ndash;&gt;-->
          <!--&lt;!&ndash;@size-change="handleWordSizeChange"&ndash;&gt;-->
          <!--&lt;!&ndash;@current-change="handleWordCurrentChange"&ndash;&gt;-->
          <!--&lt;!&ndash;layout="prev, pager, next"&ndash;&gt;-->
          <!--&lt;!&ndash;:current-page.sync="currentWordPage"&ndash;&gt;-->
          <!--&lt;!&ndash;:total="wordTotal">&ndash;&gt;-->
          <!--&lt;!&ndash;</el-pagination>&ndash;&gt;-->
          <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
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
        search: '',
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
          wordname: [],
          groupname: '',
          description: '',
          wordnameList: []
        },
        wordTotal: 0,
        wordData: [],
        currentRow: {},
        filterFlag: false
      }
    },
    mounted () {
      this.getListData()
    },
    methods: {
      visibleChange (val) {
        if (!val) {
          this.filterFlag = val
        }
        let that = this
        this.$nextTick(() => {
          that.currentRow.entryList.map((obj) => {
            that.wordData.map(row => {
              if (row.id == obj.id) {
                that.$refs.multipleTable.toggleRowSelection(row)
              }
            })
          })
        })

        // }
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
            // that.visibleChange(true)
          }
        })
      },
      headerRowClassName () {
        return 'background: #2196f3;color:#ffffff'
      },
      filterHandler () {
        this.filterFlag = true
        let that = this
        this.wordData = this.wordData.filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()))
        this.$nextTick(() => {
          that.currentRow.entryList.map((obj) => {
            that.wordData.map(row => {
              if (row.id == obj.id) {
                that.$refs.multipleTable.toggleRowSelection(row)
              }
            })
          })
        })
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
      clearSelectionChange () {
        this.selectionChange = []
        this.selectionChangeText = ''
        this.$refs.multipleTable.clearSelection()
      },
      handleSelectionChange (selectdata) {
        this.selectionChange = selectdata
        // let selectionChangeText = []
        // selectdata.map(data => {
        //   selectionChangeText.push(data.name)
        // })
        // selectionChangeText = selectionChangeText.join(',')
        // if (!this.filterFlag) {
        selectdata.map(data => {
          // selectionChangeText.push(data.name)
          let flag = false
          this.groupFrom.wordnameList.map((obj) => {
            if (obj.id == data.id) {
              flag = true
            }
          })
          if (!flag) {
            this.groupFrom.wordnameList.push(data)
            this.groupFrom.wordname = this.groupFrom.wordname + ', ' + data.name
          }
        })
        // }
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
        this.currentPage = page
        this.getListData()
      },
      handleCurrentChange (page) {
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
        this.groupFrom = {
          wordname: '',
          groupname: '',
          description: '',
          wordnameList: []
        }
        this.currentRow = []
        this.getWordListData()
      },
      updateWord (row) {
        this.isAdd = false
        let wordname = []
        row.entryList.map((obj) => {
          wordname.push(obj.id)
        })
        this.titlename = '修改组合'
        this.currentRow = row
        this.dialogFormVisible = true
        this.groupFrom.wordname = wordname
        this.groupFrom.description = row.description
        this.groupFrom.groupname = row.name
        this.selectionChange = row.entryNameList
        this.groupFrom.wordnameList = row.entryList
        this.getWordListData()
      },
      save () {
        let that = this
        this.$refs.groupFrom.validate((valid) => {
          if (valid) {
            let entryList = []
            for (let i = 0; i < this.groupFrom.wordname.length; i++) {
              for (let j = 0; j < this.wordData.length; j++) {
                if (this.groupFrom.wordname[i] == this.wordData[j].id) {
                  entryList.push(this.wordData[j])
                }
              }
            }
            let params = {
              name: that.groupFrom.groupname,
              description: that.groupFrom.description,
              entryList: entryList
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

  .group-name-box {
    color: #ffffff;
  }
</style>

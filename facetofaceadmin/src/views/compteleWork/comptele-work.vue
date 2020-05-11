<template>
  <div>
    <div class="condition">
      <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm"
               size="small">
        <el-form-item label="搜索信息" prop="wordname">
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
        <el-button type="primary" @click="refesh('ruleForm')" size="small">刷新任务列表</el-button>
        <el-button type="primary" @click="exportFile('ruleForm')" size="small">导出文件</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        size="small"
        :header-cell-style="headerRowClassName"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          align="center"
          label="唯一标示"
        >
        </el-table-column>
        <el-table-column
          prop="taskName"
          align="center"
          label="采集任务名称"
        >
        </el-table-column>
        <el-table-column
          prop="combinationName"
          align="center"
          label="关联组合名称">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          :formatter="formatterStatus"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="completeTime"
          align="center"
          label="完成任务时间">
        </el-table-column>
        <el-table-column
          prop="username"
          align="center"
          label="微信昵称">
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="updateWord(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleCurrentChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="titlename" :visible.sync="dialogFormVisible">
      <audio id="mp3">
        您的浏览器不支持 audio 元素。
      </audio>
      <div class="btn-audit">
        <el-button type="primary" @click="play()" size="small">播放选择行</el-button>
      </div>
      <el-table
        :data="taskReceiverData"
        border
        size="small"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        height="500"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          align="center"
          label="唯一标示"
        >
        </el-table-column>
        <el-table-column
          prop="entryName"
          align="center"
          label="词条内容"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="录制时间">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          :formatter="formatterVodeiStatus"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="备注信息">
        </el-table-column>
        <el-table-column
          prop="voicePath"
          align="center"
          label="播放">
          <template slot-scope="scope">
            <div @click="playsigle(scope.row)" class="el-icon-video-play playicon"></div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleTaskChange"
        @current-change="handleTaskChange"
        :current-page.sync="taskReceiverPage"
        layout="total, prev, pager, next"
        :total="taskReceiverTotal">
      </el-pagination>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        dialogFormVisible: false,
        titlename: '',
        loading: false,
        isAdd: true,
        currentPage: 1,
        total: 0,
        tableData: [],
        taskReceiverData: [],
        taskReceiverTotal: 0,
        taskReceiverPage: 1,
        ruleForm: {
          keyname: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
        addFrom: {
          wordname: '',
          groupname: ['1', '2']
        },
        auditRecode: [],
        playIndex: 0
      }
    },
    mounted () {
      this.getListData()
    },

    methods: {
      resetForm () {
        this.ruleForm.keyname = ''
        this.getListData()
      },
      exportFile () {
        this.Axios.allRequestPost('/voice/taskReceiver/export', {}, res => {
          if (res.code == 200) {
            window.location.href = res.data
          }
        })
      },
      refesh () {
        this.currentPage = 1
        this.getListData()
      },
      taskReceiverDetail (id) {
        this.loading = true
        let params = {
          current: this.taskReceiverPage,
          size: 10,
          taskReceiverId: id
        }
        let that = this
        this.Axios.allRequestPost('/voice/taskReceiverDetail/getPageList', params, res => {
          if (res.code == 200) {
            this.loading = false
            that.taskReceiverData = res.data.records
            that.taskReceiverTotal = res.data.total
          }
        })
      },
      getListData () {
        let params = {
          current: this.currentPage,
          size: 10,
          searchKey: this.ruleForm.keyname
        }
        let that = this
        this.Axios.allRequestPost('/voice/taskReceiver/getCompletePageList', params, res => {
          if (res.code == 200) {
            that.tableData = res.data.records
            that.total = res.data.total
          }
        })
      },
      formatterStatus (row, column) {
        switch (row.status) {
        case 1:
          return '领取'
        case 2:
          return '待审'
        case 3:
          return '完成'
        }
      },
      formatterVodeiStatus (row, column) {
        switch (row.status) {
        case 1:
          return '待审核'
        case 2:
          return '通过'
        }
      },
      handleTaskChange (page) {
        this.taskReceiverPage = page
        this.taskReceiverDetail(this.currentRow.id)
      },
      playsigle (row) {
        this.auditRecode = [row]
        this.play()
      },
      play () {
        let that = this
        if (this.auditRecode.length > 0) {
          let src = this.auditRecode[this.playIndex].voicePath
          var audio = document.getElementById('mp3')
          for (let i = 0; i < that.taskReceiverData.length; i++) {
            if (that.taskReceiverData[i].id == that.auditRecode[that.playIndex].id) {
              that.taskReceiverData[i].remark = 'playing...'
              that.$set(that.taskReceiverData, 0, that.taskReceiverData[0])
            }
          }
          audio.src = src
          audio.play() // 播放 mp3这个音频对象
          audio.onended = function () {
            for (let i = 0; i < that.taskReceiverData.length; i++) {
              if (that.taskReceiverData[i].id == that.auditRecode[that.playIndex].id) {
                that.taskReceiverData[i].remark = 'play over'
                that.$set(that.taskReceiverData, 0, that.taskReceiverData[0])
              }
            }
            if (that.playIndex + 1 < that.auditRecode.length) {
              that.playIndex = that.playIndex + 1
              that.play()
            } else {
              that.playIndex = 0
            }
          }
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: '请选择要播放的录音'
          })
        }
      },
      deleteWork () {
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
      handleCurrentChange (page) {
        this.currentPage = page
        this.getListData()
      },
      headerRowClassName () {
        return 'background: #2196f3;color:#ffffff'
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
        this.currentRow = row
        this.taskReceiverPage = 1
        this.taskReceiverDetail(row.id)
      },
      handleSelectionChange (auditRecode) {
        this.auditRecode = auditRecode
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

  .btn-audit {
    margin: 10px 0;
  }

  .maginbox {
    margin: 20px 0 !important;
  }

  .playicon {
    font-size: 40px;
  }

  .el-form-item__content .el-input,
  .el-form-item__content .el-select,
  .el-form-item__content .el-textarea,
  .el-form-item__content .el-radio-group {
    width: 200px !important;
  }
</style>

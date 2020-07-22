<template>
  <el-container>
    <el-container>
      <el-header class="system-box">
        <div>
          <div style="color: #ffffff">个人信息采集平台</div>
        </div>
        <div>
          <span style="color: #ffffff">{{nowTime}}</span>
        </div>
      </el-header>

      <el-main>
        <div class="search-box">
          <div class="block">
            <span class="demonstration">查询日期</span>
            <el-date-picker
              v-model="currentDate"
              type="date"
              size="small"
              placeholder="选择日期">
            </el-date-picker>
            <el-button size="small" class="search-btn" type="danger" @click="getList">查询</el-button>
          </div>
        </div>
        <el-button type="primary" icon="el-icon-coin" size="small" class="erport" @click="dowloand">导出</el-button>
        <div class="pageinfo">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="startPage"
            :page-size="30"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
          <div> 共计19人，今日填写
            <span class="total-style">{{total}}</span>
            人,还差
            <span class="total-style-disbale">{{19-total}}</span>
            人未填写
          </div>
        </div>

        <el-table :data="tableData" height="500" border size="small" id="download">
          <el-table-column
            prop="orderKey"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column prop="uploadTime" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="userName" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="temperature" label="今日体温" width="100">
          </el-table-column>
          <el-table-column prop="idCard" label="身份证" width="200">
          </el-table-column>
          <el-table-column prop="tel" label="手机号" width="150">
          </el-table-column>

          <el-table-column prop="isSelfFeverCoughDesc" label="本人是否发热" width="120">
          </el-table-column>
          <el-table-column prop="isOtherFeverCoughDesc" label="家人是否发热" width="120">
          </el-table-column>
          <el-table-column prop="currAddress" label="现居住地址">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>
<style>
  .el-header {
    background-color: #ff552e;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .search-box {
    margin: 10px;
  }

  .demonstration {
    margin-right: 20px;
  }

  .system-box {
    display: flex;
    justify-content: space-between;
  }

  .search-btn {
    background: #ff552e;
    margin-left: 20px;
    width: 100px;
    color: #ffffff;
  }

  .erport {
    margin-bottom: 30px;
  }

  .pageinfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .total-style {
    font-size: 24px;
    color: #5dfa5c;
  }

  .total-style-disbale {
    font-size: 24px;
    color: #ff552e;
  }
</style>

<script>
  export default {
    data () {
      return {
        tableData: [],
        currentDate: new Date(),
        nowTime: '',
        startPage: 1,
        total: 0
      }
    },
    mounted () {
      this.initInfo()
      this.getList()
    },
    methods: {
      initInfo () {
        let fullyear = new Date().getFullYear()
        let month = new Date().getMonth() + 1
        let date = new Date().getDate()
        if (month < 10) {
          month = '0' + month
        }
        if (date < 10) {
          date = '0' + date
        }
        let nowTime = fullyear + '年' + month + '月' + date + '日 ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
        let currentDate = fullyear + '-' + month + '-' + date
        this.nowTime = nowTime
        this.currentDate = currentDate
      },
      getList () {
        let format = new Date(this.currentDate)
        let fullyear = format.getFullYear()
        let month = format.getMonth() + 1
        let date = format.getDate()
        if (month < 10) {
          month = '0' + month
        }
        if (date < 10) {
          date = '0' + date
        }
        let paramsDate = fullyear + month + date

        let params = {
          startPage: this.startPage,
          pageSize: 30,
          uploadTime: paramsDate
        }
        this.Axios.allRequestGet('/userinfo/list', { params: params }, res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      dowloand () {
        let format = new Date(this.currentDate)
        let fullyear = format.getFullYear()
        let month = format.getMonth() + 1
        let date = format.getDate()
        if (month < 10) {
          month = '0' + month
        }
        if (date < 10) {
          date = '0' + date
        }
        let paramsDate = fullyear + month + date

        window.location.href = `https://lygrow.club/windsound/userinfo/downloadData?uploadTime=${paramsDate}`
      },
      handleCurrentChange (page) {
        this.startPage = page
        this.getList()
      }
    }
  }
</script>

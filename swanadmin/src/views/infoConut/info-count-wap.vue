<template>
<div>
    <div class=" header">
        <div class="top">
            <div class="title" @click="dowloand">
                <img src="../../assets/down.png" alt="" class="down">
                <span>导出数据</span>
            </div>
            <div>{{currentDate}}</div>
        </div>
        <div class="bottom">
            <div class="left">
                <div class="total-font">{{total}}</div>
                <div>今日填写人数</div>
            </div>
            <div class="right">
                <div>共计人数 19</div>
                <div>未天人数 {{19-total}}</div>
            </div>
        </div>
    </div>
    <div class="table-list">
        <!-- <ul class="infinite-list" v-infinite-scroll="handleCurrentChange" style="overflow:auto"> -->
            <div v-for="(student,index) in tableData" :key="index" class="cell-talbe">
                <div class="cell">
                    <div>学号: {{student.orderKey}}</div>
                    <div class="name"> {{student.userName}}</div>
                </div>
                <div class="cell">
                    <div>体温: {{student.temperature}}℃</div>
                    <div class="pass" v-if="student.temperature*1<37.3">正常</div>
                    <div class="unpass" v-else>异常</div>
                </div>
            </div>
        <!-- </ul> -->
    </div>
</div>
</template>

<style lang="less">
.header {
    background: linear-gradient(135deg, rgba(49, 190, 100, 1) 0%, rgba(2, 185, 161, 1) 100%);
    // height: 5rem;
    padding: 1rem;
    color: #ffffff;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.12rem;

        .title {
            display: flex;
            justify-content: center;
            align-items: center;

            .down {
                margin-right: 5px;
                width: 25px;
                height: 25px;
            }
        }

    }

    .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;

        .left {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .total-font {
                font-size: 2rem;
            }
        }
    }
}

.table-list {
    background: #f2f2f2;
    padding: 0.5rem;

    .cell-talbe {
        margin: 1rem 0;
        background: #ffffff;
        padding: 10px;
        border-radius: 10px;

        .cell {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px;

            .pass {
                background: rgba(49, 190, 100, 1);
                color: #ffffff;
                padding: 5px 10px;
                border-radius: 5px;
            }
        }
    }
}
</style>

<script>
export default {
    data() {
        return {
            tableData: [],
            currentDate: new Date(),
            nowTime: '',
            startPage: 1,
            total: 0
        }
    },
    mounted() {
        this.initInfo()
        this.getList()
    },
    methods: {
        initInfo() {
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
        getList() {
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
            this.Axios.allRequestGet('/userinfo/list', {
                params: params
            }, res => {
                if (res.data.code == 200) {
                    this.tableData = res.data.data
                    this.total = res.data.total
                }
            })
        },
        dowloand() {
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
        handleCurrentChange() {
            this.startPage = this.startPage + 1
            this.getList()
        }
    }
}
</script>

<template>
<div class="about" :style="{'height':height+'px'}">

    <div class="login">
        管理员登录
        <el-input placeholder="用户名" v-model="username" prefix-icon="el-icon-user" class="cellinfo">
        </el-input>
        <el-input placeholder="密码" v-model="password" prefix-icon="el-icon-lock" class="cellinfo" type="password">
        </el-input>
        <div class="loginbtn">
            <span class="btnicon" @click="login">登录</span>
        </div>
        <!--<div class="resetpassword" @click="openpassword">忘记密码</div>-->
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            height: window.innerHeight,
            username: '',
            password: ''
        }
    },
    methods: {
        login() {
            if (this.username.length > 0 && this.password.length > 0) {
                let data = {
                    loginName: this.password,
                    loginPwd: this.username
                }
                this.Axios.allRequestPost('/admin/login', data, (res) => {
                    if (res.data.code == 200) {
                        sessionStorage.userinfo = JSON.stringify(res.data.loginInfo)
                        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
                        if (flag) {
                            this.$router.push('/infocountwap')
                        } else {
                            this.$router.push('/infocount')
                        }
                    } else {
                        this.$message({
                            message: '请输入正确的用户名和密码',
                            showClose: true,
                            type: 'error'
                        })
                    }
                })
            } else {
                this.$message({
                    message: '请输入正确的用户名和密码',
                    showClose: true,
                    type: 'error'
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
.about {
    background-size: 100%;
    background-image: url('../assets/Starry.jpg');
    background-repeat: no-repeat;
    background-position: left top;
    background-color: #242645;
    padding: 0;
    margin: 0;
    height: auto;
    font-size: 16px;
    color: #fff;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .login {
        width: 240px;
        height: 300px;
        background: rgba(0, 0, 0, 0.5);
        padding: 30px;

        .cellinfo {
            margin: 20px 0;
            background: rgba(0, 0, 0, 0.5);
        }

        .loginbtn {
            text-align: center;
            margin-top: 20px;

            .btnicon {
                padding: 10px 50px;
                border: 2px solid #4FA1D9;
                color: #4FA1D9;
                border-radius: 50px;
                cursor: pointer;
            }
        }

        .resetpassword {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
        }
    }

    .passwordbox {
        width: 240px;
        height: 300px;
        background: radial-gradient(#ffffff, darkblue);
        padding: 30px;

        .cellinfo {
            margin: 20px 0;
            /*background: rgba(0, 0, 0, 0.5);*/
        }

        .loginbtn {
            text-align: center;
            margin-top: 20px;

            .btnicon {
                padding: 10px 50px;
                border: 2px solid #4FA1D9;
                color: #4FA1D9;
                border-radius: 50px;
                cursor: pointer;
            }
        }

        .resetpassword {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
        }
    }
}
</style>

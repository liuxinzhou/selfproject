<template>
  <div class="about">
    <div class="login">
      <el-form label-position="top" label-width="80px" :model="formLabelAlign" :rules="rules" ref="passwordForm">
        <el-form-item label="旧密码" prop="newpassword">
          <el-input v-model="formLabelAlign.newpassword" prefix-icon="el-icon-key
" class="cellinfo" type="password" placeholder="请输入旧密码" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="repassword">
          <el-input v-model="formLabelAlign.repassword" prefix-icon="el-icon-lock" class="cellinfo"
                    type="password" placeholder="请输入新密码" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div class="loginbtn">
        <span class="btnicon" @click="updatePassword">修改</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        height: window.innerHeight,
        formLabelAlign: {
          newpassword: '',
          repassword: '',
          username: ''
        },
        rules: {
          newpassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          repassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      updatePassword () {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            let userinfo = JSON.parse(localStorage.userinfo)
            let data = {
              'id': userinfo.userQueryVo.id,
              'newPassword': this.formLabelAlign.repassword,
              'oldPassword': this.formLabelAlign.newpassword
            }
            this.Axios.allRequestPost('/sys/user/modifyPwd', data, (res) => {
              if (res.code == 200) {
                this.$confirm('密码修改成功，请重新登录', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  showCancelButton: false,
                  showClose: false,
                  closeOnClickModal: false,
                  type: 'warning'
                }).then(() => {
                  localStorage.clear()
                  this.$router.push('/tologin')
                }).catch(() => {
                  this.$message({
                    showClose: true,
                    type: 'error',
                    message: res.message
                  })
                })
              } else {
                this.$message({
                  message: res.message,
                  showClose: true,
                  type: 'error'
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
  .el-form-item {
    margin: 22px !important;
  }

  .about {
    padding: 0;
    margin: 0;
    height: auto;
    font-size: 16px;
    color: #000000;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login {
      width: 240px;
      /*height: 350px;*/
      background: #ffffff;
      padding: 30px;
      .cellinfo {
        /*padding: 20px 0;*/
        /*background: rgba(0, 0, 0, 0.5);*/
      }
      .loginbtn {
        text-align: center;
        margin-top: 30px;
        .btnicon {
          padding: 5px 20px;
          border: 2px solid #4FA1D9;
          color: #4FA1D9;
          border-radius: 50px;
          cursor: pointer;
        }
        .btnback {
          margin-left: 5px;
          font-size: 12px;
          color: #ffa70e;
          cursor: pointer;
          text-decoration: underline;
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

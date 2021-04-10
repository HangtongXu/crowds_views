<template>
  <div class="login-box">
    <div style="margin: 20px;"></div>
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <el-form ref="loginForm" :label-position="labelPosition" label-width="80px" :model="loginForm" :rules="rules">
      <div class="login-title">
        <h3>用户注册</h3>
      </div>
      <div v-if="!nexts" class="box">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" style="width: 250px;" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <label slot="label">密&emsp;码</label>
          <el-input placeholder="请输入密码" v-model="loginForm.password" show-password style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordack">
          <label slot="label">重复密码</label>
          <el-input placeholder="请确认密码" v-model="loginForm.passwordack" show-password style="width: 250px;"></el-input>
        </el-form-item>
      </div>
      <div v-else class="box">

        <el-form-item>
          <el-select v-model="loginForm.type" placeholder="请选择注册角色" style="width: 250px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" :loading="loading" round @click="nextStep('loginForm')"
                   style="width:80%;margin-bottom:10px; align-items: center;">下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.loginForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        labelPosition: 'right',
        loginForm: {
          usernaem: '',
          password: '',
          passwordack: '',
          type: 0
        },
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          passwordack: [
            {validator: validatePass2, trigger: 'blur'}
          ]
        },
        loading: false,
        active: 0,
        nexts: false,
        options: [
          {
            value: 0,
            label: '任务发布者'
          },
          {
            value: 1,
            label: '任务工作者'
          }
        ]
      };
    },
    methods: {
      nextStep(formname) {
        this.$refs[formname].validate((valid) => {
          this.loading = true;
          if (valid) {
            if (this.nexts) {
              this.next(formname)
            }
            else {
              this.nexts = true
              if (this.active++ > 2) this.active = 0;
            }
            this.loading = false
          }
          else {
            this.$message.warning('请按要求填写相关信息')
            this.loading = false
          }
        })
      },
      next(formName) {
        this.$refs[formName].validate((valid) => {
          this.loading = true;
          if (valid) {
            let vm = this;
            this.axios({
              method: 'post',
              url: 'http://localhost:8090/re_one',
              data: {
                username: vm.loginForm.username,
                password: vm.loginForm.password,
                type:vm.loginForm.type
              }
            })
              .then(function (resp) {
                if (resp.data == 'success') {
                  sessionStorage.setItem("registid", vm.loginForm.username)
                  vm.$router.push({path: '/re_two'})
                }
                else {
                  vm.$message({
                    message: '用户名已存在，请更换',
                    type: 'warning'
                  });
                  vm.nexts=false
                }
                vm.loading = false
              })
              .catch(function () {
                vm.$message({
                  message: '服务器连接失败',
                  type: 'error'
                });
                vm.loading = false
              })
          } else {
            this.loading = false;
            this.$message({
              message: '用户名密码存在空值',
              type: 'warning'
            });
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .login-box {
    width: 400px;
    height: 400px;
    border: 1px solid #DCDFE6;
    margin: 150px auto;
    padding: 20px 50px 20px 80px;
    border-radius: 20px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }

  .login-title {
    text-align: center;
    margin-bottom: 40px;
  }

  .btn {
    width: 200px;
    padding: 10px 50px 10px 10px;
    align: center;
  }

  .box {
    height: 200px;
  }
</style>

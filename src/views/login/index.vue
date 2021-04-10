<template>
  <div class="login-box">
    <div style="margin: 20px;"></div>
    <el-form ref="loginForm" :label-position="labelPosition" label-width="80px" :model="loginForm" :rules="rules">
      <div class="login-title">
        <h3>欢迎登陆</h3>
      </div>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" style="width: 250px;" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <label slot="label">密&emsp;码</label>
        <el-input placeholder="请输入密码" v-model="loginForm.password" show-password style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" round @click="onSubmit('loginForm')"
                   style="width:80%;margin-bottom:10px; align-items: center;">登录
        </el-button>
        <el-link type="warning" style="float: right;margin-right: 16px;margin-bottom: 20px" @click="toRegister">
          没有帐户，前往注册
        </el-link>
      </el-form-item>
    </el-form>
    <!--<map-utils ref="maputils" v-on:correspond="correspond"></map-utils>-->
  </div>
</template>

<script>
  import MapUtils from '../mapUtils'

  export default {
    name: "index",
    components: {MapUtils},
    data() {
      return {
        labelPosition: 'right',
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        loading: false,
        lat: 0,
        lng: 0
      };
    },
    methods: {
      toRegister() {
        this.$router.push('/register')
      },
      getAddress(type) {
        let vm = this;
        this.axios({
          method: "GET",
          url: 'https://restapi.amap.com/v3/ip?output=JSON&key=651707a61be1b345b561cd94c3f01b6c'
        })
          .then(function (resp) {
            vm.$message({
              message: '欢迎登录，' + vm.loginForm.username + ' ,当前位置为' + resp.data.province + resp.data.city,
              type: 'success'
            })
            let rectangle = resp.data.rectangle
            let array = rectangle.split(';')
            rectangle = array[0] + ',' + array[1]
            array = rectangle.split(',')
            vm.lng = (parseFloat(array[0]) + parseFloat(array[2])) / 2
            vm.lat = (parseFloat(array[1]) + parseFloat(array[3])) / 2
            if (type == 1) {
              vm.axios.get('http://localhost:8090/updateUserLocation', {
                params: {
                  uid: vm.$store.getters.getUser.uid,
                  lng: vm.lng,
                  lat: vm.lat
                }
              })
                .catch(function (e) {
                  console.log(e)
                })
            }
          })
          .catch(function (e) {
            console.log(e)
            console.log('出错了')
          })
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          this.loading = true;
          if (valid) {
            let vm = this;
            this.axios({
              method: 'post',
              url: 'http://localhost:8090/login',
              data: {
                username: vm.loginForm.username,
                password: vm.loginForm.password
              }
            })
              .then(function (resp) {
                if (resp.data.id != null) {
                  console.log(resp.data.type)
                  var user = {
                    username: resp.data.username,
                    uid: resp.data.id,
                    type: resp.data.type
                  }
                  sessionStorage.setItem('crowd_user', user.uid);
                  vm.$store.dispatch('asyncUpdateUser', user)
                  //获取用户位置信息，根据ip
                  let current_address = vm.getAddress(resp.data.type)
                  vm.$router.push({path: '/home'})
                }
                else {
                  vm.$message({
                    message: '用户名密码错误',
                    type: 'error'
                  });
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
              message: '用户名密码不能为空',
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
    height: 300px;
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
</style>

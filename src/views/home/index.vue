<template>
  <el-container>
    <el-header height="60px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple" align="left">
            <img src="../../assets/logo.png" class="img"/>
          </div>
        </el-col>
        <el-col :span="12" v-if="!isLogin">
          <div class="grid-content bg-purple-light" align="right">
            <div style="padding: 15px 0px 10px 10px">
              <el-dropdown @command="handleCommand">
                <el-avatar>{{username}}</el-avatar>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-s-custom" command="center">个人中心</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete-solid" command="logout">注销</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-col>
        <el-col :span="12" v-if="isLogin">
          <div class="grid-content bg-purple-light" align="right">
            <el-button type="primary" @click="toLogin">登录<i class="el-icon-user el-icon--right"></i></el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <!--<el-main >-->
      <el-carousel :interval="5000" height="650px">
        <el-carousel-item v-for="(item,index) in imgs" :key="index">
          <img :src="item" width="100%" height="650px"/>
        </el-carousel-item>
      </el-carousel>
    <!--</el-main>-->
  </el-container>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        imgs: [
          "./static/1.jpg",
          "./static/2.png"
        ],
        username: this.$store.getters.getUser.username,
        isLogin:this.$store.getters.getUser.username==''
      }
    },
    mounted:function(){
      if(this.isLogin){
      }
    },
    methods: {
      toLogin(){
        this.$router.push('/Login')
      },
      handleCommand(command) {
        if (command == 'logout') {
          this.$message.warning('已退出登录');
          this.$router.push('/logout');
        }
        if(command=='center'){
          this.$router.push('/center')
        }
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 300px;
    padding-top: 50px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .img {
    width: 176px;
    height: 50px;
    padding: 5px 10px 10px 10px;
  }
</style>

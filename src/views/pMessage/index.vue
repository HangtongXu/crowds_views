<template>
  <div class="box">
    <div class="block">
      <el-avatar shape="square" :size="80" :src="imageUrl"></el-avatar>
      <div class="edit">
        <!--<i class="el-icon-setting" style="padding-right: 10px">-->
        <!--<el-link type="primary">上传头像</el-link>-->
        <!--</i>-->
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8090/uploadImg"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="this.userInfo"
          v-loading="loading"
          :on-error="handleError"
        >
          <i class="el-icon-plus">
            <span style="font-size: 14px">更换头像</span></i>
        </el-upload>
      </div>
    </div>
    <div class="col">
      <i class="el-icon-user">
        <span class="span">姓&#12288&#12288名：</span>
        <span class="span_2">{{userInfo.name}}</span>
      </i>
    </div>
    <div class="col">
      <i class="el-icon-female">
        <!--//el-icon-male-->
        <span class="span">性&#12288&#12288别：</span>
        <span class="span_2" v-if="userInfo.sex==0">男</span>
        <span class="span_2" v-else>女</span>
      </i>
    </div>
    <div class="col">
      <i class="el-icon-odometer">
        <span class="span">年&#12288&#12288龄：</span>
        <span class="span_2">{{userInfo.age}}</span>
      </i>
    </div>
    <div class="col">
      <i class="el-icon-postcard">
        <span class="span">身份证号：</span>
        <span class="span_2">{{userInfo.idcard}}</span>
      </i>
    </div>
    <div class="col">
      <div style="display: inline;">
        <i class="el-icon-office-building">
          <span class="span">公司地址：</span>
          <span class="span_2">{{userInfo.address}}</span>
        </i>
      </div>

      <div class="change">
        <el-button type="text" @click="open(1,null,'公司地址')">
          <el-link type="primary">修改</el-link>
        </el-button>
      </div>
    </div>

    <div class="col">
      <div style="display: inline;">
        <i class="el-icon-s-promotion">
          <span class="span">电子邮箱：</span>
          <span class="span_2">{{userInfo.email}}</span>
        </i>
      </div>
      <div class="change">
        <el-button type="text" @click="open(2,mailPattern,'电子邮箱')">
          <el-link type="primary">修改</el-link>
        </el-button>
      </div>
    </div>
    <div class="col">
      <div style="display: inline;">
        <i class="el-icon-phone ">
          <span class="span">移动电话：</span>
          <span class="span_2">{{userInfo.phone}}</span>
        </i>
      </div>
      <div class="change">
        <el-button type="text" @click="open(3,phonePattern,'移动电话')">
          <el-link type="primary">修改</el-link>
        </el-button>
      </div>
    </div>
    <div class="col">
      <div style="display: inline;">
        <i class="el-icon-info">
          <span class="span">备&#12288&#12288注：</span>
          <span class="span_2">{{userInfo.message}}</span>
        </i>
      </div>
      <div class="change">
        <el-button type="text" @click="open(4,null,'备注')">
          <el-link type="primary">修改</el-link>
        </el-button>
      </div>
    </div>
  </div>


</template>

<script>
  export default {
    name: 'index',

    data() {
      return {
        sizeList: ["large", "medium", "small"],
        mailPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        phonePattern: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
        loading: false,
        userInfo: {
          name: '',
          age: '',
          sex: '',
          idcard: '',
          address: '',
          email: '',
          phone: '',
          message: '',
          img: ''
        },
        imageUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      }
    },
    mounted() {
      this.getMessage();
    },
    watch: {
      immediate: false,
      address: {
        handler: function (newVal, oldVal) {
          // console.log(newVal);
          // console.log(newVal, 1111, oldVal);
          if (newVal != oldVal) {
            this.updateMessage(1, newVal);
          }
        }
      },
      email: {
        handler: function (newVal, oldVal) {
          // console.log(newVal);
          if (newVal != oldVal) {
            this.updateMessage(2, newVal);
          }
        }
      },
      phone: {
        handler: function (newVal, oldVal) {
          // console.log(newVal);
          if (newVal != oldVal) {
            this.updateMessage(3, newVal);
          }
        }
      },
      message: {
        handler: function (newVal, oldVal) {
          // console.log(newVal);
          if (newVal != oldVal) {
            this.updateMessage(4, newVal);
          }
        }
      },
      deep: true
    },

    //设置计算属性，用于监视对象某个值的变化
    computed: {
      address: function () {
        // console.log(btname, values, 888);
        return this.userInfo.address;
      },
      email: function () {
        return this.userInfo.email;
      },
      phone: function () {
        return this.userInfo.phone;
      },
      message: function () {
        return this.userInfo.message;
      }
    },
    methods: {

      handleError(file){
        this.$message.error('上传失败');
        this.loading=false;
      },
      handleAvatarSuccess(res, file) {
        if (res.data == 'fornidden') {
          this.$message.warning('图片不符合要求');
        }
        else if (res.data == 'error') {
          this.$message.error('图片上传失败');
        }
        else {
          this.imageUrl = URL.createObjectURL(file.raw);
          console.log(this.imageUrl);
        }
        this.loading=false;
      },
      beforeAvatarUpload(file) {
        this.loading=true;
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          this.loading=false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          this.loading=false;
        }
        return isJPG && isLt2M;
      },
      //上传图片
      // uploadImg(file){
      //   let vm=this;
      //   console.log('正在上传头像---'+file.)
      // },
      //获取用户信息
      getMessage() {
        // this.$message.info('正在获取用户'+this.$store.getters.getUser.username+'的信息')
        let vm = this;
        this.axios({
          method: 'post',
          url: 'http://localhost:8090/getUserInfo',
          data: {
            username: vm.$store.getters.getUser.username
          }
        })
          .then(function (resp) {
            // console.log(resp.data);
            vm.userInfo = resp.data
            // switch (vm.userInfo.sex) {
            //   case 0:
            //     vm.userInfo.sex = '男';
            //     break;
            //   case 1:
            //     vm.userInfo.sex = '女';
            // }
            if (vm.userInfo.img != null) {
              vm.imageUrl='http://localhost:8090/'+vm.userInfo.img;
            }
          }).catch(function () {
          vm.$message({
            message: '出错了',
            type: 'error'
          })
        })
      },

      //更新用户信息
      updateMessage(btname, values) {
        // console.log(values);
        let vm = this;
        this.axios({
          method: 'post',
          url: 'http://localhost:8090/updateUserMessage',
          data: {
            name: vm.$store.getters.getUser.username,
            id: btname,
            message: values
          }
        })
          .then(function (resp) {
            console.log(resp.data)
            if (resp.data == 'success') {
              // vm.$message.success('更新成功');
            }
            else {

            }
          })
          .catch(function () {
            vm.$message.error('服务器忙');
          })
      },

      //弹出框函数，更改信息
      open(btname, pattern, name) {
        this.$prompt('请输入' + name, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: pattern,
          inputErrorMessage: '格式不正确'
        }).then(({value}) => {
          this.$message.success('尝试更新，修改后的' + name + '为: ' + value);
          switch (btname) {
            case 1:
              this.userInfo.address = value;
              break;
            case 2:
              this.userInfo.email = value;
              break;
            case 3:
              this.userInfo.phone = value;
              break;
            case 4:
              this.userInfo.message = value;
              break;
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
        });
      }
    }
  }
</script>

<style scoped>
  .box {
    width: 530px;
    height: 530px;
    border: 1px solid #DCDFE6;
    margin:  30px auto;
    padding: 20px 50px 20px 80px;
    border-radius: 20px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }

  .block {
    padding: 10px 50px 10px 200px;
  }

  .col {
    padding: 10px 20px 10px 20px;
    font-size: 20px;
  }

  .span {
    padding: 0px 10px 0px 5px;
    font-size: 18px;
  }

  .span_2 {
    padding: 0px 10px 0px 0px;
    font-size: 16px;
    text-align: center;
  }

  .edit {
    padding: 5px 5px 0px 5px;
    font-size: 20px;
  }

  .change {
    float: right;
    /*padding-right: 0px;*/
    display: inline;
  }
</style>

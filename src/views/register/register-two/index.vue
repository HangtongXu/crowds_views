<template>
    <div class="box">
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" >
        <div class="title">
          <h3>完善个人信息</h3>
        </div>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard">
          <el-input v-model="form.idcard"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="form.age" ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="0" >男</el-radio>
            <el-radio label="1" >女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input type="textarea" v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="其他信息">
          <el-input type="textarea" v-model="form.message"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')" class="btn" :loading="loading">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    export default {
        name: "Register",
      data() {
        var checkAge = (rule, value, callback) => {
          setTimeout(() => {
            if (!Number.isInteger(value)) {
              callback(new Error('请输入数字值'));
            } else {
              if (value < 18) {
                callback(new Error('必须年满18岁'));
              } else {
                callback();
              }
            }
          }, 1000);
        };
        return {
          form: {
            name: '',
            idcard: '',
            age: '',
            email: '',
            phone:'',
            sex:'',
            address: '',
            message: '',
          },
          rules:{
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' }
            ],
            age:[
              {required:true,validator:checkAge,trigger:'blur'}
            ],
            idcard: [
              { required: true, message: '请输入身份证号', trigger: 'blur' },
              { min: 18, max: 18, message: '请输入18位身份证号', trigger: 'blur' }
            ],
            sex: [
              { required: true, message: '请选择性别', trigger: 'blur' }
            ],
            email: [
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              {type:'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
            ],
            phone: [
              { required: true, message: '请输入联系方式', trigger: 'blur' },
              { min: 11, max: 11, message: '请输入正确的身份证号', trigger: 'blur' }
            ],
            address: [
              { required: true, message: '请输入地址', trigger: 'blur' }
            ],
          },
          loading:false,
          active:2
        }
      },

      methods: {
        testTo:function(){
          this.$router.push('/Login')
        },
        onSubmit:function(formName) {

          this.$refs[formName].validate((valid) => {
            this.loading=true;
            if (valid) {
              let vm=this;
              this.axios({
                method:'post',
                url:'http://localhost:8090/re_two',
                data:{
                  userMessage:{
                    name: vm.form.name,
                    idcard: vm.form.idcard,
                    age: vm.form.age,
                    email: vm.form.email,
                    phone:vm.form.phone,
                    sex:vm.form.sex,
                    address: vm.form.address,
                    message: vm.form.message,
                  },
                  userInfo:{
                    username:sessionStorage.getItem("registid")
                  }
                }
              }).then(function (resp) {
                if(resp.data=='success'){
                  vm.$message.success('注册成功');
                  vm.$router.push('/Login');
                  sessionStorage.removeItem("registid")
                }
                else{
                  vm.$message.error('注册失败');
                }
                vm.loading=false;
              })
            } else {

              this.$message.error('请检查格式是否正确');
              this.loading=false;
              return false;
            }
          });
        }
      }
    }
</script>

<style scoped>
.box{
  width: 500px;
  height: 780px;
  border: 1px solid #DCDFE6;
  margin: 150px auto;
  padding: 20px 50px 20px 80px;
  border-radius:20px;
  box-shadow: 0px 0px 20px #DCDFE6;
}
.title{
  text-align: center;
  margin-bottom: 40px;
}
.btn{
  width:420px;
  padding: 10px 50px 10px 50px;
  align: center;
}
</style>

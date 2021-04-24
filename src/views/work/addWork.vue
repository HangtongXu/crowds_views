<template>
  <div class="box" v-if="!showMap">
    <div class="title">
      <el-page-header @back="goBack" content="新建任务"></el-page-header>
    </div>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="截止时间" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          placeholder="选择日期时间"
          default-time="00:00:00"
          format="yyyy 年 MM 月 dd 日 HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 300px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="完成形式" prop="form">
        <el-select v-model="form.form" placeholder="请选择形式">
          <el-option label="实时数据" value="1"></el-option>
          <el-option label="历史数据收集" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资格要求" prop="demand">
        <el-select v-model="form.demand" placeholder="请选择学历">
          <el-option label="小学" value="1"></el-option>
          <el-option label="专科" value="2"></el-option>
          <el-option label="本科" value="3"></el-option>
          <el-option label="硕士以上" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布形式" prop="distribute">
        <el-select v-model="form.distribute" placeholder="请选择形式" @change="handleDistributeChange">
          <el-option label="实时发布" value="0"></el-option>
          <el-option label="限时拍卖" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赏金上限" prop="money" v-if="changeDistribute">
        <el-input-number v-model.number="form.money" :step="1" :precision="1"></el-input-number>
      </el-form-item>
      <el-form-item label="任务赏金" prop="money" v-if="!changeDistribute">
        <el-input-number v-model.number="form.money" :step="1" :precision="1"></el-input-number>
      </el-form-item>
      <el-form-item label="人数上限" prop="members">
        <el-input-number v-model.number="form.members" :step="1" ></el-input-number>
      </el-form-item>
      <el-form-item label="其他要求" prop="message">
        <el-input type="textarea" v-model="form.message"></el-input>
      </el-form-item>
      <el-form-item label="任务地址" prop="address">
        <el-link>{{form.address}}</el-link>
        <el-button icon="el-icon-add-location" @click="getAddress"></el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Submit('form')" class="btn" :loading="loading">发布任务</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="mapBox" v-else>
    <addMap ref="GDmap" v-bind:address="form.address" v-on:correspond="correspond"></addMap>
    <div class="search">
      <div class="search_input">
        <el-autocomplete
          v-model="searchKey"
          :fetch-suggestions="autocomplete"
          value-key="name"
          placeholder="请输入内容"
          @select="handleSelect"
          style="width: 300px"
        ></el-autocomplete>
      </div>
      <div class="searchbtn">
        <el-button icon="el-icon-search" @click="searchByKeyWord">搜索</el-button>
      </div>
    </div>
    <div class="res_link">
      <el-link>当前选定位置为：{{form.address}}</el-link>
      <div class="ackbtn">
        <el-button icon="el-icon-success" circle size="small" @click="closemap"></el-button>
      </div>
    </div>
    <map-utils ref="utils" v-on:correspond="correspond"></map-utils>
  </div>

</template>

<script>
  import addMap from '../map'
  import mapUtils from '../mapUtils'

  export default {
    components: {addMap, mapUtils},
    name: "addwork",
    data() {

      return {
        showMap: false,
        changeDistribute:false,
        form: {
          name: '',
          deadline: '',
          form: '',
          demand: '',
          money: 0,
          message: '',
          type: '',
          uid: '',
          address: '',
          lat: '',
          lng: '',
          members:0,
          distribute:''
        },
        searchKey: '',
        suggestion: '',
        rules: {
          name: [
            {required: true, message: '请输入任务名称', trigger: 'blur'},
            {min: 3, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          deadline: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          form: [
            {required: true, message: '请至少选择一个完成形式', trigger: 'change'}
          ],
          demand: [
            {required: true, message: '请至少选择一个资格要求', trigger: 'change'}
          ],
          message: [
            {required: true, message: '描述不能为空', trigger: 'blur'}
          ],
          money:[
            {type:'number',required:true},
            {pattern: /^(1|[1-9]\d?|)$/,message:'赏金不能小于1'}
          ],
          members:[
            {type:'number',required:true},
            {pattern: /^(1|[1-9]\d?|)$/,message:'最少需要一个任务执行人'}
          ],
          address:[
            {required:true,message:'采集地点不能为空'}
          ],
          distribute:[
            {required:true,message:'请选择任务发布方式'}
          ]
        },
        loading: false
      }
    },
    watch:{

    },
    methods: {
      correspond(flag, data) {
        if (flag == 1) {
          this.form.address = data.pname + data.cityname + data.name
          this.form.lat = data.location.lat
          this.form.lng = data.location.lng
        }
        if (flag == 2) {
          this.suggestion = data
        }
        if (flag == 3) {
          this.searchKey = data
        }
      },
      autocomplete(queryString, cb) {
        if (this.searchKey == '') {
          this.$refs.utils.getIPaddress()
        }
        this.$refs.GDmap.autoInput(this.searchKey)
        if (Array.isArray(this.suggestion)) {
          cb(this.suggestion)
        }
      },
      handleSelect(item) {
        this.searchByKeyWord()
      },
      searchByKeyWord() {
        this.$refs.GDmap.search(this.searchKey)
      },
      getAddress() {
        this.showMap = !this.showMap
      },
      closemap() {
        this.showMap = !this.showMap
      },
      goBack() {
        this.$emit('closeAdd')
      },
      Submit(formName) {
        let vm = this;
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios({
              method: "post",
              url: "http://localhost:8090/addwork",
              data: {
                name: vm.form.name,
                demand: vm.form.demand,
                money: vm.form.money,
                form: vm.form.form,
                deadline: vm.form.deadline,
                address: vm.form.address,
                longtitude: vm.form.lng,
                latitude: vm.form.lat,
                message: vm.form.message,
                members: vm.form.members,
                uid: vm.$store.getters.getUser.uid,
                distribute:vm.form.distribute
              }
            })
              .then(function (resp) {
                if (resp.data == 'success') {
                  vm.$message.success('发布成功');
                  vm.loading = false;
                  vm.goBack();
                }
                else {
                  vm.loading = false;
                  vm.$message.error('发布失败，请检查');
                }
              })
              .catch(function () {
                vm.$message.error('服务器错误');
                vm.loading = false;
              })
          } else {
            this.$message.warning('请按提示完善表单');
            this.loading=false
            return false;
          }
        });
      },
      handleDistributeChange(value){
        console.log(value)
        if(value=='1'){
          this.changeDistribute=false;
        }
        else {
          this.changeDistribute=true;
        }
      }
    }
  }
</script>

<style scoped>
  .box {
    width: 500px;
    height: 660px;
    border: 1px solid #DCDFE6;
    margin: 10px auto;
    padding: 20px 50px 20px 80px;
    border-radius: 20px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }

  .mapBox {
    width: 500px;
    height: 570px;
    border: 1px solid #DCDFE6;
    margin: 10px auto;
    border-radius: 20px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }

  .search {
    float: right;
    padding: 5px 30px 0px 5px;
  }

  .search_input {
    width: 300px;
    height: 20px;
    padding: 5px 5px 30px 5px;
    float: left;
  }

  .searchbtn {
    width: 30px;
    height: 20px;
    padding: 5px 80px 0px 0px;
    float: left;
  }

  .res_link {
    width: 400px;
    height: 10px;
    padding: 10px 0px 0px 60px;
    float: left;
  }

  .ackbtn {
    float: right;
    padding: 0px 30px 0px 10px;
  }

  .title {
    text-align: center;
    margin-bottom: 40px;
  }

  .btn {
    width: 420px;
    padding: 10px 50px 10px 50px;
    align: center;
  }
</style>

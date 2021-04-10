<template>
  <div class="box">
    <div class="addbt">
      <el-tooltip content="刷新" placement="bottom">
        <el-button icon="el-icon-refresh" circle v-if="isFresh" @click="fresh"></el-button>
        <el-button icon="el-icon-loading" circle v-else></el-button>
      </el-tooltip>
    </div>
    <div class="card_1">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>当前可用余额</span>
          <el-button style="float: right;padding-bottom: 10px; " size="medium" type="danger" round>充值</el-button>

        </div>
        <span style="color: 	#DAA520">￥&nbsp</span><span style="font-size: 25px;color: 	#DAA520">{{money}}</span>
      </el-card>
    </div>
    <div class="card_2">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>当前可用T豆</span>
          <el-button style="float: right;padding-bottom: 10px; " size="medium" type="success" round>提现</el-button>
          <span style="float: right;padding-bottom: 10px; ">&nbsp</span>
          <el-button style="float: right;padding-bottom: 10px; " size="medium" type="danger" round>购买</el-button>
        </div>
        <span style="color: 	#DAA520"><i class="el-icon-apple"></i>&nbsp</span><span style="font-size: 25px;color: 	#DAA520">{{codes}}</span>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        isFresh: true,
        money:0,
        codes:0,
      }
    },
    created(){
      this.fresh()
    },
    methods:{
      fresh(){
        let vm=this
        let uid=vm.$store.getters.getUser.uid
        console.log(uid)
        this.axios({
          method:"get",
          url:'http://localhost:8090/getPurse?uid='+uid,
        })
          .then(function (resp) {
            vm.money=resp.data.money
            vm.codes=resp.data.codes
          })
          .catch(function (e) {
            console.log(e)
          })
      }
    }
  }
</script>

<style scoped>
  .addbt {
    padding: 5px 10px 5px 750px;
  }

  .box {
    width: 800px;
    height: 500px;
    border: 1px solid #DCDFE6;
    margin: 10px auto;
    padding: 20px 50px 20px 80px;
    border-radius: 20px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }

  .card_1 {
    width: 350px;
    height: 300px;
    border-radius: 30px;
    float: left;
    padding: 30px 20px 20px 30px;
  }

  .card_2 {
    width: 350px;
    height: 300px;
    border-radius: 30px;
    float: right;
    padding: 30px 30px 20px 20px;
  }
</style>

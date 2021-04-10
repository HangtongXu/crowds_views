<template>
  <div>
    <div class="line"></div>
    <el-menu
      :default-active="this.$route.path"
      :router="true"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      v-model="activeIndex"
    >
      <el-submenu index="1" v-if="this.$store.getters.getUser.type ==0">
        <template slot="title">任务中心</template>
        <el-menu-item index="/work/1">发布的任务</el-menu-item>
        <el-menu-item index="/work/2">已完成任务</el-menu-item>
        <el-menu-item index="/work/3">进行中任务</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">我的任务</template>
        <el-menu-item index="/mwork/1">任务接收</el-menu-item>
        <el-menu-item index="/mwork/2">待完成任务</el-menu-item>
        <el-submenu index="3">
          <template slot="title">历史任务</template>
          <el-menu-item index="/mwork/3">未结算</el-menu-item>
          <el-menu-item index="/mwork/4">已结束</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="/message">消息中心</el-menu-item>
      <el-submenu index="4" >
        <template slot="title">订单中心</template>
        <el-menu-item index="/order/1">所有订单</el-menu-item>
        <el-menu-item index="/order/2">待确认订单</el-menu-item>
        <el-menu-item index="/order/3">未结算订单</el-menu-item>
        <el-menu-item index="/order/4">历史订单</el-menu-item>
      </el-submenu>
      <el-menu-item index="/purse">我的钱包</el-menu-item>
      <el-menu-item index="/info">个人中心</el-menu-item>
      <el-menu-item index="/logout" style="float: right">切换账户</el-menu-item>
      <el-menu-item index="/info" style="float: right">欢迎您，{{name}}</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '/info',
        name:this.$store.getters.getUser.username
      };
    },
    created:function(){
      this.$router.push({path:'/info'})
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>

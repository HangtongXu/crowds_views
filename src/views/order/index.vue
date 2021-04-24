<template>
  <div class="box">
    <div class="addbt">
      <el-button icon="el-icon-refresh" circle v-if="isFresh" @click="refresh(index)"></el-button>
      <el-button icon="el-icon-loading" circle v-else></el-button>
    </div>

    <div>
      <el-table
        :data="
          tableData.filter(data => (!search ||data.id==search.toLowerCase()))"
        style="width:100%"
        v-loading="listLoading"
        :border="true"
      >
        <el-table-column
          prop="id"
          label="订单编号"
          sortable
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="date"
          label="发布日期"
          sortable
          width="230">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布者"
          width="150">
          <template>
            <span>{{this.$store.getters.getUser.username}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wname"
          label="工作者"
          width="150">
        </el-table-column>
        <el-table-column
          label="当前状态"
          width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">订单创建完成</span>
            <span v-if="scope.row.state==2">工作者完成工作，等待确认</span>
            <span v-if="scope.row.state==3">发布者确认完成</span>
            <span v-if="scope.row.state==4">工作者确认接收</span>
            <span v-if="scope.row.state==5">订单已结束流程</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="应发放赏金"
          width="100">
        </el-table-column>
        <el-table-column
          width="169px"
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <div v-if="scope.row.state==1"><span>等待工作者完成工作</span></div>
            <div style="padding: 0px 20px 0px 10px;" v-if="scope.row.state==2">
              <el-button plain type="success" @click="ackPay(scope.$index,scope.row)">发放工资</el-button>
            </div>
            <div v-if="scope.row.state==3"><span>等待工作者确认金额</span></div>
            <div v-if="scope.row.state>3"><span>订单流程结束</span></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 5px auto;float: right">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="refresh(index)"/>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'

  export default {
    name: "index",
    props: ['index'],
    components: {Pagination},
    data() {
      return {
        tableData: [],
        listLoading: false,
        search: '',
        isFresh: true,
        listQuery: {
          page: 1,
          limit: 8,
        },
        total: 0
      }
    },
    created: function () {
      this.refresh(this.$route.params.index)
    },
    watch: {
      index: function (newvalue, oldvalue) {
        this.tableData=[]
        this.refresh(newvalue)
      }
    },
    methods: {
      refresh(value) {
        switch (value) {
          case '1':
            this.fresh_1();
            break;
          case '2':
            this.fresh_2();
            break;
          case '3':
            this.fresh_3();
            break;
          case '4':
            this.fresh_4();
            break;
        }
      },
      fresh_1() {
        var id = this.$store.getters.getUser.uid;
        this.listLoading = true;
        let vm = this;
        this.axios({
          method: "post",
          url: 'http://localhost:8090/order_all',
          data: {
            id: id,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.tableData = resp.data.list;
            vm.total = resp.data.total;
            setTimeout(() => {
              vm.listLoading = false;
            }, 0.5 * 1000)
          })
          .catch(function () {
            vm.listLoading = false;
            vm.$message.error("服务器出错了");
          })
      },
      fresh_2() {
        var id = this.$store.getters.getUser.uid;
        this.listLoading = true;
        let vm = this;
        this.axios({
          method: "post",
          url: 'http://localhost:8090/order_ack',
          data: {
            id: id,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.tableData = resp.data.list;
            vm.total = resp.data.total;
            setTimeout(() => {
              vm.listLoading = false;
            }, 0.5 * 1000)
          })
          .catch(function () {
            vm.listLoading = false;
            vm.$message.error("服务器出错了");
          })
      },
      fresh_3() {
        var id = this.$store.getters.getUser.uid;
        this.listLoading = true;
        let vm = this;
        this.axios({
          method: "post",
          url: 'http://localhost:8090/order_pay',
          data: {
            id: id,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.tableData = resp.data.list;
            vm.total = resp.data.total;
            setTimeout(() => {
              vm.listLoading = false;
            }, 0.5 * 1000)
          })
          .catch(function () {
            vm.listLoading = false;
            vm.$message.error("服务器出错了");
          })
      },
      fresh_4() {
        var id = this.$store.getters.getUser.uid;
        this.listLoading = true;
        let vm = this;
        this.axios({
          method: "post",
          url: 'http://localhost:8090/order_his',
          data: {
            id: id,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.tableData = resp.data.list;
            vm.total = resp.data.total;
            setTimeout(() => {
              vm.listLoading = false;
            }, 0.5 * 1000)
          })
          .catch(function () {
            vm.listLoading = false;
            vm.$message.error("服务器出错了");
          })
      },
      ackPay(index, row) {
        let vm = this;
        this.$confirm('确认该工作者已完成任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: "get",
            url: 'http://localhost:8090/userAckPay?uid='+vm.$store.getters.getUser.uid+'&money='+row.money+"&wid="+row.wid,
          })
            .then(function (resp) {
              console.log(resp.data)
              if (resp.data == 'forbidden') {
                vm.$message.warning('您的T币余额不足，请前往钱包充值！')
              }
              if (resp.data == 'error') {
                vm.$message.warning('系统错误，请稍后再试')
              }
              if (resp.data == 'success') {
                vm.$message.success('确认成功，进入下一流程')
                vm.refresh(2)
              }
            })
            .catch(function (e) {
              console.log(e)
              vm.$message.error('服务器出错了！！')
            })
        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          });
      }
    }
  }
</script>

<style scoped>
  .box {
    width: 1100px;
    height: 700px;
    border: 1px solid #DCDFE6;
    margin: 10px auto;
    padding: 20px 50px 20px 80px;
    border-radius: 20px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }

  .addbt {
    float: right;
    padding: 5px 10px 5px 10px;
  }
</style>

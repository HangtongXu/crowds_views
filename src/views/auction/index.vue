<template>
  <div class="box">
    <div class="addbt">
      <el-button icon="el-icon-refresh" circle v-if="isFresh" @click="refresh"></el-button>
      <el-button icon="el-icon-loading" circle v-else></el-button>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          label="发布日期"
          width="190">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createtime }}</span></template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="任务名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="120">
        </el-table-column>
        <el-table-column
          prop="form"
          label="完成形式"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.form==1">实时数据</span>
            <span v-else>历史数据采集</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="demand"
          label="资格要求"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <h4>其他要求</h4>
              <p>{{ scope.row.message }}</p>
              <div slot="reference" class="name-wrapper">
                <span v-if="scope.row.demand==1">小学</span>
                <span v-if="scope.row.demand==2">专科</span>
                <span v-if="scope.row.demand==3">本科</span>
                <span v-if="scope.row.demand==4">硕士及以上</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="members"
          label="人数限制（最多）"
          show-overflow-tooltip
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="deadline"
          label="截止时间"
          show-overflow-tooltip
          width="190px"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.deadline }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wmoney"
          label="我的出价"
          align="right">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.wmoney"
              size="mini"
              @change="inputCheck(scope.$index,scope.row.wmoney)"
              placeholder="输入您的出价"/>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div style="margin: 20px auto;float: right">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="refresh"/>
    </div>
    <div style="margin-top: 20px;float: left;">
      <el-button @click="submitChoice()">提交标的</el-button>
      <el-button @click="clearSelection()">取消选择</el-button>
    </div>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'

  export default {
    name: "index",
    components: {Pagination},
    data() {
      return {
        isFresh: true,
        tableData: [],
        total: 0,
        money: '',
        listQuery: {
          page: 1,
          limit: 8,
        },
        worker:'',
        loading:false
      }
    },
    created: function () {
      this.refresh()
      this.refreshWorker()
    },
    methods: {
      refreshWorker(){
        let vm=this
        this.axios.get("http://localhost:8090/getWorkerMaxTask",
          {
            params:{
              uid:vm.$store.getters.getUser.uid
            }
          }
        )
          .then(function (resp) {
            vm.worker=resp.data
          })
          .catch(function (e) {
            console.log(e)
          })
      },
      refresh() {
        this.loading =true;
        this.isFresh = false;
        let vm = this;
        this.axios.post('http://localhost:8090/getAuctionMission',
          {
            id: vm.$store.getters.getUser.uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        )
          .then(function (resp) {
            console.log(resp.data.list)
            vm.tableData = resp.data.list
            vm.total = resp.data.total
          })
          .catch(function (e) {
            console.log(e)
          })
        this.isFresh = true;
        setTimeout(()=>{
          vm.loading=false;
        },500)
      },
      clearSelection() {
        this.$refs.multipleTable.clearSelection();
      },
      inputCheck(index, value) {
        console.log(index, value)
        let reg = /^[1-9]\d*$/;
        var _this = this;
        if (value) {
          if (new RegExp(reg).test(value) == false) {
            setTimeout(() => {
              _this.$message.warning('输入的出价只能是数字')
              _this.tableData[index].wmoney = ''
            }, 500);
          }
        }
      },
      submitChoice() {
        this.loading=true;
        let rows = this.$refs.multipleSelection
        let vm = this
        rows.forEach(row => {
          console.log(row.wmoney)
          if (row.wmoney == null) {
            vm.$message.warning('存在未报价标的，请检查')
            this.loading=false;
            return
          }
        })
        rows.forEach(row => {
          this.loading=true;
          this.axios.post('http://localhost:8090/addAuction',
            {
              wid:this.worker.id,
              mid:row.id,
              money:row.wmoney
            }
          )
            .then(function (re) {
              if(re.data='error'){
                return
              }
              else{
                console.log(re)
              }
            })
            .catch(function (e) {
              console.log(e)
            })
        })
        this.$message.success('提交成功');
        setTimeout(()=>{
          vm.loading=false;
          this.refresh();
        },1000)
      },
      handleSelectionChange(val) {
        this.$refs.multipleSelection = val;

      }
    }
  }
</script>

<style scoped>
  .box {
    width: 1200px;
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

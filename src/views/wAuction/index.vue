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
          label="发布日期"
          width="190">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.mission.createtime }}</span></template>
        </el-table-column>
        <el-table-column
          prop="mission.name"
          label="任务名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="mission.address"
          label="地址"
          width="120">
        </el-table-column>
        <el-table-column
          prop="mission.form"
          label="完成形式"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.mission.form==1">实时数据</span>
            <span v-else>历史数据采集</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mission.demand"
          label="资格要求"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <h4>其他要求</h4>
              <p>{{ scope.row.mission.message }}</p>
              <div slot="reference" class="name-wrapper">
                <span v-if="scope.row.mission.demand==1">小学</span>
                <span v-if="scope.row.mission.demand==2">专科</span>
                <span v-if="scope.row.mission.demand==3">本科</span>
                <span v-if="scope.row.mission.demand==4">硕士及以上</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="mission.members"
          label="人数限制（最多）"
          show-overflow-tooltip
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="mission.deadline"
          label="截止时间"
          show-overflow-tooltip
          width="190px"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.mission.deadline }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="我的出价"
          >
        </el-table-column>
        <el-table-column
          label="当前状态"
        >
          <template slot-scope="scope">
            <div style="font-size: 25px" v-if="scope.row.state==1 ">
              <el-tooltip class="item" effect="dark" content="等待竞价结果" placement="top-start">
                <i class="el-icon-s-flag"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 25px" v-if="scope.row.state==-1 ">
              <el-tooltip class="item" effect="dark" content="竞价失败" placement="top-start">
                <i class="el-icon-error"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 25px" v-if="scope.row.state==2 ">
              <el-tooltip class="item" effect="dark" content="竞价成功,已进入任务完成阶段" placement="top-start">
                <i class="el-icon-s-grid"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 25px" v-if="scope.row.state==3 ">
              <el-tooltip class="item" effect="dark" content="任务结束" placement="top-start">
                <i class="el-icon-check"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div style="margin: 20px auto;float: right">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="refresh"/>
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
        num:0,
        loading:false
      }
    },
    created: function () {
      this.refresh()
    },
    methods: {
      refresh() {
        this.isFresh = false;
        this.loading=true;
        let vm = this;
        this.axios.post('http://localhost:8090/getMission/mauction',
          {
            id: vm.$store.getters.getUser.uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        )
          .then(function (resp) {
            console.log(resp)
            vm.tableData = resp.data.list
            vm.total = resp.data.total
            setTimeout(()=>{
              vm.loading=false;
            },500)
          })
          .catch(function (e) {
            console.log(e)
            vm.loading=false;
          })
        this.isFresh = true;
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
        let rows = this.$refs.multipleSelection
        let vm = this
        rows.forEach(row => {
          console.log(row.wmoney)
          if (row.wmoney == null) {
            vm.$message.warning('存在未报价标的，请检查')
            return
          }
        })
        rows.forEach(row => {
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
            })
            .catch(function (e) {
              console.log(e)
            })
        })
      },
      handleSelectionChange(val) {
        this.$refs.multipleSelection = val;

      },
      async getMembers(index,id){
        let vm=this;
        let get=()=>{
          return new Promise(resolve => {
            this.axios.get('http://localhost:8090/getMission/auctionMember',{
              params:{
                id:id
              }
            })
              .then(function (resp) {
               resolve(resp.data);
               vm.tableData[index].auctionMembers=resp.data;
              })
              .catch(function (e) {
                console.log(e)
              })
          })
        }
        let val=await get()
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

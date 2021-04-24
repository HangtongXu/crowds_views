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
        @row-dblclick="details"
      >
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
          prop="money"
          label="赏金上限"
        >
        </el-table-column>
        <el-table-column
          label="当前状态"
        >
          <template slot-scope="scope">
            <div style="font-size: 25px" v-if="scope.row.state==0 ">
              <el-tooltip class="item" effect="dark" content="竞价未开始" placement="top-start">
                <i class="el-icon-c-scale-to-original"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 25px" v-if="scope.row.state==-1 ">
              <el-tooltip class="item" effect="dark" content="发布失败" placement="top-start">
                <i class="el-icon-error"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 25px" v-if="scope.row.state==1 ">
              <el-tooltip class="item" effect="dark" content="竞价进行中" placement="top-start">
                <i class="el-icon-sort"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 25px" v-if="scope.row.state==2 ">
              <el-tooltip class="item" effect="dark" content="竞价完成，等待工作者完成" placement="top-start">
                <i class="el-icon-s-grid"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 25px" v-if="scope.row.state==3">
              <el-tooltip class="item" effect="dark" content="竞价任务已完成" placement="top-start">
                <i class="el-icon-finished"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="参与竞拍人数"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.state==0 ">
              <span>竞价未开始</span>
            </div>
            <div v-else>
              <span style="display: none">{{getMembers(scope.$index,scope.row.id)}}</span>
              <span>{{scope.row.auctionMembers}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div style="margin: 20px auto;float: right">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="refresh"/>
    </div>

    <div v-if="detail">
      <el-drawer
        title="任务详情"
        direction="rtl"
        :visible.sync="detail"
        size="70%">
        <div style="height: 180px">
          <div class="drawbox">
            <span class="draw_span_left"><b>任务名称： </b>{{workDetails.name}}</span>
            <span class="draw_span_right"><b>任务赏金： </b>{{workDetails.money}}</span>
          </div>
          <div class="drawbox">
            <span class="draw_span_left"><b>任务要求： </b>{{workDetails.demand}}</span>
            <span class="draw_span_right" v-if="workDetails.form==1"><b>任务形式： </b>实时数据采集</span>
            <span class="draw_span_right" v-if="workDetails.form==2"><b>任务形式： </b>历史数据采集</span>
          </div>
          <div class="drawbox">
            <span class="draw_span_left"><b>创建时间： </b>{{workDetails.createtime}}</span>
            <span class="draw_span_right"><b>截止时间： </b>{{workDetails.deadline}}</span>
          </div>

          <div class="drawbox">
            <span class="draw_span_left" v-if="workDetails.state==0"><b>任务状态： </b>等待分发中</span>
            <span class="draw_span_left" v-if="workDetails.state==1"><b>任务状态： </b>正在分发</span>
            <span class="draw_span_left" v-if="workDetails.state==2"><b>任务状态： </b>派发完成，任务进行中</span>
            <span class="draw_span_left" v-if="workDetails.state==3"><b>任务状态： </b>任务已结束</span>
            <span class="draw_span_left" v-if="workDetails.state==-1"><b>任务状态： </b>失败任务</span>
            <span class="draw_span_right"><b>任务地址： </b>{{workDetails.address}}</span>
          </div>
          <div class="drawbox">
            <span class="draw_span_left"><b>工人分布： </b>
              <el-link type="success" @click="getWorkerMap" style="font-size:16px">
                <span v-if="workerMap">点击查看</span><span v-else>关闭地图</span>
              </el-link>
            </span>
          </div>
          <div class="drawbox">
            <div class="draw_span_progress">
              <span><b>完成进度：</b></span>
              <el-progress :percentage="donePercent"></el-progress>
            </div>
          </div>
        </div>
        <div v-if="workerMap">
          <el-table
            :data="missionDetails"
            max-height="400"
            style="padding-top: 5px"
          >
            <el-table-column property="worker.name" label="姓名"></el-table-column>
            <el-table-column property="worker.address" label="地址"></el-table-column>
            <el-table-column property="worker.phone" label="电话"></el-table-column>
            <el-table-column property="worker.email" label="电子邮件"></el-table-column>
            <el-table-column property="worker.time" label="最近登陆时间"></el-table-column>
            <el-table-column property="state" label="提交状态">
              <template slot-scope="scope">
                <span v-if="scope.row.state ==1"><i class="el-icon-error"></i>未提交</span>
                <span v-if="scope.row.state >1"><i class="el-icon-success"></i>已提交</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mapbox" v-else>
          <workmap ref="map_work"></workmap>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'

  import workmap from '../map'

  export default {
    name: "index",
    components: {Pagination,workmap},
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
        workerMap:true,
        worker: '',
        num: 0,
        detail:false,
        workDetails:'',
        missionDetails:[],
        donePercent: 0,
        tbChange:false
      }
    },
    created: function () {
      this.refresh()
    },
    methods: {
      getWorkerMap() {
        this.workerMap = !this.workerMap
        if (!this.workerMap) {
          this.$nextTick(() => {
            this.$refs.map_work.changeClass(2);
            this.$refs.map_work.addPoint(this.workDetails, this.missionDetails)
          })
        }
      },
      handleDownload(index,row){
        let vm=this
        let a = document.createElement('a')
        a.href ="http://localhost:8090/fileDownload?mid="+row.id
        a.click();
        this.$message.success('下载成功')
      },
      details(row) {
        this.detail = true
        this.workerMap = true
        this.workDetails = row
        this.getDetails(row.id)
      },
      getDetails(id) {
        let vm = this
        this.axios({
          method: "get",
          url: 'http://localhost:8090/getMissionDetails?id=' + id,
        })
          .then(function (resp) {
            vm.missionDetails = resp.data
            vm.donePercent = 0
            for (let i = 0; i < resp.data.length; i++) {
              if (resp.data[i].state > 1) {
                vm.donePercent += 1
              }
            }
            if(resp.data.length<1){
              vm.donePercent =0
            }
            else{
              vm.donePercent = vm.donePercent * 100 / resp.data.length
            }
          })
          .catch(function () {
            console.log('获取详细信息失败')
          })
      },
      refresh() {
        this.isFresh = false;
        let vm = this;
        this.axios.post('http://localhost:8090/getMission/auction',
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
              wid: this.worker.id,
              mid: row.id,
              money: row.wmoney
            }
          )
            .then(function (re) {
              if (re.data = 'error') {
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
      async getMembers(index, id) {
        let vm = this;
        let get = () => {
          return new Promise(resolve => {
            this.axios.get('http://localhost:8090/getMission/auctionMember', {
              params: {
                id: id
              }
            })
              .then(function (resp) {
                resolve(resp.data);
                vm.tableData[index].auctionMembers = resp.data;
              })
              .catch(function (e) {
                console.log(e)
              })
          })
        }
        let val = await get()
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
  .draw_span_left {
    width: 300px;
    height: 25px;
    float: left;
    padding: 5px 0px 5px 40px;
  }

  .draw_span_right {
    width: 300px;
    height: 25px;
    float: right;
    padding: 5px 40px 5px 0px;
  }

  .draw_span_progress {
    width: 300px;
    height: 30px;
    float: right;
    padding: 5px 40px 10px 0px;
  }
</style>

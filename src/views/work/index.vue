<template>
  <div class="box">
    <div v-if="addwork && editWork  && index==1">
      <div class="addbt">
        <el-button type="success" @click="openAdd" plain>添加任务</el-button>
        <el-button icon="el-icon-refresh" circle v-if="refresh" @click="fresh"></el-button>
        <el-button icon="el-icon-loading" circle v-else></el-button>
      </div>

      <div>
        <el-table
          :data="
          list.filter(data => (!search || data.name.toLowerCase().includes(search.toLowerCase())||data.id==search.toLowerCase()))"
          style="width: 100%"
          v-loading="listLoading"
          :border="true"
          @row-dblclick="details"
        >
          <el-table-column
            prop="id"
            label="编号"
            width="69">
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="发布日期"
            sortable
            width="190">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createtime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="任务名称"
            width="150">
          </el-table-column>
          <el-table-column
            label="完成形式"
            width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.form==1">实时数据</span>
              <span v-else>历史数据采集</span>
            </template>
          </el-table-column>
          <el-table-column
            label="资格要求"
            width="100">
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
            label="任务人数剩余"
            width="80"
            prop="members">

          </el-table-column>
          <el-table-column
            prop="money"
            label="任务赏金"
            width="80">
          </el-table-column>
          <el-table-column
            prop="deadline"
            label="截止日期"
            sortable
            width="190"
          >
            <template slot-scope="scope">
              <!--<i class="el-icon-time"></i>-->
              <span style="margin-left: 10px">{{ scope.row.deadline }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="当前状态"
            width="60">
            <template slot-scope="scope">
              <div style="font-size: 25px" v-if="scope.row.state==0">
                <el-tooltip class="item" effect="dark" content="服务器正在准备派发" placement="top-start">
                  <i class="el-icon-upload"></i>
                </el-tooltip>
              </div>
              <div style="font-size: 25px" v-if="scope.row.state==1">
                <el-tooltip class="item" effect="dark" content="服务器正在派发" placement="top-start">
                  <i class="el-icon-position"></i>
                </el-tooltip>
              </div>
              <div style="font-size: 25px" v-if="scope.row.state==2">
                <el-tooltip class="item" effect="dark" content="服务器派发完毕" placement="top-start">
                  <i class="el-icon-circle-check"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字"/>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button
                size="mini"
                solt="reference"
                icon="el-icon-delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin: 5px auto;float: right">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="fresh"/>
      </div>
    </div>
    <div v-if="addwork && editWork  && index==2">
      <div class="addbt">
        <el-button type="success" @click="openAdd" plain>添加任务</el-button>
        <el-button icon="el-icon-refresh" circle v-if="refresh" @click="refreshed(index)"></el-button>
        <el-button icon="el-icon-loading" circle v-else></el-button>
      </div>

      <div>
        <el-table
          :data="
          list.filter(data => (!search || data.name.toLowerCase().includes(search.toLowerCase())||data.id==search.toLowerCase()))"
          style="width: 100%"
          v-loading="listLoading"
          :border="true"
          @row-dblclick="details"
        >
          <el-table-column
            prop="id"
            label="编号"
            width="69">
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="发布日期"
            sortable
            width="190">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createtime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="任务名称"
            width="150">
          </el-table-column>
          <el-table-column
            label="完成形式"
            width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.form==1">实时数据</span>
              <span v-else>历史数据采集</span>
            </template>
          </el-table-column>
          <el-table-column
            label="资格要求"
            width="100">
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
            label="任务人数剩余"
            width="80"
            prop="members">

          </el-table-column>
          <el-table-column
            prop="money"
            label="任务赏金"
            width="80">
          </el-table-column>
          <el-table-column
            prop="deadline"
            label="截止日期"
            sortable
            width="190"
          >
            <template slot-scope="scope">
              <!--<i class="el-icon-time"></i>-->
              <span style="margin-left: 10px">{{ scope.row.deadline }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="当前状态"
            width="60">
            <template slot-scope="scope">
              <div style="font-size: 25px" v-if="scope.row.state==0">
                <el-tooltip class="item" effect="dark" content="服务器正在准备派发" placement="top-start">
                  <i class="el-icon-upload"></i>
                </el-tooltip>
              </div>
              <div style="font-size: 25px" v-if="scope.row.state==1">
                <el-tooltip class="item" effect="dark" content="服务器正在派发" placement="top-start">
                  <i class="el-icon-position"></i>
                </el-tooltip>
              </div>
              <div style="font-size: 25px" v-if="scope.row.state==2">
                <el-tooltip class="item" effect="dark" content="服务器派发完毕" placement="top-start">
                  <i class="el-icon-circle-check"></i>
                </el-tooltip>
              </div>
              <div style="font-size: 25px" v-if="scope.row.state==3">
                <el-tooltip class="item" effect="dark" content="任务已结束" placement="top-start">
                  <i class="el-icon-s-claim"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字"/>
            </template>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="下载文件至本地" placement="top-start">
                <el-button
                  size="mini"
                  icon="el-icon-download"
                  type="primary"
                  @click="handleDownload(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-button
                size="mini"
                solt="reference"
                icon="el-icon-delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin: 5px auto;float: right">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="fresh2"/>
      </div>
    </div>
    <div v-if="addwork && editWork  && index==3">
      <div class="addbt">
        <el-button type="success" @click="openAdd" plain>添加任务</el-button>
        <el-button icon="el-icon-refresh" circle v-if="refresh" @click="fresh3"></el-button>
        <el-button icon="el-icon-loading" circle v-else></el-button>
      </div>

      <div>
        <el-table
          :data="
          list.filter(data => (!search || data.name.toLowerCase().includes(search.toLowerCase())||data.id==search.toLowerCase()))"
          style="width: 100%"
          v-loading="listLoading"
          :border="true"
          @row-dblclick="details"
        >
          <el-table-column
            prop="id"
            label="编号"
            width="69">
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="发布日期"
            sortable
            width="190">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createtime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="任务名称"
            width="150">
          </el-table-column>
          <el-table-column
            label="完成形式"
            width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.form==1">实时数据</span>
              <span v-else>历史数据采集</span>
            </template>
          </el-table-column>
          <el-table-column
            label="资格要求"
            width="100">
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
            label="任务人数剩余"
            width="80"
            prop="members">

          </el-table-column>
          <el-table-column
            prop="money"
            label="任务赏金"
            width="80">
          </el-table-column>
          <el-table-column
            prop="deadline"
            label="截止日期"
            sortable
            width="190"
          >
            <template slot-scope="scope">
              <!--<i class="el-icon-time"></i>-->
              <span style="margin-left: 10px">{{ scope.row.deadline }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="当前状态"
            width="60">
            <template slot-scope="scope">
              <div style="font-size: 25px" v-if="scope.row.state==0">
                <el-tooltip class="item" effect="dark" content="服务器正在准备派发" placement="top-start">
                  <i class="el-icon-upload"></i>
                </el-tooltip>
              </div>
              <div style="font-size: 25px" v-if="scope.row.state==1">
                <el-tooltip class="item" effect="dark" content="服务器正在派发" placement="top-start">
                  <i class="el-icon-position"></i>
                </el-tooltip>
              </div>
              <div style="font-size: 25px" v-if="scope.row.state==2">
                <el-tooltip class="item" effect="dark" content="服务器派发完毕" placement="top-start">
                  <i class="el-icon-circle-check"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字"/>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button
                size="mini"
                solt="reference"
                icon="el-icon-delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin: 5px auto;float: right">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="fresh"/>
      </div>
    </div>
    <div v-if="!addwork">
      <addWork v-on:closeAdd="closeAdd"></addWork>
    </div>
    <div v-if="!editWork">
      <editWork :mission="mission" v-on:closeEdit="closeEdit"></editWork>
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
            <span class="draw_span_left" v-if="workDetails.state==0"><b>任务状态： </b>等待服务器分发中</span>
            <span class="draw_span_left" v-if="workDetails.state==1"><b>任务状态： </b>服务器正在分发</span>
            <span class="draw_span_left" v-if="workDetails.state==2"><b>任务状态： </b>服务器派发完成，任务进行中</span>
            <span class="draw_span_left" v-if="workDetails.state==3"><b>任务状态： </b>任务已结束</span>
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
  import addWork from './addWork'
  import Pagination from '@/components/Pagination'
  import editWork from './editWork'
  import workmap from '../map'

  export default {
    components: {addWork, Pagination, editWork, workmap},
    name: "index",
    props: ['index'],
    created:function() {
      this.refreshed(this.$route.params.index)
    },
    data() {
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
        },
        mission: '1',
        addwork: true,
        refresh: true,
        editWork: true,
        uid: sessionStorage.getItem('crowd_user'),
        tableData: [],
        search: '',
        detail: false,
        missionDetails: [],
        workDetails: '',
        workerMap: true,
        donePercent: 0
      }
    },
    watch: {
      index: function (newvalue, oldvalue) {
        if (newvalue == 1) {
          this.fresh()
        }
        if (newvalue == 2) {
          this.fresh2()
        }
        if (newvalue == 3) {
          this.fresh3()
        }
      }
    },
    methods: {
      refreshed(value){
        if (value == 1) {
          this.fresh()
        }
        if (value == 2) {
          this.fresh2()
        }
        if (value == 3) {
          this.fresh3()
        }
      },
      fresh() {
        this.listLoading = true
        this.refresh = false;
        let vm = this;
        this.axios({
          method: "post",
          url: 'http://localhost:8090/getMission/all',
          data: {
            id: vm.uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit
          }
        })
          .then(function (resp) {
            vm.list = resp.data.list;
            vm.total = resp.data.total;
            // console.log(resp.data);
            // vm.$message.success('刷新成功');
            setTimeout(() => {
              vm.listLoading = false
            }, 0.5 * 1000)
            vm.refresh = true;
          })
          .catch(function () {
            vm.$message.error('刷新失败，请稍后再试');
            vm.refresh = true;
          })
      },
      fresh2() {
        this.listLoading = true
        this.refresh = false;
        let vm = this;
        this.axios({
          method: "post",
          url: 'http://localhost:8090/getMission/done',
          data: {
            id: vm.uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 3
          }
        })
          .then(function (resp) {
            vm.list = resp.data.list;
            vm.total = resp.data.total;
            // console.log(resp.data);
            // vm.$message.success('刷新成功');
            setTimeout(() => {
              vm.listLoading = false
            }, 0.5 * 1000)
            vm.refresh = true;
          })
          .catch(function () {
            vm.$message.error('刷新失败，请稍后再试');
            vm.refresh = true;
          })
      },
      fresh3() {
        this.listLoading = true
        this.refresh = false;
        let vm = this;
        this.axios({
          method: "post",
          url: 'http://localhost:8090/getMission/doing',
          data: {
            id: vm.uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.list = resp.data.list;
            vm.total = resp.data.total;
            // console.log(resp.data);
            // vm.$message.success('刷新成功');
            setTimeout(() => {
              vm.listLoading = false
            }, 0.5 * 1000)
            vm.refresh = true;
          })
          .catch(function () {
            vm.$message.error('刷新失败，请稍后再试');
            vm.refresh = true;
          })
      },
      openAdd() {
        this.addwork = false;
      },
      closeAdd() {
        this.addwork = true;
      },
      openEdit() {
        this.editWork = false;
      },
      closeEdit() {
        this.editWork = true;
        this.fresh();
      },
      handleEdit(index, row) {
        if (row.state != 0) {
          this.$message.warning('任务已经在进行中，无法进行更改');
          return
        }
        this.mission = row;
        // console.log(this.mission)
        this.openEdit();
      },
      handleDelete(index, row) {
        this.listLoading = true;
        if (row.state != 0) {
          this.$message.warning('任务已经在进行中，无法删除');
          this.listLoading = false;
          return;
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let vm = this;
          this.axios({
            method: 'get',
            url: "http://localhost:8090/deleteMission?id=" + row.id
          })
            .then(function (resp) {
              if (resp.data == 'success') {

                vm.$message.success('删除成功');
                vm.fresh();
              }
              else {
                vm.$message.warning('任务状态已变更，我i法进行操作');
                vm.fresh();
              }
            })
            .catch(function () {
              vm.$message.error('服务器连接失败');
              vm.listLoading = false;
            })
        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.listLoading = false
          })
        console.log(index, row);
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
            vm.donePercent = vm.donePercent * 100 / resp.data.length
          })
          .catch(function () {
            console.log('获取详细信息失败')
          })
      },
      getWorkerMap() {
        this.workerMap = !this.workerMap
        if (!this.workerMap) {
          this.$nextTick(() => {
            this.$refs.map_work.changeClass(2);
            this.$refs.map_work.addPoint(this.workDetails, this.missionDetails)
          })
        }
      }
    }
  }

</script>

<style scoped>
  .box {
    width: 1200px;
    height: 1300px;
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

  .mapbox {
    /*width: 700px;*/
    /*height: 350px;*/
    /*border: 1px solid #DCDFE6;*/
    /*margin: 10px auto;*/
    /*padding: 20px 50px 20px 80px;*/
    border-radius: 20px;
    /*box-shadow: 0px 0px 20px #DCDFE6;*/
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

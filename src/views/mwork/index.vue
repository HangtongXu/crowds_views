<template>
  <div class="box">
    <div>

      <div v-if="!mapOpen" class="addbt">
        <el-button icon="el-icon-refresh" circle v-if="isFresh" @click="refresh(index)"></el-button>
        <el-button icon="el-icon-loading" circle v-else></el-button>
      </div>
      <div class="addbt">
      <el-tooltip content="以列表显示附近任务的信息" placement="bottom" effect="light" v-if="mapOpen &&index==1">
        <el-button type="info" round @click="mapHandle">关闭地图</el-button>
      </el-tooltip>
      <el-tooltip content="在地图上直观显示附近任务的位置" placement="bottom" effect="light" v-if="!mapOpen &&index==1">
        <el-button type="info" round @click="mapHandle">地图显示</el-button>
      </el-tooltip>
    </div >
    </div>

    <div v-if="!changeDataSource&&!mapOpen">
      <el-table
        :data="
          tableData.filter(data => (!search || data.name.toLowerCase().includes(search.toLowerCase())||data.id==search.toLowerCase()))"
        style="width: 100%"
        v-loading="listLoading"
        :border="true"
        :key="reflush"
      >
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
          width="200">
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
          prop="money"
          label="任务赏金"
          width="100">
        </el-table-column>
        <el-table-column
          prop="deadline"
          label="截止日期"
          sortable
          width="200"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.deadline }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="当前状态"
          width="60">
          <template slot-scope="scope">
            <div style="font-size: 20px" v-if="scope.row.members>=1">
              <el-tooltip class="item" effect="dark" content="可接受" placement="top-start">
                <i class="el-icon-circle-check" style="color: 	#32CD32;padding-left: 10px;"></i>
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
              placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button plain icon="el-icon-success" @click="handleCatch(scope.$index, scope.row)" type="success" round>
              接受
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="changeDataSource&&!mapOpen">
      <el-table
        :data="
          detailsData.filter(data => (!search || data.mission.name.toLowerCase().includes(search.toLowerCase())||data.id==search.toLowerCase()))"
        style="width: 100%"
        v-loading="listLoading"
        :border="true"
      >
        <el-table-column
          prop="id"
          label="订单编号"
          width="150">
          <template slot-scope="scope">
            <i class="el-icon-star-on"></i>
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="订单创建日期"
          sortable
          width="200">
          <template slot-scope="scope">
            <i class="el-icon-date"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mission.name"
          label="任务名称"
          width="150">
          <template slot-scope="scope">
            <i class="el-icon-camera-solid"></i>
            <span style="margin-left: 10px">{{ scope.row.mission.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mission.money"
          label="任务赏金"
          width="100">
          <template slot-scope="scope">
            <i class="el-icon-coin"></i>
            <span style="margin-left: 10px">{{ scope.row.mission.money }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mission.deadline"
          label="截止日期"
          sortable
          width="200"
        >
          <template slot-scope="scope">
            <i class="el-icon-date"></i>
            <span style="margin-left: 10px">{{ scope.row.mission.deadline }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mission.address"
          label="任务地址"
          sortable
          width="200"
        >
          <template slot-scope="scope">
            <i class="el-icon-location"></i>
            <span style="margin-left: 10px">{{ scope.row.mission.address }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button plain icon="el-icon-success" @click="uploadFile(scope.$index, scope.row)" type="success" round
                       v-if="index==2 && scope.row.state==1">
              上传任务材料
            </el-button>
            <span v-if="index==3 &&scope.row.state==2">等待发布者确认任务完成</span>
            <el-button plain icon="el-icon-success" @click="ackMoney(scope.$index, scope.row)" type="success" round
                       v-if="index==3 && scope.row.state==3">
              确认金额
            </el-button>
            <span v-if="index==4 &&scope.row.state==5">流程结束</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="mapOpen">
      <Map ref="map" ></Map>
    </div>
    <div style="margin: 5px auto;float: right" v-if="!mapOpen">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="refresh(index)"/>
    </div>
    <div>
      <el-drawer
        title="上传文件"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        size="30%"
      >
        <div>
          <span style="padding: 10px 5px 0px 20px;float:left;">选择文件形式：</span>
          <div class="block" style="float: right; padding: 0px 10px 20px 20px ">
            <el-cascader
              v-model="fileForm"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"></el-cascader>
          </div>
        </div>
        <div>
          <div>
            <el-upload
              ref="upload"
              action="http://localhost:8090/uploadMissionFile"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :accept="fileForm[1]"
              :data="{mid,wid}"
              :on-success="handleAvatarSuccess"
              :on-error="handleError"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false">
              <div style="float: left; padding-left: 20px;padding-right: 10px">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </div>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip" style="float: bottom; padding: 10px 0px 0px 20px;">
                只能上传上述选择类型的文件，且不超过10M
              </div>
            </el-upload>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>

  import Pagination from '@/components/Pagination'
  import Map from '@/views/map'

  export default {
    name: "index",
    props: ['index'],
    components: {Pagination, Map},
    created() {
      this.refresh();
    },
    data() {
      return {
        tableData: [],
        detailsData: [],
        listLoading: false,
        search: '',
        isFresh: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 8,
        },
        key: 1,
        changeDataSource: false,
        drawer: false,
        fileForm: 0,
        direction: 'rtl',
        options: [
          {
            value: 'image',
            label: '图片',
            children: [
              {
                value: '.jpg',
                label: 'jpg',
              },
              {
                value: '.png',
                label: 'png',
              },
              {
                value: '.gif',
                label: 'gif'
              }
            ]
          },
          {
            value: 'txt',
            label: '文本文件',
            children: [
              {
                value: '.txt',
                label: 'txt',
              },
              {
                value: '.word',
                label: 'word'
              },
              {
                value: '.pdf',
                label: 'pdf'
              },
              {
                value: '.excel',
                label: 'excel'
              }
            ]
          }
        ],
        fileList: [],
        wid: 0,
        mid: 0,
        mapOpen: false,
        reflush:true
      }
    },
    watch: {
      index: function (newValue, oldValue) {
        if (newValue == 1) {
          this.changeDataSource = false;
        }
        else {
          this.changeDataSource = true;
        }
        this.refresh(newValue)
      },
      tableData:function (newvalue, oldvalue) {
        this.reflush=!this.reflush
      }
    },
    created() {
      this.refresh(this.$route.params.index)
    },
    methods: {
      refresh(value) {
        this.detailsData=[]
        this.tableData=[]
        let vm = this;
        switch (value) {
          case '1':
            console.log(1);
            vm.fresh_1();
            break;
          case '2':
            console.log(2);
            vm.fresh_2();
            break;
          case '3':
            console.log(3);
            vm.fresh_3();
            break;
          case '4':
            console.log(3);
            vm.fresh_4();
            break;
        }
      },
      fresh_1() {
        this.listLoading = true;
        let vm = this;
        let uid = this.$store.getters.getUser.uid
        this.axios({
          method: "post",
          url: 'http://localhost:8090/getAvliableWork',
          data: {
            id: uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.tableData=resp.data.list
            vm.total = resp.data.total
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
        this.listLoading = true;
        let vm = this;
        let uid = this.$store.getters.getUser.uid
        this.axios({
          method: "post",
          url: 'http://localhost:8090/getWaitDoneWork',
          data: {
            id: uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.detailsData = resp.data.list;
            console.log(vm.detailsData)
            vm.total = resp.data.total
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
        this.listLoading = true;
        let vm = this;
        let uid = this.$store.getters.getUser.uid
        this.axios({
          method: "post",
          url: 'http://localhost:8090/getUnPayWork',
          data: {
            id: uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.detailsData = resp.data.list;
            vm.total = resp.data.total
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
        this.listLoading = true;
        let vm = this;
        let uid = this.$store.getters.getUser.uid
        this.axios({
          method: "post",
          url: 'http://localhost:8090/getDoneWork',
          data: {
            id: uid,
            pageNum: vm.listQuery.page,
            pageSize: vm.listQuery.limit,
            state: 2
          }
        })
          .then(function (resp) {
            vm.detailsData = resp.data.list;
            vm.total = resp.data.total
            setTimeout(() => {
              vm.listLoading = false;
            }, 0.5 * 1000)
          })
          .catch(function () {
            vm.listLoading = false;
            vm.$message.error("服务器出错了");
          })
      },
      handleCatch(index, row) {
        this.listLoading = true;
        let vm = this;
        this.$confirm('确认接受  ' + row.name + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log(row)
            vm.axios({
              method: "post",
              url: "http://localhost:8090/catchMission",
              data: {
                wid: vm.$store.getters.getUser.uid,
                mid: row.id
              }
            })
              .then(function (resp) {
                if (resp.data == "success") {
                  vm.$message.success("任务已接收");
                }
                else {
                  if (resp.data == '1') {
                    vm.$message.error("任务状态已变更");
                  }
                  if (resp.data == '2') {
                    vm.$message.warning("已经到到您可以接取的任务上限")
                  }
                  if (resp.data == '3') {
                    vm.$message.info('任务接取失败，请稍后再试')
                  }
                }
                vm.listLoading = false;
                vm.refresh();
              })
              .catch(function (e) {
                console.log(e)
                vm.refresh();
                vm.$message.error("服务器出错啦");
              });
          })
          .catch(() => {
            this.listLoading = false;
            this.$message({
              type: 'info',
              message: '已取消'
            });
            vm.refresh();
          });
      },
      ackMoney(index, row) {
        console.log(row)
        let vm = this
        this.$confirm('确定订单金额无误?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: "get",
            url: 'http://localhost:8090/workerAck?wid='
              + row.wid + "&uid=" + vm.$store.getters.getUser.uid + "&money=" + row.mission.money + "&uuid=" + row.mission.uid + "&mid=" + row.mid,
          })
            .then(function (resp) {
              if (resp.data == 'error') {
                vm.$message.warning('交易失败，请稍后再试！')
              }
              if (resp.data == 'success') {
                vm.$message.success('交易成功，将于稍后到账')
                vm.refresh('3')
              }
            })
            .catch(function (e) {
              console.log(e)
              vm.$message.error('服务器出错了')
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      uploadFile(index, row) {
        console.log(row)
        this.wid = row.wid
        this.mid = row.mid
        this.drawer = true
      },
      handleClose() {
        this.drawer = false
      },
      handleChange(value) {
        console.log(this.fileForm[1])
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleError(file) {
        this.$message.error('上传失败');
        this.loading = false;
      },
      handleAvatarSuccess(res, file) {
        if (res.data == 'forbidden') {
          this.$message.warning('文件为空');
        }
        else if (res.data == 'error') {
          this.$message.error('文件上传失败');
        }
        this.loading = false;
      },
      beforeAvatarUpload(file) {
        this.loading = true;
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
          this.loading = false;
        }
        return isLt2M;
      },
      mapHandle() {
        this.mapOpen = !this.mapOpen;
        let vm=this;
        if (this.mapOpen) {
          this.$nextTick(() => {
            this.$refs.map.changeClass(3);
            this.$refs.map.addPointWorker(vm.tableData)
          })
        }
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

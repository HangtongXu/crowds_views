<template>
  <div>
    <div id="gdmap" :class="{'gdmap':isgdmap1,'gdmap2':isgdmap2,'gdmap3':isgdmap3}"></div>
    <div id="panel" style="display: none"></div>
    <map-utils ref="utils" v-on:correspond="correspond"></map-utils>
  </div>
</template>

<script>
  // import {lazyAMapApiLoaderInstance} from 'vue-amap'
  import mapUtils from '../mapUtils'

  export default {
    name: 'maps',
    props: ['address'],
    components: {mapUtils},
    data() {
      return {
        center: [],
        map: '',
        marker: null,
        placeSearch: '',
        isgdmap1: true,
        isgdmap2: false,
        isgdmap3: false,
        lng: 0,
        lat: 0,
        missions:[]
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
      correspond(flag, data) {
        // console.log(data)
        if (flag == 1) {
          this.autoInput(data)
        }
        if (flag == 2) {
          this.addPointWorkerFlow(data.data.rectangle)
        }
      },
      addPointWorkerFlow(datas) {
        let vm=this
        let array = datas.split(';')
        datas = array[0] + ',' + array[1];
        array = datas.split(',')
        this.lng = (parseFloat(array[0]) + parseFloat(array[2])) / 2
        this.lat = (parseFloat(array[1]) + parseFloat(array[3])) / 2
        let data=this.missions;
        var position = [this.lng,this.lat]
        var icon = new AMap.Icon({
          size: new AMap.Size(20, 20),    // 图标尺寸
          image: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',  // Icon的图像
          // imageOffset: new AMap.Pixel(0, -60),  // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(20, 20)   // 根据所设置的大小拉伸或压缩图片
        });
        var marker = new AMap.Marker({
          position: position,
          icon: icon, // 添加 Icon 图标 URL
          title: '本人位置'
        });
        vm.map.add(marker)
        vm.map.setCenter(position)
        var styleObject = {
          url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
          anchor: new AMap.Pixel(6, 6),
          size: new AMap.Size(11, 11)
        }

        function point(lnglat, name, id) {
          this.lnglat = lnglat
          this.name = name
          this.id = id
        }

        var points = new Array()
        for (var i = 0; i < data.length; i++) {
          points.push(new point([data[i].longtitude, data[i].latitude], data[i].name, i))
        }
        var massMarks = new AMap.MassMarks(points, {
          opacity: 0.8,
          zIndex: 111,
          cursor: 'pointer',
          style: styleObject
        });
        var marker = new AMap.Marker({content: ' ', map: vm.map});

        massMarks.on('mouseover', function (e) {

          marker.setPosition(e.data.lnglat);
          marker.setLabel({content: e.data.name})
        });
        // massMarks.setData(points)
        massMarks.setMap(vm.map)
        console.log('over')
      },
      autoInput(input) {
        let vm = this
        AMap.plugin('AMap.Autocomplete', function () {
          // 实例化Autocomplete
          var autoOptions = {
            //city 限定城市，默认全国
            city: '全国'
          }
          var autoComplete = new AMap.Autocomplete(autoOptions);
          autoComplete.search(input, function (status, result) {
            // 搜索成功时，result即是对应的匹配数据
            vm.$emit('correspond', 2, result.tips)
            console.log / (result.tips)
          })
        })
      },
      search(key) {
        let vm = this
        this.placeSearch = new AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: '010',
          map: this.map,
          panel: 'panel',
          autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          pageSize: 1, // 单页显示结果条数
          pageIndex: 1, // 页码
        })
        this.placeSearch.search(key)
        AMap.event.addListener(this.placeSearch, 'markerClick', function (e) {
          vm.$emit("correspond", 1, e.data)
        })
      },
      clickToAddress(e) {
        // alert('您在[ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ]的位置点击了地图！');
        if (this.marker != null) {
          this.map.remove(this.marker)
        }
        this.marker = new AMap.Marker({
          position: new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat()),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '北京',
        })
        this.map.add(this.marker)
        this.map.center = [e.lnglat.getLng(), e.lnglat.getLat()]
      },
      initMap() {
        this.$message.info('正在加载地图')
        let vm = this
        //map-test为div的id
        var map = new AMap.Map('gdmap', {
          resizeEnable: true,
          zoom: 15
        })
        this.map = map;

        //添加鼠标监听事件
        map.on('click', this.clickToAddress);
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar());
        //添加定位工具
        map.addControl(new AMap.Geolocation());
      },
      changeClass(value) {
        switch (value) {
          case 1:
            this.isgdmap1 = true;
            this.isgdmap2 = false;
            this.isgdmap3 = false;
            break;
          case 2:
            this.isgdmap1 = false;
            this.isgdmap2 = true;
            this.isgdmap3 = false;
            break;
          case 3:
            this.isgdmap1 = false;
            this.isgdmap2 = false;
            this.isgdmap3 = true;
            break;
        }
      },
      addPoint(work, data) {
        var position = [work.longtitude, work.latitude]
        var icon = new AMap.Icon({
          size: new AMap.Size(20, 20),    // 图标尺寸
          image: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',  // Icon的图像
          // imageOffset: new AMap.Pixel(0, -60),  // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(20, 20)   // 根据所设置的大小拉伸或压缩图片
        });
        var marker = new AMap.Marker({
          position: position,
          icon: icon, // 添加 Icon 图标 URL
          title: work.name
        });
        this.map.add(marker)
        this.map.setCenter(position)
        var styleObject = {
          url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
          anchor: new AMap.Pixel(6, 6),
          size: new AMap.Size(11, 11)
        }

        function point(lnglat, name, id) {
          this.lnglat = lnglat
          this.name = name
          this.id = id
        }

        var points = new Array()
        for (var i = 0; i < data.length; i++) {
          points.push(new point([data[i].worker.longtitude, data[i].worker.latitude], data[i].worker.name, i))
        }
        var massMarks = new AMap.MassMarks(points, {
          opacity: 0.8,
          zIndex: 111,
          cursor: 'pointer',
          style: styleObject
        });
        var marker = new AMap.Marker({content: ' ', map: this.map});

        massMarks.on('mouseover', function (e) {

          marker.setPosition(e.data.lnglat);
          marker.setLabel({content: e.data.name})
        });
        // massMarks.setData(points)
        massMarks.setMap(this.map)
      },
      addPointWorker(data) {
        let vm = this;
        this.missions=data;
        this.$refs.utils.getCurrentAddress()
      }
    }
  }
</script>

<style scoped>
  .gdmap {
    width: 350px;
    height: 400px;
    border: 1px solid #DCDFE6;
    margin: 10px auto;
    padding: 20px 50px 20px 80px;
    border-radius: 20px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }

  .gdmap2 {
    width: 700px;
    height: 300px;
    border: 1px solid #DCDFE6;
    margin: 10px auto;
    padding: 20px 50px 20px 80px;
    border-radius: 20px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }

  .gdmap3 {
    width: 800px;
    height: 470px;
    border: 1px solid #DCDFE6;
    margin: 10px auto;
    padding: 20px 50px 20px 80px;
    border-radius: 40px;
    box-shadow: 0px 0px 20px #DCDFE6;
  }
</style>

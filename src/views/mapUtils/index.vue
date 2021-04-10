<template>

</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        cityname:''
      }
    },
    methods: {
      getIPaddress() {
        let vm = this;
        this.axios({
          method: "GET",
          url: 'https://restapi.amap.com/v3/ip?output=JSON&key=651707a61be1b345b561cd94c3f01b6c'
        })
          .then(function (resp) {
            vm.$emit('correspond',3,resp.data.city)
          })
          .catch(function () {
            console.log('出错了,无法根据ip定位')
          })
      },
      getCurrentAddress() {
        let vm = this;
        this.axios({
          method: "GET",
          url: 'https://restapi.amap.com/v3/ip?output=JSON&key=651707a61be1b345b561cd94c3f01b6c'
        })
          .then(function (resp) {
            vm.$emit('correspond',2,resp)
          })
          .catch(function (e) {
            console.log(e)
            console.log('出错了,无法根据ip定位')
          })
      }
    }
  }
</script>

<style scoped>

</style>

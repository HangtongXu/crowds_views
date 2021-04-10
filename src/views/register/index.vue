<template>
    <div>
      <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "register",
      data() {
        return {
          active: 0
        };
      },
      mounted(){
          this.$router.push('/re_one')
      }
    }
</script>

<style scoped>

</style>

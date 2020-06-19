<template>
  <div class="left-box">
    <div class="logo">
      <img :src="loading2"/>
    </div>
    <el-menu class="sidebar" :unique-opened="true" :default-active="currentPagePath" @open="handleOpen"
             :router="true" @close="handleClose">
      <el-menu-item index="/dashboard/welcome">
        <i class="fa fa-tachometer"></i>
        <span>房价概览</span>
      </el-menu-item>

      <el-submenu index="house">
        <template slot="title">
          <i class="fa fa-large fa-wrench"></i>
          <span>小链家</span>
        </template>
        <el-menu-item index="/dashboard/init">
          <i class="fa fa-circle"></i>
          <span>初始化列表</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/priceChange">
          <i class="fa fa-circle"></i>
          <span>价格曲线</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/community">
          <i class="fa fa-circle"></i>
          <span>小区列表</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item @click="logout">
        <i class="fa fa-large fa-sign-out"></i>
        <span>退出</span>
      </el-menu-item>
    </el-menu>

  </div>
</template>

<script>

  import loading2 from '../../../static/images/loading2.gif'

  export default {
    data() {
      return {
        loading2: loading2,
        currentPagePath: '/dashboard',
        loginInfo: null,
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      logout() {
        this.$confirm('是否要退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sessionStorage.clear()
          localStorage.clear();
          this.$router.replace({name: 'login'});
        });
      }
    },
    mounted() {
      console.log(this.$route.path);
      if (!this.loginInfo) {
        this.loginInfo = JSON.parse(window.localStorage.getItem('userInfo') || null);
      }
    }
  }

</script>
<style>
  .left-box {
    width: 200px;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    height: 100%;
    float: left;
    flex-direction: column;
    background: #fff;
  }

  .left-box .sidebar {
    width: 200px;
    flex: 1;
    border-radius: 0;
    /*background: #233445;*/
  }

  .left-box .fa {
    margin-right: 10px;
    font-size: 18px;
    /*color: #ccc;*/
  }

  .left-box span {
    /*color: #ccc;*/
  }

  .left-box .el-submenu .el-menu-item .fa {
    margin-right: 10px;
    font-size: 10px;
  }

  /*渐变背景*/
  .back {
    background: -webkit-linear-gradient(138deg, #8731e8 0%, #4528dc 100%);
    background: -o-linear-gradient(138deg, #8731e8 0%, #4528dc 100%);
    background: linear-gradient(-48deg, #8731e8 0%, #4528dc 100%);
    opacity: .7;
  }

  .left-box .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    width: 200px;
    border-right: solid 1px #e6e6e6;
    /*box-shadow: 0 1px 1px rgba(0, 0, 0, .5);*/
  }

  .left-box .logo img {
    height: 80px;
  }
</style>

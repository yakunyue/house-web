<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>增加区县</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <!--<router-link to="/dashboard/user/add">-->
        <!--<el-button type="primary" icon="plus">添加会员</el-button>-->
        <!--</router-link>-->
        <div style="margin-left:10px;"></div>
        <!--<el-button type="primary" icon="plus" @click="fakeShow" v-if="fake == 0">假的会员</el-button>-->
        <!--<el-button type="primary" icon="plus" @click="realShow" v-if="fake == 1">真的会员</el-button>-->
      </div>
    </div>
    <div class="content-main">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-cascader :props="props" placeholder="请选择要初始化的区县" :clearable="true" @change="handleChange"></el-cascader>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">增加区县</el-button>
        </el-col>
      </el-row>

    </div>


  </div>
</template>

<script>

  import {jsonPost, getRequest} from '../../utils/api';

  export default {
    data() {
      return {
        props: {
          lazy: true,
          lazyLoad(node, resolve) {
            console.log(node)
            const {level, value} = node;
            let nodes = [];
            if (level === 0) {
              getRequest("county/queryProvinceList", {}).then(res => {
                if (res.code == 200) {
                  nodes = res.data.map(item => ({
                    value: item.id,
                    label: item.name,
                    // leaf: true
                  }));
                }
                resolve(nodes);
              })
            } else if(level===1) {
              getRequest("/house/county/queryCityList", {provinceId: value}).then(res => {
                if (res.code == 200) {
                  nodes = res.data.map(item => ({
                    value: item.id,
                    label: item.name,
                    // leaf: true
                  }));
                }
                resolve(nodes);
              })
            }else if(level===2){
              getRequest("/house/county/queryCountyList", {cityId: value}).then(res => {
                if (res.code == 200) {
                  nodes = res.data.map(item => ({
                    value: item.id,
                    label: item.name,
                    leaf: true
                  }));
                }
                resolve(nodes);
              })
            }
          }
        },
        countyId:0
      }
    },
    methods: {
      handleAdd() {
        jsonPost('/house/auth/admin/addInitRecord',
          {
            countyId: this.countyId
          }
        ).then((res) => {
          if (res.code === 200) {
            this.$message({type: 'success', message: '添加区县成功！！！'});
            this.$router.go(-1);
          } else {
            this.$message({type: 'error', message: '添加区县失败！！！'});
          }
        })
      },
      handleChange(value){
        console.log('++++++=')
        console.log(value)
        this.countyId = value[2]
      }
    },
    components: {},
    mounted() {
      // this.getList();
    }
  }

</script>

<style scoped>

</style>

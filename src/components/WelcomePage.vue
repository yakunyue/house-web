<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>当前位置：{{city.label}}
          <span v-if="county.label"> / {{county.label}}</span>
          <span v-if="street.label"> / {{street.label}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-main clearfix">

      <div class="header">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-select v-model="city" placeholder="请选择城市" @change="onCityChange">
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="county" placeholder="请选择区县" @change="onCountyChange">
              <el-option
                v-for="item in countyList"
                :key="item.value"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="street" placeholder="请选择街区" @change="onStreetChange">
              <el-option
                v-for="item in streetList"
                :key="item.value"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>

      <div class="header clearfix">
        <el-card class="box-card card-red">
          <router-link class="link-color" :to="{ path: '/dashboard/order' }">
            <h1>{{infoData.orderToDelivery}}</h1>
            <div class="text item">在售房源</div>
          </router-link>
        </el-card>
        <el-card class="box-card card-green">
          <router-link class="link-color" :to="{ path: '/dashboard/goods' }">
            <h1>{{infoData.goodsOnsale}}</h1>
            <div class="text item">挂牌均价</div>
          </router-link>
        </el-card>
        <el-card class="box-card card-black">
          <router-link class="link-color" :to="{ path: '/dashboard/user' }">
            <h1>{{infoData.user}}</h1>
            <div class="text item">成交记录</div>
          </router-link>
        </el-card>
      </div>
      <div class="main">
        <el-tabs class="o-tab" v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="全部" name="first"></el-tab-pane>
          <el-tab-pane label="最近三年" name="second"></el-tab-pane>
          <el-tab-pane label="最近两年" name="third"></el-tab-pane>
          <el-tab-pane label="最近一年" name="fourth"></el-tab-pane>
        </el-tabs>
        <div class="tab-content clearfix">
          <ve-line :data="chartData" :settings="chartSettings" :extend="extend"></ve-line>
        </div>
        <div class="line clearfix"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getRequest} from "../utils/api";

  export default {
    data() {
      this.chartSettings = {
        axisSite: {right: ['dealNum']},
        xAxisType: 'time',
        yAxisType: ['KMB', 'normal'],
        yAxisName: ['元/平米', '成交套数'],
        labelMap: {
          'listPriceAvg': '挂牌均价',
          'dealPriceAvg': '成交均价',
          'dealNum': '成交数'
        }
      }
      return {
        chartData: {
          columns: ["yearMonth", "listPriceAvg", "dealPriceAvg", "dealNum"],
          rows: []
        },
        cityList: [],
        countyList: [],
        streetList: [],
        city: {label: '北京'},
        county: {},
        street: {},
        infoData: {},
        fromDate: '2008-01-01'
      }
    },
    methods: {
      getCityList() {
        getRequest("/county/queryInitCityList", {}).then(res => {
          if (res.code == 200) {
            this.cityList = res.data.map(item => ({
              value: item.code,
              label: item.name,
            }));
          } else {
            this.$message({type: 'error', message: '获取城市列表失败!'});
          }
        })
      },
      getCountyList(value) {
        if (value) {
          getRequest("county/queryInitCountyList", {cityCode: value}).then(res => {
            if (res.code == 200) {
              this.countyList = res.data.map(item => ({
                value: item.code,
                label: item.name,
              }));
            } else {
              this.$message({type: 'error', message: '获取区县列表失败!'});
            }
          })
        } else {
          this.$message({type: 'error', message: '请先选择城市!'});
        }
      },
      getStreetList(value) {
        if (value) {
          getRequest("county/queryInitStreetList", {countyCode: value}).then(res => {
            if (res.code == 200) {
              this.streetList = res.data.map(item => ({
                value: item.code,
                label: item.name,
              }));
            } else {
              this.$message({type: 'error', message: '获取街区列表失败!'});
            }
          })
        } else {
          this.$message({type: 'error', message: '请先选择区县!'});
        }
      },
      onCityChange(city) {
        this.getCountyList(city.value)
        this.county = {}
        this.street = {}
        this.getChartData()
      },
      onCountyChange(county) {
        this.getStreetList(county.value)
        this.street = {}
        this.getChartData()
      },
      onStreetChange(street) {
        this.getChartData()
      },
      handleClick(tab) {
        console.log(tab);
        if (tab.name === 'first') {
          this.fromDate = '2008-01-01'
        }
        if (tab.name === 'second') {
          this.fromDate = new Date().getFullYear() - 3 + '-01-01'
        }
        if (tab.name === 'third') {
          this.fromDate = new Date().getFullYear() - 2 + '-01-01'
        }
        if (tab.name === 'fourth') {
          this.fromDate = new Date().getFullYear() - 1 + '-01-01'
        }
        this.getChartData()
      },
      getChartData() {
        getRequest('/chart/priceChange',
          {
            cityCode: this.city.value,
            countyCode: this.county.value,
            streetCode: this.street.value,
            fromDate: this.fromDate
          }
        ).then((res) => {
          if (res.code === 200) {
            this.chartData.rows = res.data;
          } else {
            this.$message({type: 'error', message: '查询价格数据失败！！！'});
          }
        })
      }
    },
    components: {},
    mounted() {
      this.getCityList()
      this.getChartData()
    }
  }
</script>

<style scoped>
  .notice {
    width: 100%;
    height: 60px;
    padding: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: #ffecd5;
    margin-bottom: 20px;
    font-size: 16px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .github {
    width: 100%;
    height: 60px;
    padding: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: #f8f8f8;
    margin-bottom: 20px;
    font-size: 16px;
    border-radius: 6px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .notice .r {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .github a {
    margin-right: 20px;
  }

  .count {
    background: #fff;
    padding: 10px;
  }

  .float-right {
    float: right;
  }

  .tips {
    color: #8c939d;
    font-size: 13px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 10px 0;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .tab-content {
    margin-bottom: 20px;
  }

  .box-card {
    width: 32%;
    float: left;
    margin: 0 20px 14px 0;
  }

  .box-card:last-child {
    margin-right: 0px;
  }


  .box-card .link-color {
    color: #fff;
  }

  .box-card:last-child {
    margin-right: 0;
  }

  .box-card2 {
    width: 32%;
    float: left;
    margin-right: 17px;
  }

  .box-card2:last-child {
    margin-right: 0;
  }

  .header {
    margin-bottom: 20px;
  }

  .line {
    margin: 20px 0;
    border-top: 1px solid #d1dbe5;
  }

  .card-red {
    background: #e64242;
    border: none;
    color: #fff;
  }

  .card-blue {
    background: #4db3ff;
    border: none;
    color: #fff;
  }

  .card-green {
    background: #11b95c;
    border: none;
    color: #fff;
  }

  .card-black {
    background: #1f2d3d;
    border: none;
    color: #fff;
  }

  .card-gray {
    background: #d1dbe5;
    border: none;

  }

  .card-gray a {
    color: #1f2d3d;
  }

  .card-yellow {
    background: #f8dd66;
    border: none;
    color: #111111;
  }

  .card-yellow .link-color {
    color: #111111;
  }


</style>

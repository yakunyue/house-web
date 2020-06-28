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
    <div class="content-main">

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

      <div>
        <ve-heatmap :data="chartData" :settings="chartSettings"></ve-heatmap>
      </div>

    </div>
  </div>
</template>

<script>
  import {getRequest} from "../utils/api";

  export default {
    data() {
      this.chartSettings = {
        key: 'oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK',
        bmap: {
          center: [120.14322240845, 30.236064370321],
          zoom: 14,
          roam: true
        },
        type: 'bmap'
      }
      return {
        chartData: {
          columns: ['lat', 'lng'],
          rows: [
            { 'lat': 120.14322240845, 'lng': 30.236064370321 },
            { 'lat': 120.14301682797, 'lng': 30.236035316745 },
            { 'lat': 120.14138577045, 'lng': 30.236113748704 },
            { 'lat': 120.1400398833, 'lng': 30.235973050702 },
            { 'lat': 120.13893453465, 'lng': 30.23517220446 },
            { 'lat': 120.1382899739, 'lng': 30.234062922977 },
            { 'lat': 120.13265960629, 'lng': 30.231641351722 },
            { 'lat': 120.13170681763, 'lng': 30.229925745619 },
            { 'lat': 120.13119614803, 'lng': 30.228996846637 },
            { 'lat': 120.13023980134, 'lng': 30.228226570416 }
          ]
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
            const nowDate = new Date()
            const dealYear = nowDate.getFullYear()
            const dealMonth = nowDate.getMonth()
            const one = res.data.filter(d => d.dealYear === dealYear && d.dealMonth === dealMonth)
            console.log(one)

            this.infoData = one.length>0?one[0]:{}
          } else {
            this.$message({type: 'error', message: '查询价格数据失败！！！'});
          }
        })
      }
    },
    components: {},
    mounted() {
      this.getCityList();
    }
  }
</script>

<style scoped>


  .notice .r {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .github a {
    margin-right: 20px;
  }



  .header {
    margin-bottom: 20px;
  }

</style>

<template>
  <div class="content-page">
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
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onDateChange"
            >
            </el-date-picker>
          </el-col>
        </el-row>
      </div>

      <div>
        <ve-heatmap :data="chartData" :settings="chartSettings" height="85vh"></ve-heatmap>
      </div>

    </div>
  </div>
</template>

<script>
  import {getRequest} from "../utils/api";

  export default {
    data() {
      return {
        chartSettings: {
          key: 'oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK',
          bmap: {
            center: [113.665412, 34.757975],
            zoom: 12,
            roam: true
          },
          type: 'bmap',
        },
        chartData: {
          columns: ['lat', 'lng'],
          rows: []
        },
        cityList: [],
        city: {label: '郑州', value: 'zz'},
        fromDate: new Date(),
        toDate: new Date(),
        dateRange: ['', '']
      }
    },
    methods: {
      getCityList() {
        getRequest("/house/county/queryInitCityList", {}).then(res => {
          if (res.code === 200) {
            this.cityList = res.data.map(item => ({
              value: item.code,
              label: item.name,
              position: [item.longitude,item.latitude]
            }));
          } else {
            this.$message({type: 'error', message: '获取城市列表失败!'});
          }
        })
      },
      onCityChange(city) {
        this.chartSettings.bmap.center = this.city.position
        this.getDealPosition()
      },
      onDateChange() {
        this.fromDate = this.dateRange[0]
        this.toDate = this.dateRange[1]
        this.getDealPosition()
      },
      getDealPosition() {
        getRequest('/house/chart/dealPosition',
          {
            cityCode: this.city.value,
            fromDate: this.fromDate,
            toDate: this.toDate
          }
        ).then((res) => {
          if (res.code === 200) {
            this.chartData.rows = res.data.map(item => ({
                lng: item.latitude,
                lat: item.longitude,
              })
            );
          } else {
            this.$message({type: 'error', message: '查询价格数据失败！！！'});
          }
        })
      }
    },
    components: {},
    mounted() {
      this.getCityList();
      this.toDate = new Date().toLocaleDateString()
      const time = new Date(new Date().getTime() - 3600 * 1000 * 24 * 60)
      this.fromDate = time.toLocaleDateString()
      this.dateRange = [this.fromDate, this.toDate]
      this.getDealPosition()
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

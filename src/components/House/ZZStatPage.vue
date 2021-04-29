<template>
  <div class="content-page">

    <div class="content-main">
      <div class="title">
        <span>均价和成交数曲线</span>
      </div>
      <div class="filter-box">
        <el-select v-model="countyName" placeholder="请选择区县" @change="handleChange">
          <el-option
            v-for="item in countyList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="form-table-box">
        <ve-line :data="chartData" :settings="chartSettings" :extend="extend"></ve-line>
      </div>
    </div>

    <div class="content-main" style="margin-top: 20px">
      <div class="title">
        <span>各区域对比</span>
      </div>
      <div class="filter-box">
        <el-select v-model="dataType" placeholder="请选择对比维度" @change="handleChange2">
          <el-option
            v-for="item in dataTypeList"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>

        <el-select v-model="countys" placeholder="请选择对比区域" multiple collapse-tags @change="handleChange3">
          <el-option
            v-for="item in countyList"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="form-table-box">
        <ve-line :data="chartData2" :settings="secondChartSettings"></ve-line>
      </div>
    </div>
  </div>
</template>

<script>

  import {jsonPost, getRequest} from '../../utils/api';

  export default {
    data() {

      this.extend = {
        // x轴倾斜45度
        // 'xAxis.0.axisLabel.rotate': 45,
        // 显示具体数值
        series: {
          label: {
            normal: {
              show: true
            }
          }
        }
      }
      this.chartSettings = {
        axisSite: {right: ['dealCount', 'secondCount']},
        xAxisType: 'time',
        yAxisType: ['KMB', 'normal'],
        yAxisName: ['元/平米', '套'],
        labelMap: {
          'dealAvgPrice': '新房均价',
          'secondAvgPrice': '二手均价',
          'dealCount': '新房成交数',
          'secondCount': '二手成交数'
        }
      }
      this.secondChartSettings = {
        xAxisType: 'time',
        yAxisType: ['KMB'],
        yAxisName: ['元/平米 or 套'],
        scale:[true],
        labelMap: {
          'eq': '二七区',
          'gc': '管城回族区',
          'hj': '惠济区',
          'js': '金水区',
          'zy': '中原区',
          'zd': '郑东新区',
          'gx': '高新区',
          'jk': '经开区',
        }
      }
      return {
        chartData: {
          columns: ["yearMonth", "dealCount", "dealAvgPrice", "secondCount", "secondAvgPrice"],
          rows: []
        },
        chartData2: {
          columns: ["yearMonth",  "zd", "gx"],
          rows: []
        },
        countyCode: 'zd',
        countyName: '郑东新区',
        countyList: [
          {value: 'eq', label: '二七区'},
          {value: 'gc', label: '管城回族区'},
          {value: 'hj', label: '惠济区'},
          {value: 'js', label: '金水区'},
          {value: 'zy', label: '中原区'},
          {value: 'zd', label: '郑东新区'},
          {value: 'gx', label: '高新区'},
          {value: 'jk', label: '经开区'}
        ],
        dataType:{value:'DEAL_AVG_PRICE',label:'新房成交均价'},
        dataTypeList:[
          {value: 'DEAL_COUNT', label: '新房成交数'},
          {value: 'DEAL_AVG_PRICE', label: '新房成交均价'},
          {value: 'SECOND_COUNT', label: '二手房成交数'},
          {value: 'SECOND_AVG_PRICE', label: '二手房成交均价'},
        ],
        countys: [
          {value: 'zd', label: '郑东新区'},
          {value: 'gx', label: '高新区'},
        ]
      }
    },
    methods: {
      handleChange(value) {
        this.countyCode = value
        this.getList()
      },
      handleChange2(value) {
        this.dataType = value
        this.getList2()
      },
      handleChange3(value) {
        let arr = ["yearMonth"];
        value.forEach(item=>{
          arr.push(item.value)
        })

        this.chartData2.columns = arr
      },
      getList() {
        getRequest('/chart/zzHouseDealStat', {countyCode: this.countyCode}).then((res) => {
          if (res.code === 200) {
            this.chartData.rows = res.data;
          } else {
            this.$message({type: 'error', message: '查询数据失败！！！'});
          }
        })
      },
      getList2() {
        getRequest('/chart/zzCountyStat', {code: this.dataType.value}).then((res) => {
          if (res.code === 200) {
            this.chartData2.rows = res.data;
          } else {
            this.$message({type: 'error', message: '查询数据失败！！！'});
          }
        })
      }
    },
    components: {},
    mounted() {
      this.getList();
      this.getList2();
    }
  }

</script>

<style scoped>
  .title {
    display: flex;
    justify-content: center;
  }
</style>

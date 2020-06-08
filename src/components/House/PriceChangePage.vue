<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>成交价格曲线</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <div style="margin-left:10px;"></div>
      </div>
    </div>
    <div class="content-main">
      <div class="filter-box">
        <el-cascader :props="props" placeholder="请选择区县" :clearable="true" @change="handleChange" @expand-change="handleExpandChange"></el-cascader>
      </div>
      <div class="form-table-box">
        <ve-line :data="chartData" :settings="chartSettings" :extend="extend"></ve-line>
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
        // series: {
        //   label: {
        //     normal: {
        //       show: true
        //     }
        //   }
        // }
      }
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
        countyId: 0,
        props: {
          lazy: true,
          lazyLoad(node, resolve) {
            const {level, value} = node;
            let nodes = [];
            if (level === 0) {
              getRequest("/county/queryInitCityList", {}).then(res => {
                if (res.code == 200) {
                  nodes = res.data.map(item => ({
                    value: item.code,
                    label: item.name,
                    // leaf: true
                  }));
                }
                resolve(nodes);
              })
            } else if (level === 1) {
              getRequest("county/queryInitCountyList", {cityCode: value}).then(res => {
                if (res.code == 200) {
                  nodes = res.data.map(item => ({
                    value: item.code,
                    label: item.name,
                    // leaf: true
                  }));
                }
                resolve(nodes);
              })
            } else if (level === 2) {
              getRequest("county/queryInitStreetList", {countyCode: value}).then(res => {
                if (res.code == 200) {
                  nodes = res.data.map(item => ({
                    value: item.code,
                    label: item.name,
                    leaf: true
                  }));
                }
                resolve(nodes);
              })
            }
          }
        },
        chartData: {
          columns: ["yearMonth", "listPriceAvg", "dealPriceAvg", "dealNum"],
          rows: []
        },
        countyCode: 'guan',
        streetCode: '',
        communityCode: ''
      }
    },
    methods: {
      handleChange(value) {
        console.log('+++++')
        console.log(value)
        this.streetCode = value[2]
        this.getList()
      },
      handleExpandChange(arr) {
        console.log('-----')
        console.log(arr)
        if (arr.length === 2) {
          this.countyCode = arr[1]
          this.getList()
        }
      },
      getList() {
        getRequest('/chart/priceChange',
          {
            countyCode: this.countyCode,
            streetCode: this.streetCode,
            communityCode: this.communityCode
          }
        ).then((res) => {
          if (res.code === 200) {
            this.chartData.rows = res.data;
          } else {
            this.$message({type: 'error', message: '查询价格数据失败！！！'});
          }
        })
      },
      getInitRecord() {
        getRequest('/county/queryInitCityList',
          {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            nickname: this.filterForm.nickname
          }
        ).then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          } else {
            this.$message({type: 'error', message: '获取城市列表失败!'});
          }
        })
      }
    },
    components: {},
    mounted() {
      this.getList();
    }
  }

</script>

<style scoped>

</style>

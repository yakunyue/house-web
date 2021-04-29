<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>小区列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <div style="margin-left:10px;"></div>
      </div>
    </div>
    <div class="content-main">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="filter-box">
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

              <el-col :span="4">
                <el-select v-model="community" filterable remote placeholder="请选择小区"
                           @change="onCommunityChange" :remote-method="getCommunityList">
                  <el-option
                    v-for="item in communityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>

            </el-row>
          </div>
        </el-col>
      </el-row>

      <div class="form-table-box">
        <el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="street.provinceName" label="省/直辖市"></el-table-column>
          <el-table-column prop="street.cityName" label="城市"></el-table-column>
          <el-table-column prop="street.countyName" label="区县"></el-table-column>
          <el-table-column prop="street.name" label="街区"></el-table-column>
          <el-table-column prop="name" label="小区名称"></el-table-column>
          <el-table-column prop="referencePrice" label="参考价"></el-table-column>
          <el-table-column prop="onSaleNum" label="在售数"></el-table-column>
          <el-table-column prop="onRentNum" label="在租数"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button size="small" type="primary"
                         @click="handleWatch(scope.$index, scope.row)">关注
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination background @current-change="handlePageChange"
                       :current-page.sync="pageIndex"
                       :page-size.sync="pageSize"
                       :page-sizes="pageSizes"
                       @size-change="sizeChange"
                       layout="total,sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

  import {jsonPost, getRequest} from '../../utils/api';

  export default {
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50, 100],
        total: 0,
        cityList: [],
        countyList: [],
        streetList: [],
        communityList: [],
        city: {},
        county: {},
        street: {},
        tableData: [],
        community: {},
        username: ''
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
          getRequest("/county/queryInitCountyList", {cityCode: value}).then(res => {
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
          getRequest("/county/queryInitStreetList", {countyCode: value}).then(res => {
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
      getCommunityList(keyword) {
        this.loading = true
        getRequest("/community/fuzzy/list", {
          cityCode: this.city.value,
          countyCode: this.county.value,
          streetCode: this.street.value,
          communityName: keyword
        }).then(res => {
          if (res.code == 200) {
            this.communityList = res.data.map(item => ({
              value: item.lianjiaId,
              label: item.name,
            }));
          } else {
            this.$message({type: 'error', message: '获取小区列表失败!'});
          }
        })
        this.loading = false
      },
      onCityChange(city) {
        this.getCountyList(city.value)
        this.county = {}
        this.street = {}
        this.community = {}
        this.communityList = []
        this.getList()
      },
      onCountyChange(county) {
        this.getStreetList(county.value)
        this.street = {}
        this.community = {}
        this.communityList = []
        this.getList()
      },
      onStreetChange(street) {
        this.community = {}
        this.communityList = []
        this.getList()
      },
      onCommunityChange(community) {
        this.getList()
      },
      handlePageChange(val) {
        this.pageIndex = val;
        //保存到localStorage
        localStorage.setItem('userPageIndex', this.pageIndex)
        this.getList()
      },
      sizeChange(val) {
        this.pageSize = val
        //保存到localStorage
        localStorage.setItem('userPageSize', this.pageSize)
        this.getList()
      },

      handleWatch(index, row) {
        this.$confirm('确定要关注该小区吗 ? ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          jsonPost('/auth/user/watchCommunity', {
            userId: 2,//todo 暂时写死
            lianjiaCommunityId: row.lianjiaId,
            cityCode: row.cityCode,
            countyCode: row.countyCode,
            streetCode: row.streetCode
          }).then((res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '关注成功!'});
              this.getList();
            } else {
              this.$message({type: 'error', message: '关注失败!'});
            }
          })
        });
      },
      onSubmitFilter() {
        this.getList()
      },
      getList() {
        getRequest('/community/fuzzy/page',
          {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            cityCode: this.city.value,
            countyCode: this.county.value,
            communityName: this.community.label,
            streetCode: this.street.value
          }
        ).then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          } else {
            this.$message({type: 'error', message: '获取小区列表失败!'});
          }
        })
      }
    },
    components: {},
    mounted() {
      this.getCityList();
      this.getList();
    }
  }

</script>

<style scoped>

</style>

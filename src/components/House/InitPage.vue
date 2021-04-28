<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>初始化列表</el-breadcrumb-item>
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
          <div class="filter-box">
            <el-select v-model="city" placeholder="请选择城市" clearable @change="onSubmitFilter">
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">增加区县</el-button>
        </el-col>
      </el-row>

      <div class="form-table-box">
        <el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="provinceName" label="省/直辖市"></el-table-column>
          <el-table-column prop="cityName" label="城市"></el-table-column>
          <el-table-column prop="countyName" label="区县"></el-table-column>
          <el-table-column prop="communityNum" label="小区数量"></el-table-column>
          <el-table-column prop="communityLastUpdateTime" label="小区最后更新时间"></el-table-column>
          <el-table-column prop="dealNum" label="成交数量"></el-table-column>
          <el-table-column prop="dealHistoryLastUpdateTime" label="成交最后更新时间"></el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <div v-if="!scope.row.isPressing">
                <el-button plain size="small" type="danger"
                           @click="handleUpdateCommunity(scope.$index, scope.row)">刷新小区
                </el-button>
                <el-button plain size="small" type="danger"
                           @click="handleUpdateDeal(scope.$index, scope.row)">刷新成交
                </el-button>
              </div>
              <div v-else-if="scope.row.isPressing">
                <el-button disabled size="small" type="primary" :loading="true">处理中</el-button>
              </div>
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
        tableData: [],
        username: '',
        city:'',
        cityList: []
      }
    },
    methods: {
      getCityList() {
        getRequest("/house/county/queryInitCityList", {}).then(res => {
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
      handleAdd() {
        this.$router.push({name: 'init_add', query: {}})
      },
      handlePageChange(val) {
        this.pageIndex = val;
        //保存到localStorage
        // localStorage.setItem('userPageIndex', this.pageIndex)
        this.getList()
      },
      sizeChange(val) {
        this.pageSize = val
        //保存到localStorage
        // localStorage.setItem('userPageSize', this.pageSize)
        this.getList()
      },
      handleRowDetail(index, row) {
        this.$router.push({name: 'user_add', query: {id: row.id}})
      },
      handleUpdateCommunity(index, row) {
        this.$confirm('确定要刷新该区县小区数据吗 ? 此为耗时操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          jsonPost('/house/auth/admin/updateCommunity' ,{},{"id":row.id}).then((res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '初始化进程已启动!'});
              this.getList();
            } else {
              this.$message({type: 'error', message: '初始化进程启动失败!'});
            }
          })
        });
      },
      handleUpdateDeal(index, row) {
        this.$confirm('确定要刷新该区县成交记录吗 ? 此为耗时操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          jsonPost('/house/auth/admin/updateDealHistory' ,{},{"id":row.id}).then((res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '处理进程已启动!'});
              this.getList();
            } else {
              this.$message({type: 'error', message: '初始化进程启动失败!!'});
            }
          })
        });
      },
      onSubmitFilter() {
        this.getList()
      },
      getList() {
        getRequest('/house/auth/user/queryInitPage',
          {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            cityName: this.city.label
          }
        ).then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          } else {
            this.$message({type: 'error', message: '获取已初始化区县列表失败!'});
          }
        })
      }
    },
    components: {},
    mounted() {
      // let userPageIndex = localStorage.getItem('userPageIndex');
      // let userPageSize = localStorage.getItem('userPageSize');
      // if (userPageIndex == null) {
      //   userPageIndex = 1;
      // }
      // if (userPageSize == null) {
      //   userPageSize = 10;
      // }
      // this.pageIndex = Number(userPageIndex);
      // this.pageSize = Number(userPageSize);
      this.getList();
      this.getCityList();
    }
  }

</script>

<style scoped>

</style>

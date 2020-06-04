<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
      <div class="filter-box">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item label="用户昵称">
            <el-input v-model="filterForm.nickname" placeholder="用户昵称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-table-box">
        <el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column prop="id" label="ID" width="60">
          </el-table-column>
          <el-table-column label="头像" width="80">
            <template scope="scope">
              <img :src="scope.row.url" alt="" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <!--<el-table-column prop="username" label="会员名称">-->
          <!--</el-table-column>-->
          <el-table-column prop="nickname" label="昵称">
            <template scope="scope">
              <el-input v-model="scope.row.nickName" placeholder="昵称" @blur="submitNick(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="120">
            <template scope="scope">
              {{ scope.row.gender == 'WOMAN' ? '女' : '男' }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="createTime" label="注册时间" width="180">
          </el-table-column>
          <el-table-column prop="lastTime" label="最后更新时间" width="180">
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button size="small" @click="handleRowDetail(scope.$index, scope.row)">详情</el-button>
              <el-button plain size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-upload class="upload-demo" action="http://qiniu.fengxiuge.top"
               :on-remove='onRemove'
               :on-success="onSuccess"
               :file-list="fileList"
               :limit='1'
               :before-upload="beforeUpload"
               :headers="upHeaders"
               list-type="picture-card">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>

  import {jsonPost, getRequest,uploadFileRequest} from '../../utils/api';

  export default {
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50, 100],
        total: 0,
        filterForm: {
          name: ''
        },
        tableData: [],
        username: ''
      }
    },
    methods: {

      beforeUpload(file) {
        uploadFileRequest(file).then(res=>{
          console.log("+++++++++++++++++++++++")
          console.log(res)
        })
        return false
      },
      onRemove(file, fileList) {
        console.log(file, fileList[0])
        // this.addGoodsForm.imgUrl = ''
      },
      onSuccess(file, fileList) {
        let _this = this;
      },


      submitNick(index, row) {
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
      handleRowDetail(index, row) {
        this.$router.push({name: 'user_add', query: {id: row.id}})
      },
      handleRowDelete(index, row) {

        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          jsonPost('/auth/admin/deleteUser', {id: row.id}).then((res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '删除成功!'});
              this.getList();
            } else {
              this.$message({type: 'error', message: '删除用户失败!'});
            }
          })
        });
      },
      onSubmitFilter() {
        this.page = 1
        this.getList()
      },
      getList() {
        getRequest('/auth/admin/queryUserByNickname/page',
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
            this.$message({type: 'error', message: '获取用户列表失败!'});
          }
        })
      }
    },
    components: {},
    mounted() {
      let userPageIndex = localStorage.getItem('userPageIndex');
      let userPageSize = localStorage.getItem('userPageSize');
      if (userPageIndex == null) {
        userPageIndex = 1;
      }
      if (userPageSize == null) {
        userPageSize = 10;
      }
      this.pageIndex = Number(userPageIndex);
      this.pageSize = Number(userPageSize);
      this.getList();
    }
  }

</script>

<style scoped>

</style>

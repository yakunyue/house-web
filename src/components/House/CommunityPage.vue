<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item>小区列表</el-breadcrumb-item>
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
                        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                            <el-form-item label="区县名称">
                                <el-input v-model="filterForm.nickname" placeholder="区县名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmitFilter">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>

            <div class="form-table-box">
                <el-table :data="tableData" style="width: 100%" border stripe>
                    <el-table-column prop="id" label="ID" width="60"></el-table-column>
                    <el-table-column prop="provinceName" label="省/直辖市"></el-table-column>
                    <el-table-column prop="cityName" label="城市"></el-table-column>
                    <el-table-column prop="countyName" label="区县"></el-table-column>
                    <el-table-column prop="streetName" label="街区"></el-table-column>
                    <el-table-column prop="name" label="小区名称"></el-table-column>
                    <el-table-column prop="referencePrice" label="参考价"></el-table-column>
                    <el-table-column prop="onSaleNum" label="在售数"></el-table-column>
                    <el-table-column prop="onRentNum" label="在租数"></el-table-column>
                    <el-table-column label="操作" width="360">
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
                filterForm: {
                    name: ''
                },
                tableData: [],
                username: ''
            }
        },
        methods: {
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
                this.page = 1
                this.getList()
            },
            getList() {
                getRequest('/community/fuzzy/page',
                    {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize,
                        countyCode:"daxing"
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

            this.getList();
        }
    }

</script>

<style scoped>

</style>

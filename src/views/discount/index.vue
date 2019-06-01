<template>
  <div class="app-container calendar-list-container user-container">
    <div class="filter-container">
      <el-form>
        <el-row type="flex" class="row-bg" justify="space-around">

          <el-col :span="8">
            <el-form-item label="药品名称">
              <el-input v-model="searchContent">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" class="cutOffLine">
          <div class="buttonGroup">
            <el-button size="small" type="primary" @click="getDiscountList">
              <icon name="search"></icon>
              查询
            </el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="discountList"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="width: 100%"
      border
      highlight-current-row
      ref="singleTable">
      <el-table-column
        align="left"
        label="药品名称"
        prop="goodsInfoVO.title"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='数量'
        prop="discountInfoVO.goodsNumber"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='价格'
        prop="discountInfoVO.amount"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='备注'
        prop="discountInfoVO.comment"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='开始时间'
        prop="discountInfoVO.startAt"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='结束时间'
        prop="discountInfoVO.endAt"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='状态'
        prop="confirmStatus"
        width="100px">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.confirmStatus === 1"></i>
          <i class="el-icon-error" v-else></i>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="paging"
                   @current-change="handleCurrentChange"
                   small
                   :current-page="currentPage"
                   :page-size="pageSize"
                   layout="total, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>

export default {
  data () {
    return {
      productName: '',
      searchContent: '',
      // 分页信息
      currentPage: 1,
      totalCount: 0,
      pageSize: 20,
      discountList: []//
    }
  },
  mounted () {
    this.getDiscountList()
  },
  methods: {
    getDiscountList () {
      let param = {
        title: this.searchContent,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.fetch(this.apiType.getDicount, null, param,
        respData => {
          console.log(respData)
          this.discountList = respData.data.info
          this.totalCount = respData.data.totalSize
          this.currentPage = respData.data.currentPage
          this.pageSize = respData.data.pageSize
        })
    },

    handleCurrentChange (currentPage) {
      this.$emit('currentPageChange', currentPage)
      this.currentPage = currentPage
      this.getDiscountList()
    },
    querySubordinate () {
      // let param = {
      //   target: this.roleStatus,
      //   currentPage: this.currentPage,
      //   pageSize: this.pageSize
      // }
      // this.fetch(this.apiType.querySubordinate, param, null,
      //   respData => {
      //     this.userList = respData.data.info
      //     this.currentPage = respData.data.currentPage
      //     this.pageSize = respData.data.pageSize
      //     this.totalCount = respData.data.totalSize
      //   })
    }
  }
}
</script>

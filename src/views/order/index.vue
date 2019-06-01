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
            <el-button size="small" type="primary" @click="getOrderList">
              <icon name="search"></icon>
              查询
            </el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="orderList"
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
        align="left"
        label="客户"
        prop="shopInfoVO.title"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='数量'
        prop="discountInfoVO"
        :formatter="getNum"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='总价'
        prop="orderInfoVO.amount"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='单盒价'
        prop="discountInfoVO"
        :formatter="getNum2"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='时间'
        prop="orderInfoVO.startAt"
        span="6">
      </el-table-column>
      <el-table-column
        align="center"
        label='主管审批状态'
        prop="factoryConfirmStatus"
        width="100px">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.factoryConfirmStatus === 1"></i>
          <i class="el-icon-error" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label='商业审批状态'
        prop="merchantConfirmStatus"
        width="100px">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.merchantConfirmStatus === 1"></i>
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
      // 分页信息
      currentPage: 1,
      totalCount: 0,
      pageSize: 20,
      searchContent: '',
      orderList: []//
    }
  },
  mounted () {
    this.getOrderList()
  },
  methods: {
    getNum (row, column) {
      let discount = row.discountInfoVO
      if (discount) {
        return row.orderInfoVO.goodsNumber * discount.goodsNumber
      }
      return row.orderInfoVO.goodsNumber
    },
    getNum2 (row, column) {
      let discount = row.discountInfoVO
      let result = 0;
      if (discount) {
        let num = row.orderInfoVO.goodsNumber * discount.goodsNumber
        result = row.orderInfoVO.amount / num
        result = parseFloat(result).toFixed(2)
        return result
      }
      result = row.orderInfoVO.amount / row.orderInfoVO.goodsNumber
      result = parseFloat(result).toFixed(2)
      return result
    },
    getOrderList () {
      let param = {
        title: this.searchContent,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.fetch(this.apiType.getOrder, null, param,
        respData => {
          console.log(respData)
          this.orderList = respData.data.info
          this.totalCount = respData.data.totalSize
          this.currentPage = respData.data.currentPage
          this.pageSize = respData.data.pageSize
        })
    },

    handleCurrentChange (currentPage) {
      this.$emit('currentPageChange', currentPage)
      this.currentPage = currentPage
      this.getOrderList()
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

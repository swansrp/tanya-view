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
          <el-col :span="8">
            <el-form-item label="审批状态">
              <el-select v-model="comfirmStatus" clearable>
                <el-option v-for="item in confirmStatusConstant" :key="item.status" :label="item.display_name"
                           :value="item.status"></el-option>
              </el-select>
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
      @row-click='confirmDialog'
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
          <i class="el-icon-error" v-else-if="scope.row.merchantConfirmStatus === 0"></i>
          <i class="el-icon-warning" v-else></i>
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
    <el-dialog :title="detailsTitle" :visible.sync="detailsDialog" width="40%" @open="setData(currentRow, modifyRole)"
               @close="clearForm()">
      <el-form :model="currentRow" class="demo-ruleForm" ref="detailsForm">
        <el-form-item label="药品">
          <el-input v-model="modifyRole.goodTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="modifyRole.customTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="modifyRole.count" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="modifyRole.amount" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="confirm" v-if="modifyRole.needConfirm">审 批</el-button>
          <el-button size="small" type="primary" @click="reject" v-if="modifyRole.needConfirm">拒 绝</el-button>
          <el-button size="small" @click="detailsDialog = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const confirmStatusConstant = [
  {status: null, display_name: '全部'},
  {status: 0, display_name: '已拒绝'},
  {status: 1, display_name: '已审批'},
  {status: -1, display_name: '未审批'}
]
export default {
  data () {
    return {
      modifyRole: {
        id: null,
        goodTitle: '',
        customTitle: '',
        count: 0,
        needConfirm: false,
        amount: 0
      },
      detailsTitle: '审批订单',
      productName: '',
      // 分页信息
      currentPage: 1,
      totalCount: 0,
      pageSize: 20,
      searchContent: '',
      comfirmStatus: null,
      detailsDialog: false,
      confirmStatusConstant,
      currentRow: null,
      orderList: []//
    }
  },
  mounted () {
    this.getOrderList()
  },
  methods: {
    reject () {
      let param = {
        orderid: this.modifyRole.id,
        confirmed: 0
      }
      this.fetch(this.apiType.confirmOrder, param, null,
        respData => {
          console.log(respData)
          this.getOrderList()
        })
      this.detailsDialog = false
      this.clearForm()
    },
    confirm () {
      let param = {
        orderid: this.modifyRole.id,
        confirmed: 1
      }
      this.fetch(this.apiType.confirmOrder, param, null,
        respData => {
          console.log(respData)
          this.getOrderList()
        })
      this.detailsDialog = false
      this.clearForm()
    },
    clearForm () {
      this.modifyRole = {
        id: null,
        needConfirm: false,
        goodTitle: '',
        customTitle: '',
        count: 0,
        amount: 0
      }
    },
    setData (source, target) {
      console.log(source)
      target.id = source.orderInfoVO.id
      target.goodTitle = source.orderInfoVO.title
      target.customTitle = source.shopInfoVO.title
      target.count = source.orderInfoVO.goodsNumber
      target.amount = source.orderInfoVO.amount
      console.log(source.merchantConfirmAt)
      target.needConfirm = false
      if (source.merchantConfirmAt == null) {
        console.log(source.merchantConfirmAt)
        target.needConfirm = true
      }
    },
    confirmDialog (row) {
      this.currentRow = row
      this.detailsDialog = true
    },
    getNum (row, column) {
      let discount = row.discountInfoVO
      if (discount) {
        return row.orderInfoVO.goodsNumber * discount.goodsNumber
      }
      return row.orderInfoVO.goodsNumber
    },
    getNum2 (row, column) {
      let discount = row.discountInfoVO
      let result = 0
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
      let body = {
        title: this.searchContent,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      let param = {
        title: this.searchContent,
        confirmed: this.comfirmStatus
      }
      console.log(param)
      this.fetch(this.apiType.getOrder, param, body,
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
    }
  }
}
</script>

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
      @row-click='confirmDialog'
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
          <i class="el-icon-error" v-if="scope.row.confirmStatus === 0"></i>
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
        <el-form-item label="数量">
          <el-input v-model="modifyRole.count" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="modifyRole.amount" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="modifyRole.comment" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="confirm" v-if="modifyRole.needConfirm">审 批</el-button>
          <el-button size="small" @click="detailsDialog = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

const confirmStatusConstant = [
  {status: null, display_name: '全部'},
  {status: 1, display_name: '已审批'},
  {status: -1, display_name: '未审批'}
]
export default {
  data () {
    return {
      detailsTitle: '活动订单',
      modifyRole: {
        id: null,
        goodTitle: '',
        comment: '',
        count: 0,
        needConfirm: false,
        amount: 0
      },
      detailsDialog: false,
      productName: '',
      searchContent: '',
      // 分页信息
      currentPage: 1,
      totalCount: 0,
      pageSize: 20,
      comfirmStatus: null,
      confirmStatusConstant,
      currentRow: null,
      discountList: []//
    }
  },
  mounted () {
    this.getDiscountList()
  },
  methods: {
    setData (source, target) {
      console.log(source)
      target.id = source.discountInfoVO.id
      target.goodTitle = source.discountInfoVO.title
      target.comment = source.discountInfoVO.comment
      target.count = source.discountInfoVO.goodsNumber
      target.amount = source.discountInfoVO.amount
      target.needConfirm = false
      if (source.confirmAt == null) {
        console.log(source.confirmAt)
        target.needConfirm = true
      }
    },
    confirm () {
      let param = {
        discountId: this.modifyRole.id,
        confirmed: 1
      }
      this.fetch(this.apiType.confirmDiscount, param, null,
        respData => {
          console.log(respData)
          this.getDiscountList()
        })
      this.detailsDialog = false
      this.clearForm()
    },
    confirmDialog (row) {
      this.currentRow = row
      this.detailsDialog = true
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
    getDiscountList () {
      console.log(this.pageSize)
      let body = {
        title: this.searchContent,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      let param = {
        title: this.searchContent,
        confirmed: this.comfirmStatus
      }
      this.fetch(this.apiType.getDicount, param, body,
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

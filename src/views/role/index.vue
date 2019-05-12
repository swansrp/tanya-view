<template>
  <div class="app-container calendar-list-container user-container">
    <div class="filter-container">
      <el-form>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8">
            <el-form-item label="职位名称">
              <el-input v-model="roleName"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职位状态">
              <el-select v-model="roleStatus" clearable>
                <el-option v-for="item in userStatusConstant" :key="item.status" :label="item.display_name"
                           :value="item.status"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" class="cutOffLine">
          <div class="buttonGroup">
            <el-button size="small" type="primary" @click="querySubordinate">
              <icon name="search"></icon>
              查询
            </el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <el-table :data="userList"
              element-loading-text="加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              style="width: 100%"
              border
              highlight-current-row
              @row-click='enableUserEdit'
              @current-change="handleCurrentRowChange"
              @cell-click="toggleSelection"
              ref="singleTable">
      <el-table-column
        align="left"
        label="职位名称"
        width="150px">
        <template slot-scope="scope">
          <el-radio
            :label="scope.row.title"
            v-model="roleTitle"
            name="notice"
            :change="toggleSelection">
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label='用户名称'
        prop="userName"
        width="100px">
      </el-table-column>
      <el-table-column
        align="center"
        label='联系方式'
        prop="contact"
        width="180px">
      </el-table-column>
      <el-table-column
        align="left"
        label='角色备注'
        prop="comment"
        width="250px">
      </el-table-column>
      <el-table-column
        align="center"
        label='产品数量'
        prop="permissionDetailsVO.goodsNumber"
        width="100px">
      </el-table-column>
      <el-table-column
        align="center"
        label='营业员数量'
        prop="permissionDetailsVO.traderNumber"
        width="100px">
      </el-table-column>
      <el-table-column
        align="center"
        label='活动许可'
        width="100px">
        <template slot-scope="scope">
          <i class="el-icon-error" v-if="scope.row.permissionDetailsVO.discountNumber === 0"></i>
          <i class="el-icon-success" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label='促销许可'
        prop="permissionDetailsVO.traderNumber"
        width="100px">
        <template slot-scope="scope">
          <i class="el-icon-error" v-if="scope.row.permissionDetailsVO.campaignNumber === 0"></i>
          <i class="el-icon-success" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label='截止日期'>
        <template slot-scope="scope">
          <span>{{scope.row.endAt.toString().substring(0,10)}}</span>
          <i class="el-icon-warning"
             v-if="parseInt(new Date(scope.row.endAt.substring(0,10)).getTime()/1000)<parseInt(new Date().getTime()/1000)"></i>
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

    <el-dialog :title="title" :visible.sync="detailsDialog" width="40%" @open="setData(currentRow, modifyRole)" @close="clearForm()">
      <el-form :model="currentRow" class="demo-ruleForm" ref="detailsForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="modifyRole.title"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth">
          <el-input v-model="modifyRole.comment"></el-input>
        </el-form-item>
        <el-form-item label="到期时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="modifyRole.endAt"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="modifyRole.userName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="modifyRole.contact" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户备注" :label-width="formLabelWidth">
          <el-input v-model="modifyRole.userComment" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="营业员数量" :label-width="formLabelWidth">
          <el-input-number
            v-model="modifyRole.permissionDetailsVO.traderNumber"
            :min="1"
            :max="10"
            label="描述文字"
            size="mini">
          </el-input-number>
        </el-form-item>
        <el-form-item label="药品数量" :label-width="formLabelWidth">
          <el-input-number
            v-model="modifyRole.permissionDetailsVO.goodsNumber"
            :min="1"
            :max="10"
            label="描述文字"
            size="mini">
          </el-input-number>
        </el-form-item>
        <el-form-item label="功能许可" :label-width="formLabelWidth">
          <el-checkbox
            v-model="modifyRole.permissionDetailsVO.discountNumber"
            :true-label=9999
            :false-label=0>活动
          </el-checkbox>
          <el-checkbox
            v-model="modifyRole.permissionDetailsVO.campaignNumber"
            :true-label=9999
            :false-label=0>促销
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updateRole">确 定</el-button>
          <el-button size="small" @click="detailsDialog = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const userStatusConstant = [
  {status: true, display_name: '已邀请'},
  {status: false, display_name: '空缺'}
]
export default {
  data () {
    return {
      self: {
        name: '',
        comment: '',
        email: '',
        password: '',
        phone: '',
        role: ''
      },
      modifyRole: {
        id: null,
        permissionDetailsVO: {
          traderNumber: 0,
          discountNumber: 0,
          goodsNumber: 0,
          campaignNumber: 0
        },
        title: '',
        comment: '',
        endAt: '',
        userName: '',
        contact: '',
        userComment: '',
        roleType: ''
      },
      // 下属信息
      userList: [],
      roleName: '',
      userName: '',
      roleStatus: null,
      validityPeriod: [],
      userStatusConstant,
      // 分页信息
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      // 选中信息
      currentSelectUserId: '',
      currentRow: {
        roleType: '',
        id: null,
        title: '',
        contact: '',
        comment: '',
        userId: null,
        userName: '',
        userComment: '',
        endAt: null,
        permissionDetailsVO: {
          goodsNumber: null,
          traderNumber: null,
          discountNumber: null,
          campaignNumber: null,
          factoryNumber: null,
          sign: null
        }
      },
      roleTitle: null,
      // 对话框
      detailsDialog: false,
      // 详情框
      formLabelWidth: '100px',
      title: '下属信息详情',
      pickerOptions: {
        disabledDate: (time) => {
          let endDate = this.$store.getters.role.endAt
          return time.getTime() < Date.now() || time.getTime() > (new Date(endDate)).getTime()
        },
        shortcuts: [{
          text: '顺延1个月',
          onClick: (picker) => {
            let date = new Date(this.modifyRole.endAt)
            date.setMonth(date.getMonth() + 1, 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '顺延3个月',
          onClick: (picker) => {
            let date = new Date(this.modifyRole.endAt)
            date.setMonth(date.getMonth() + 3, 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '顺延6个月',
          onClick: (picker) => {
            let date = new Date(this.modifyRole.endAt)
            date.setMonth(date.getMonth() + 6, 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '顺延1年',
          onClick: (picker) => {
            let date = new Date(this.role.endAt)
            date.setFullYear(date.getFullYear() + 1, 1)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  mounted () {
    this.querySubordinate()
  },
  methods: {
    querySubordinate () {
      let param = {
        title: this.roleName,
        target: this.roleStatus,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.fetch(this.apiType.querySubordinate, param, null,
        respData => {
          this.userList = respData.data.info
          this.currentPage = respData.data.currentPage
          this.pageSize = respData.data.pageSize
          this.totalCount = respData.data.totalSize
        })
    },
    updateRole () {
      this.modifyRole.startAt = null
      this.modifyRole.permission = this.modifyRole.permissionDetailsVO
      this.fetch(this.apiType.updateRole, null, this.modifyRole, respData => {
        this.setData(respData.data, this.currentRow)
      })
      this.detailsDialog = false
    },
    enableUserEdit (row) {
      this.currentSelectUserId = row.id
      this.currentRow = row
    },
    handleCurrentRowChange (val) {
      this.currentRow = val || {}
    },
    setData (source, target) {
      target.permissionDetailsVO.traderNumber = source.permissionDetailsVO.traderNumber
      target.permissionDetailsVO.discountNumber = source.permissionDetailsVO.discountNumber
      target.permissionDetailsVO.goodsNumber = source.permissionDetailsVO.goodsNumber
      target.permissionDetailsVO.campaignNumber = source.permissionDetailsVO.campaignNumber
      target.id = source.id
      target.title = source.title
      target.comment = source.comment
      target.endAt = source.endAt
      target.userName = source.userName
      target.contact = source.contact
      target.userComment = source.userComment
      target.roleType = source.roleType
    },
    clearForm () {
      this.modifyRole = {
        permissionDetailsVO: {
          traderNumber: 0,
          discountNumber: 0,
          goodsNumber: 0,
          campaignNumber: 0
        },
        id: null,
        title: '',
        comment: '',
        endAt: '',
        userName: '',
        contact: '',
        userComment: '',
        roleType: ''
      }
    },
    toggleSelection (row, column, cell, event) {
      this.currentSelectUserId = row.id
      this.roleTitle = row.title
      this.detailsDialog = true
      this.currentRow = row
    },
    handleCurrentChange (currentPage) {
      this.$emit('currentPageChange', currentPage)
      this.currentPage = currentPage
      this.querySubordinate()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-icon-error {
    color: darkred;
  }

  .el-icon-success {
    color: darkgreen;
  }

  .el-icon-warning {
    color: darkred;
  }
</style>

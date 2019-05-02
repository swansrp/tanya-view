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
            <el-form-item label="用户名称">
              <el-input v-model="userName">
              </el-input>
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
        width="150px">
       </el-table-column>
      <el-table-column
        align="left"
        label='角色备注'
        prop="comment"
        width="200px">
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
        <template slot-scope="scope" >
          <i class="el-icon-error" v-if="scope.row.permissionDetailsVO.discountNumber === 0"></i>
          <i class="el-icon-success" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label='促销许可'
        prop="permissionDetailsVO.traderNumber"
        width="100px">
        <template slot-scope="scope" >
          <i class="el-icon-error" v-if="scope.row.permissionDetailsVO.campaignNumber === 0"></i>
          <i class="el-icon-success" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label='截止日期'>
        <template slot-scope="scope" >
          <span>{{scope.row.endAt.substring(0,10)}}</span>
          <i class="el-icon-warning" v-if="parseInt(new Date(scope.row.endAt.substring(0,10)).getTime()/1000)<parseInt(new Date().getTime()/1000)"></i>
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

    <el-dialog :title="title" :visible.sync="detailsDialog" width="40%" @open="setData()" @close="clearForm('detailsForm')">
      <el-form :model="detailsForm" class="demo-ruleForm" :rules="rules" ref="detailsForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="userId">
          <el-input v-model="detailsForm.roleTile"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth" prop="userId">
          <el-input v-model="detailsForm.roleComment"></el-input>
        </el-form-item>
        <el-form-item label="到期时间" :label-width="formLabelWidth" prop="userId">
          <el-date-picker
            v-model="detailsForm.endAt"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="detailsForm.userName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="name">
          <el-input v-model="detailsForm.userContact"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户备注" :label-width="formLabelWidth" prop="name">
          <el-input v-model="detailsForm.userComment" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="营业员数量" :label-width="formLabelWidth" prop="name">
          <el-input-number
            v-model="detailsForm.traderNumber"
            :min="1"
            :max="10"
            label="描述文字"
            size="mini">
          </el-input-number>
        </el-form-item>
        <el-form-item label="药品数量" :label-width="formLabelWidth" prop="name">
          <el-input-number
            v-model="detailsForm.goodsNumber"
            :min="1"
            :max="10"
            label="描述文字"
            size="mini">
          </el-input-number>
        </el-form-item>
        <el-form-item label="功能许可" :label-width="formLabelWidth" prop="name">
          <el-checkbox
            v-model="detailsForm.discountNumber"
            :true-label=9999
            :false-label=0>活动
          </el-checkbox>
          <el-checkbox
            v-model="detailsForm.campaignNumber"
            :true-label=9999
            :false-label=0>促销
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="validateForm('detailsForm')">确 定</el-button>
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
      role: {
        roleType: '',
        id: '',
        title: '',
        comment: '',
        startAt: '',
        endAt: '',
        permission: {}
      },
      // 下属信息
      userList: [],
      roleName: '',
      userName: '',
      roleStatus: '',
      validityPeriod: [],
      userStatusConstant,
      // 分页信息
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      // 选中信息
      currentSelectUserId: '',
      currentRow: '',
      roleTitle: undefined,
      // 对话框
      detailsDialog: false,
      // 详情框
      formLabelWidth: '100px',
      title: '下属信息详情',
      detailsForm: {
        roleTile: '',
        roleComment: '',
        userName: '',
        userContact: '',
        userComment: '',
        traderNumber: 0,
        goodsNumber: 0,
        discountNumber: 0,
        campaignNumber: 0,
        startAt: '',
        endAt: ''
      },
      pickerOptions: {
        disabledDate: (time) => {
          console.log(this.role.endAt)
          return time.getTime() < Date.now() || time.getTime() > (new Date(this.role.endAt)).getTime()
        },
        shortcuts: [{
          text: '顺延1个月',
          onClick (picker) {
            let date = new Date()
            date.setMonth(date.getMonth() + 1, 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '顺延3个月',
          onClick (picker) {
            let date = new Date()
            date.setMonth(date.getMonth() + 3, 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '顺延6个月',
          onClick (picker) {
            let date = new Date()
            date.setMonth(date.getMonth() + 6, 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '顺延1年',
          onClick (picker) {
            let date = new Date()
            date.setFullYear(date.getFullYear() + 1, 1)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  mounted () {
    this.getUserInfo()
    this.getRoleInfo()
    this.querySubordinate()
  },
  methods: {
    getUserInfo () {
      this.fetch(this.apiType.getUserInfo, null, null,
        respData => {
          this.self.name = respData.data.name
          this.self.phone = respData.data.phone
          this.self.email = respData.data.email
          this.self.comment = respData.data.comment
          this.self.role = this.convertRole(respData.data.roleId)
        })
      console.log(this.self)
      console.log(this.self.role)
      return this.self.role
    },
    convertRole (roleId) {
      switch (roleId) {
        case 1:
          return '超级管理员'
        case 2:
          return '地方管理员'
        case 3:
          return '商业渠道'
        case 4:
          return '药厂主管'
        case 5:
          return '销售代表'
        case 6:
          return '促销员'
      }
    },
    getRoleInfo () {
      this.fetch(this.apiType.getRoleInfo, null, null,
        respData => {
          this.role.id = respData.data.id
          this.role.roleType = respData.data.roleType
          this.role.title = respData.data.title
          this.role.contact = respData.data.contact
          this.role.comment = respData.data.comment
          this.role.startAt = respData.data.startAt
          this.role.endAt = respData.data.endAt
          this.role.permission = respData.data.permissionDetailsVO
        })
    },
    querySubordinate () {
      let param = {
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
    enableUserEdit (row) {
      this.currentSelectUserId = row.id
      this.currentRow = row
    },
    handleCurrentRowChange (val) {
      this.currentRow = val || {}
    },
    toggleSelection (row, column, cell, event) {
      this.currentSelectUserId = row.id
      this.roleTitle = row.title
      this.detailsDialog = true
    },
    handleCurrentChange (currentPage) {
      this.$emit('currentPageChange', currentPage)
      this.currentPage = currentPage
      this.querySubordinate()
    },
    setData () {
      this.detailsForm.roleTile = this.currentRow.title
      this.detailsForm.roleComment = this.currentRow.comment
      this.detailsForm.userName = this.currentRow.userName
      this.detailsForm.userContact = this.currentRow.contact
      this.detailsForm.userComment = this.currentRow.userComment
      this.detailsForm.traderNumber = this.currentRow.permissionDetailsVO.traderNumber
      this.detailsForm.goodsNumber = this.currentRow.permissionDetailsVO.goodsNumber
      this.detailsForm.discountNumber = this.currentRow.permissionDetailsVO.discountNumber
      this.detailsForm.campaignNumber = this.currentRow.permissionDetailsVO.campaignNumber
      this.detailsForm.startAt = this.currentRow.startAt
      this.detailsForm.endAt = this.currentRow.endAt
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

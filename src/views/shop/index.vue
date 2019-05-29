<template>
  <div class="app-container calendar-list-container user-container">
    <div class="filter-container">
      <el-form>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="15">
            <el-form-item label="客户名称">
              <el-input v-model="shopName"/>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="客户标记码">
              <el-input v-model="shopCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="客户地址">
              <el-input v-model="shopComment"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" class="cutOffLine">
          <div class="buttonGroup">
            <el-button size="small" type="primary" @click="queryShop">
              <icon name="search"></icon>
              查询
            </el-button>
            <el-button size="small" type="primary" @click="getShopTemplate">
              <icon name="download"></icon>
              模板下载
            </el-button>
          </div>
          <el-upload class="uploadfile" action="" :http-request='uploadFile' :show-file-list="false" multiple>
            <el-button class="custom-btn" size="small" type="primary">上传</el-button>
          </el-upload>
        </el-row>
      </el-form>
    </div>
    <el-table :data="shopList"
              element-loading-text="加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              style="width: 100%"
              border
              highlight-current-row
              :row-class-name="tableRowClassName"
              @row-click='enableShopEdit'
              @current-change="handleCurrentRowChange"
              @cell-click="toggleSelection"
              ref="singleTable">
      <el-table-column
        align="left"
        label="系统编码"
        width="80px">
        <template slot-scope="scope">
          <el-radio
            :label="scope.row.shopInfoVO.id"
            v-model="currentSelectShopId"
            name="notice"
            :change="toggleSelection">
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label='客户标记码'
        prop="shopInfoVO.code"
        width="300px">
      </el-table-column>
      <el-table-column
        align="left"
        label='客户名称'
        prop="shopInfoVO.title"
        width="300px">
      </el-table-column>
      <el-table-column
        align="left"
        label='客户备注'
        prop="shopInfoVO.comment"
        width="500px">
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

    <el-dialog :title="title" :visible.sync="detailsDialog" width="40%" @open="setData(currentRow, modifyShop)" @close="clearForm()">
      <el-form :model="currentRow" class="demo-ruleForm" ref="detailsForm">
        <el-form-item label="客户标记码" :label-width="formLabelWidth">
          <el-input v-model="modifyShop.shop.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户名称" :label-width="formLabelWidth">
          <el-input v-model="modifyShop.shop.title"></el-input>
        </el-form-item>
        <el-form-item label="客户备注" :label-width="formLabelWidth">
          <el-input v-model="modifyShop.shop.comment" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updateShop">确 定</el-button>
          <el-button size="small" @click="detailsDialog = false">取 消</el-button>
          <el-button size="small" type="warning" @click="deleteShop">删 除</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      shopCode: '',
      shopName: '',
      shopComment: '',
      shopList: [],
      // 分页信息
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      // 选中信息
      currentSelectShopId: '',
      currentRow: {},
      currentRowIndex: 0,
      // dialog
      detailsDialog: false,
      title: '客户信息详情',
      formLabelWidth: '150px',
      modifyShop: {
        shop: {
          code: '',
          title: '',
          comment: ''
        }
      }

    }
  },
  mounted () {
    this.queryShop()
  },
  methods: {
    queryShop () {
      let param = {
        title: this.shopName
      }
      let body = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.fetch(this.apiType.queryShop, param, body,
        respData => {
          this.shopList = respData.data.info
          this.currentPage = respData.data.currentPage
          this.pageSize = respData.data.pageSize
          this.totalCount = respData.data.totalSize
        })
    },
    updateShop () {
      const _this = this
      this.fetch(this.apiType.updateShop, null, this.modifyShop,
        respData => {
          _this.shopList.splice(_this.currentRow.index, 1, respData.data.info[0])
        })
      this.detailsDialog = false
    },
    deleteShop () {
      const _this = this
      const param = {
        shopid: _this.currentRow.shopInfoVO.id
      }
      this.fetch(this.apiType.deleteShop, param, null,
        () => {
          _this.shopList.splice(_this.currentRow.index, 1)
        })
      this.detailsDialog = false
    },
    getShopTemplate () {
      this.download(this.apiType.getShopTemplate)
    },
    uploadShop (file, type) {
      const _this = this
      return new Promise((resolve, reject) => {
        _this.fetch(_this.apiType.uploadShop, type, file,
          respData => {
            resolve(respData)
          }, errData => {
            reject(errData)
          })
      })
    },
    uploadFile (param) {
      let fileObject = param.file
      let formData = new FormData()
      formData.append('file', fileObject)
      const _this = this
      this.$confirm('请选择上传类型,如果选择<strong>覆盖</strong>现有的客户将被<strong>替换</strong>', '警告', {
        distinguishCancelAndClose: true,
        dangerouslyUseHTMLString: true,
        confirmButtonText: '覆盖',
        cancelButtonText: '添加上传'
      })
        .then(() => {
          const type = {
            merchantid: _this.$store.getters.role.id,
            override: true
          }
          _this.uploadShop(formData, type)
            .then((resp) => {
              _this.$message({
                type: 'info',
                message: '上传覆盖成功'
              })
              _this.queryShop()
            })
            .catch((err) => {
              console.log(err)
              _this.$message({
                type: 'error',
                message: '上传覆盖失败'
              })
            })
        })
        .catch(action => {
          const type = {
            merchantid: _this.$store.getters.role.id,
            override: false
          }
          if (action === 'cancel') {
            _this.uploadShop(formData, type)
              .then((resp) => {
                _this.$message({
                  type: 'info',
                  message: '上传成功'
                })
                _this.queryShop()
              })
              .catch((err) => {
                console.log(err)
                _this.$message({
                  type: 'error',
                  message: '上传失败'
                })
              })
          } else {
            _this.$message({
              type: 'info',
              message: '已取消'
            })
          }
        })
    },
    enableShopEdit (row) {
      console.log(row)
      this.currentSelectShopId = row.shopInfoVO.id
      this.currentRow = row
    },
    handleCurrentRowChange (row) {
      this.currentRow = row || {}
    },
    toggleSelection (row, column, cell, event) {
      this.currentSelectShopId = row.shopInfoVO.id
      this.detailsDialog = true
      this.currentRow = row
    },
    handleCurrentChange (currentPage) {
      this.$emit('currentPageChange', currentPage)
      this.currentPage = currentPage
      this.querySubordinate()
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
    },
    setData (source, target) {
      target.shop.id = source.shopInfoVO.id
      target.shop.code = source.shopInfoVO.code
      target.shop.title = source.shopInfoVO.title
      target.shop.comment = source.shopInfoVO.comment
    },
    clearForm () {
      this.modifyShop = {
        shop: {
          code: '',
          title: '',
          comment: ''
        }
      }
    }
  }
}
</script>

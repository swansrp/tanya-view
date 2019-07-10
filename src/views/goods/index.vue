<template>
  <div class="app-container calendar-list-container user-container">
    <div class="filter-container">
      <el-form>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="15">
            <el-form-item label="商品名称">
              <el-input v-model="goodsName"/>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="商品标记码">
              <el-input v-model="goodsCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="生产厂商">
              <el-input v-model="goodsProduct"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" class="cutOffLine">
          <div class="buttonGroup">
            <el-button size="small" type="primary" @click="queryGoods">
              <icon name="search"></icon>
              查询
            </el-button>
            <el-button size="small" type="primary" @click="getGoodsTemplate">
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
    <el-table :data="goodsList"
              element-loading-text="加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              style="width: 100%"
              border
              highlight-current-row
              :row-class-name="tableRowClassName"
              @row-click='enableGoodsEdit'
              @current-change="handleCurrentRowChange"
              @cell-click="toggleSelection"
              ref="singleTable">
      <el-table-column
        align="left"
        label="系统编码"
        width="80px">
        <template slot-scope="scope">
          <el-radio
            :label="scope.row.goodsInfoVO.id"
            v-model="currentSelectGoodsId"
            name="notice"
            :change="toggleSelection">
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label='商品标记码'
        prop="goodsInfoVO.code"
        width="100px">
      </el-table-column>
      <el-table-column
        align="left"
        label='商品名称'
        prop="goodsInfoVO.title"
        width="200px">
      </el-table-column>
      <el-table-column
        align="left"
        label='生产厂商'
        prop="goodsInfoVO.product"
        width="300px">
      </el-table-column>
      <el-table-column
        align="left"
        label='规格'
        prop="goodsInfoVO.spec"
        width="100px">
      </el-table-column>
      <el-table-column
        align="left"
        label='单位'
        prop="goodsInfoVO.unit"
        width="70px">
      </el-table-column>
      <el-table-column
        align="left"
        label='价格'
        prop="goodsInfoVO.amount"
        width="100px">
      </el-table-column>
      <el-table-column
        align="left"
        label='商品备注'
        prop="goodsInfoVO.comment">
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

    <el-dialog :title="title" :visible.sync="detailsDialog" width="40%" @open="setData(currentRow, modifyGoods)" @close="clearForm()">
      <el-form :model="currentRow" class="demo-ruleForm" ref="detailsForm">
        <el-form-item label="商品标记码" :label-width="formLabelWidth">
          <el-input v-model="modifyGoods.goods.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="modifyGoods.goods.title"></el-input>
        </el-form-item>
        <el-form-item label="生产厂商" :label-width="formLabelWidth">
          <el-input v-model="modifyGoods.goods.product" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格" :label-width="formLabelWidth">
          <el-input v-model="modifyGoods.goods.spec" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位" :label-width="formLabelWidth">
          <el-input v-model="modifyGoods.goods.unit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="modifyGoods.goods.amount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="药品备注" :label-width="formLabelWidth">
          <el-input v-model="modifyGoods.goods.comment" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updateGoods">确 定</el-button>
          <el-button size="small" @click="detailsDialog = false">取 消</el-button>
          <el-button size="small" type="warning" @click="deleteGoods">删 除</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      goodsCode: '',
      goodsName: '',
      goodsProduct: '',
      goodsList: [],
      // 分页信息
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      // 选中信息
      currentSelectGoodsId: '',
      currentRow: {},
      currentRowIndex: 0,
      // dialog
      detailsDialog: false,
      title: '商品信息详情',
      formLabelWidth: '150px',
      modifyGoods: {
        goods: {
          code: '',
          title: '',
          comment: '',
          product: '',
          spec: '',
          amount: '',
          unit: ''
        }
      }

    }
  },
  mounted () {
    this.queryGoods()
  },
  methods: {
    queryGoods () {
      let param = {
        title: this.goodsName
      }
      let body = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.fetch(this.apiType.queryGoods, param, body,
        respData => {
          this.goodsList = respData.data.info
          this.currentPage = respData.data.currentPage
          this.pageSize = respData.data.pageSize
          this.totalCount = respData.data.totalSize
        })
    },
    updateGoods () {
      const _this = this
      this.fetch(this.apiType.updateGoods, null, this.modifyGoods,
        respData => {
          _this.goodsList.splice(_this.currentRow.index, 1, respData.data.info[0])
        })
      this.detailsDialog = false
    },
    deleteGoods () {
      const _this = this
      const param = {
        goodsid: _this.currentRow.goodsInfoVO.id
      }
      this.fetch(this.apiType.deleteGoods, param, null,
        () => {
          _this.goodsList.splice(_this.currentRow.index, 1)
        })
      this.detailsDialog = false
    },
    getGoodsTemplate () {
      this.download(this.apiType.getGoodsTemplate)
    },
    uploadGoods (file, type) {
      const _this = this
      return new Promise((resolve, reject) => {
        _this.fetch(_this.apiType.uploadGoods, type, file,
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
      this.$confirm('请选择上传类型,如果选择<strong>覆盖</strong>现有的商品将被<strong>替换</strong>', '警告', {
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
          _this.uploadGoods(formData, type)
            .then((resp) => {
              _this.$message({
                type: 'info',
                message: '上传覆盖成功'
              })
              _this.queryGoods()
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
            _this.uploadGoods(formData, type)
              .then((resp) => {
                _this.$message({
                  type: 'info',
                  message: '上传成功'
                })
                _this.queryGoods()
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
    enableGoodsEdit (row) {
      console.log(row)
      this.currentSelectGoodsId = row.goodsInfoVO.id
      this.currentRow = row
    },
    handleCurrentRowChange (row) {
      this.currentRow = row || {}
    },
    toggleSelection (row, column, cell, event) {
      this.currentSelectGoodsId = row.goodsInfoVO.id
      this.detailsDialog = true
      this.currentRow = row
    },
    handleCurrentChange (currentPage) {
      this.$emit('currentPageChange', currentPage)
      this.currentPage = currentPage
      this.queryGoods()
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
    },
    setData (source, target) {
      target.goods.id = source.goodsInfoVO.id
      target.goods.code = source.goodsInfoVO.code
      target.goods.title = source.goodsInfoVO.title
      target.goods.product = source.goodsInfoVO.product
      target.goods.spec = source.goodsInfoVO.spec
      target.goods.unit = source.goodsInfoVO.unit
      target.goods.amount = source.goodsInfoVO.amount
      target.goods.comment = source.goodsInfoVO.comment
    },
    clearForm () {
      this.modifyGoods = {
        goods: {
          code: '',
          title: '',
          comment: '',
          product: '',
          spec: '',
          amount: '',
          unit: ''
        }
      }
    }
  }
}
</script>

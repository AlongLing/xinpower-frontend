<template>
  <div>
    <el-form ref="form" :model="newGoods" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="newGoods.name" placeholder="请输入商品名称和描述"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="newGoods.price" placeholder="请输入商品价格 格式：9999" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品首图">
        <div>
          <div class="filter-container">
            <el-upload
            class="upload-demo"
            action="http://localhost:3000/goods/uploadFirstPicture"
            :on-success="uploadFirstPictureSuccess"
            :disabled="FirstPictureDisabled"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">{{FirstPictureBtnText}}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且只能上传一张</div>
          </el-upload>
          </div>
           <el-table v-loading="firstPictureLoading" :data="firstPicture" stripe style="width: 100%">
            <el-table-column label="图片" width="400">
              <template slot-scope="scope">
                <img :src="scope.row.download_url" alt height="50" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onFirstPictureDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="商品大图">
        <div>
          <div class="filter-container">
            <el-upload
            class="upload-demo"
            action="http://localhost:3000/goods/uploadBigPicture"
            :on-success="uploadBigPictureSuccess"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，推荐3张商品大图</div>
          </el-upload>
          </div>
          <el-table v-loading="bigPictureLoading" :data="bigPictureList" stripe style="width: 100%">
            <el-table-column label="图片" width="400">
              <template slot-scope="scope">
                <img :src="scope.row.download_url" alt height="50" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onBigPictureDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="详情图片">
        <div>
          <div class="filter-container">
            <el-upload
            class="upload-demo"
            action="http://localhost:3000/goods/uploadDetailPicture"
            :on-success="uploadDetailPictureSuccess"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，推荐5张商品详情图片</div>
          </el-upload>
          </div>
          <el-table v-loading="detailPictureLoading" :data="detailPictureList" stripe style="width: 100%">
            <el-table-column label="图片" width="400">
              <template slot-scope="scope">
                <img :src="scope.row.download_url" alt height="50" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onDetailPictureDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onGoodsSubmit">确定</el-button>
        <el-button @click="onGoodsCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>{{deletePictureTips}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doCancel">取 消</el-button>
        <el-button type="primary" @click="doDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchFirstPictureList, fetchBigPictureList, fetchDetailPictureList, del, fetchGoodsTypeList, fetchNewGoods } from '@/api/goods'
export default {
  data() {
    return {
      newGoods: {
        name: "",
        price: "",
      },
      firstPictureLoading: false,
      firstPicture: [],                           // 这里用数组其实只是匹配格式，实际只用到了第一个对象
      FirstPictureBtnText: '点击上传',
      FirstPictureDisabled: false,
      goodsId: '',                                // 新增商品的id
      bigPictureLoading: false,
      bigPictureList: [],
      detailPictureLoading: false,
      detailPictureList: [],
      delDialogVisible: false,
      deletePictureTips: '',
      deletePicture: {},                          // 待删除的图片对象
      goodsTypeList: [],                          // 商品分类列表数据           
    }
  },

  created() {
    // 获取商品的分类列表数据
    fetchGoodsTypeList().then((res) => {
      console.log(`fetchGoodsTypeList res = ${res}`)
      console.log(`fetchGoodsTypeList res.data = ${res.data}`)
      console.log(`fetchGoodsTypeList res.data.length = ${res.data.length}`)
      this.goodsTypeList = res.data
    }).catch((err) => {
      console.error(`fetchGoodsTypeList err = ${err}`)
    })
  },

  methods: {
    // 获取商品首图列表，其实只有一张图片
    getFirstPictureList() {
      this.firstPictureLoading = true
      fetchFirstPictureList({
        goodsId: this.goodsId
      }).then((res) => {
        this.firstPicture = res.data
        this.firstPictureLoading = false
      })
    },
    // 获取商品大图列表
    getBigPictureList() {
      this.bigPictureLoading = true
      fetchBigPictureList({
        goodsId: this.goodsId
      }).then((res) => {
        this.bigPictureList = res.data
        this.bigPictureLoading = false
      })
    },
    // 获取商品详情图片列表
    getDetailPictureList() {
      this.detailPictureLoading = true
      fetchDetailPictureList({
        goodsId: this.goodsId
      }).then((res) => {
        this.detailPictureList = res.data
        this.detailPictureLoading = false
      })
    },
    // 上传商品首图成功后的回调
    uploadFirstPictureSuccess(res) {
      if (res.id_list.length > 0) {
        this.alertMessage(1, '上传成功')
        console.log(`uploadFirstPictureSuccess res.id_list = ${res.id_list}`)
        this.goodsId = (res.id_list).toString()
        this.getFirstPictureList()
        // 将上传按钮设置为不可用
        this.FirstPictureDisabled = true
        this.FirstPictureBtnText = '已上传'
      }
    },
    // 上传商品大图成功后的回调
    uploadBigPictureSuccess(res) {
      console.log(`uploadBigPictureSuccess = ${res.id_list}`)              // 这个数据返回为空，这里是更新，不同于上面的新增，也可以用swiperPictureId 来获取上传之后的大图id
      this.getBigPictureList()
    },
    // 上传商品详情图片成功后的回调
    uploadDetailPictureSuccess(res) {
      console.log(`uploadDetailPictureSuccess = ${res.id_list}`)
      this.getDetailPictureList()
    },
    // 删除商品首图
    onFirstPictureDelete(row) {
      this.deletePicture = row
      console.log(`onDetail deletePicture = ${JSON.stringify(this.deletePicture)}`)
      this.delDialogVisible = true
      this.currentDeleteType = 1
      this.deletePictureTips = '警告!!! 删除商品首图将删除该商品的全部信息，请慎重选择'
    },
    // 删除商品大图
    onBigPictureDelete(row) {
      this.deletePicture = row
      console.log(`onDetail deletePicture = ${JSON.stringify(this.deletePicture)}`)
      this.delDialogVisible = true
      this.currentDeleteType = 2
      this.deletePictureTips = '确定删除该图片吗?'
    },
    // 删除商品详情图片
    onDetailPictureDelete(row) {
      this.deletePicture = row
      console.log(`onDetail deletePicture = ${JSON.stringify(this.deletePicture)}`)
      this.delDialogVisible = true
      this.currentDeleteType = 3
      this.deletePictureTips = '确定删除该图片吗?'
    },
    // 对话框确定按钮
    doDelete() {
      this.delDialogVisible = false
      const currentDeleteType = this.currentDeleteType
      const deletePicture = this.deletePicture
      const goodsId = this.goodsId
      if (currentDeleteType == 1) {
        // 删除商品首图，将直接删除欲新增的该商品
        this.firstPictureLoading = true
        del({
          deletePic: deletePicture,
          deleteType: currentDeleteType,
          deleteGoodsId: goodsId,
        }).then((res) => {
          this.firstPictureLoading = false
          this.getFirstPictureList()
          this.getBigPictureList()
          this.getDetailPictureList()
          this.firstPicture = []
          this.alertMessage(1, '删除成功')
          // 将上传按钮设置为不可用
          this.FirstPictureDisabled = false
          this.FirstPictureBtnText = '点击上传'
          // 回到商品列表页面, 这里后续要修改，不需要回到上一页，只清除当前页的数据就好
          // this.$router.push('/gift/giftlist')
        })
      } else if (currentDeleteType == 2) {
        // 删除商品大图
        this.bigPictureLoading = true
        del({
          deletePic: deletePicture,
          deleteType: currentDeleteType
        }).then((res) => {
          this.bigPictureLoading = false
          this.getBigPictureList()
          this.alertMessage(1, '删除成功')
        })
      } else if (currentDeleteType == 3) {
        // 删除商品详情图片
        this.detailPictureLoading = true
        del({
          deletePic: deletePicture,
          deleteType: currentDeleteType
        }).then((res) => {
          this.detailPictureLoading = false
          this.getDetailPictureList()
          this.alertMessage(1, '删除成功')
        })
      } else {
        // do nothing
      }
    },
    // 对话框取消按钮
    doCancel() {
      this.delDialogVisible = false
      this.currentDeleteType = 0
    },

    // 新增商品最终确定按钮
    onGoodsSubmit() {
      const goodsName = this.newGoods.name
      const goodsPrice = this.newGoods.price
      if (goodsName == '') {
        this.alertMessage(2, '商品名称不能为空')
        return
      }
      if (goodsPrice == '') {
        this.alertMessage(2, '商品价格不能为空')
        return
      }
      if (this.firstPicture.length == 0) {
        this.alertMessage(2, '商品首图不能为空')
        return
      }
      if (this.bigPictureList.length == 0) {
        this.alertMessage(2, '商品大图不能为空')
        return
      }
      if (this.detailPictureList.length == 0) {
        this.alertMessage(2, '商品详情图片不能为空')
        return
      }
      let goodsTypeId = ''
      const priceNumber = parseInt(goodsPrice)
      console.log(`priceNumber = ${priceNumber}`)
      if (priceNumber <= 500) {                           // 当前商品的价格小于 500 鑫星
        goodsTypeId = JSON.parse(this.goodsTypeList[0])._id
      } else if (priceNumber <= 2000) {
        goodsTypeId = JSON.parse(this.goodsTypeList[1])._id
      } else if (priceNumber <= 5000) {
        goodsTypeId = JSON.parse(this.goodsTypeList[2])._id
      } else {
        goodsTypeId = JSON.parse(this.goodsTypeList[3])._id
      }

      fetchNewGoods({
        goodsId: this.goodsId,
        name: goodsName,
        price: goodsPrice,
        typeId: goodsTypeId
      }).then((res) => {
        console.log(`res.data.length = ${res.data.length}`)
        this.alertMessage(1, '新增商品成功')
        this.$router.push('/gift/giftlist')
      })

    },
    // 新增商品最终取消按钮
    onGoodsCancel() {
      const goodsId = this.goodsId
      if (goodsId != null && goodsId != undefined && goodsId != '') {
        del({
          deletePic: this.deletePicture,
          deleteType: 1,
          deleteGoodsId: goodsId,
        }).then((res) => {
          this.$router.push('/gift/giftlist')
        })
      } else {
        this.$router.push('/gift/giftlist')
      }
    },

    // 弹出消息提醒
    alertMessage(type, msg) {
      var msgType
      switch(type) {
        case 1:
          msgType = 'success'
          break
        case 2:
          msgType = 'warning' 
          break
        case 3:
          msgType = 'info'
          break
        case 4:
          msgType = 'error'
          break
        default:
          break     
      }
      this.$message({
        message: msg,
        type: msgType
      })
    },
  }
};
</script>

<style>
</style>
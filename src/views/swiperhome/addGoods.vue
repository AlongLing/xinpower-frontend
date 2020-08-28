<template>
  <div>
    <el-form ref="form" :model="newGoods" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="newGoods.name" placeholder="请输入商品名称和描述"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="newGoods.price" placeholder="请输入商品价格 格式：9999"></el-input>
      </el-form-item>
      <el-form-item label="轮播图片">
        <div>
          <div class="filter-container">
            <el-upload
            class="upload-demo"
            action="http://localhost:3000/swiper/uploadSwiperPicture"
            :on-success="uploadSwiperPictureSuccess"
            :disabled="swiperDisabled"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">{{swiperBtnText}}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且只能上传一张</div>
          </el-upload>
          </div>
           <el-table v-loading="firstPictureLoading" :data="swiperPicture" stripe style="width: 100%">
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
            action="http://localhost:3000/swiper/uploadBigPicture"
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
            action="http://localhost:3000/swiper/uploadDetailPicture"
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
        <el-button type="primary" @click="onSwiperGoodsSubmit">确定</el-button>
        <el-button @click="onSwiperGoodsCancel">取消</el-button>
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
import { fetchSwiperHomeList, fetchBigPictureList, fetchDetailPictureList, del, fetchNewGoods } from '@/api/swiper'
export default {
  data() {
    return {
      newGoods: {
        name: "",
        price: "",
      },
      swiperDisabled: false,
      swiperBtnText: '点击上传',
      swiperPicture: [],                                           // 这里用数组其实只是匹配格式，实际只用到了第一个对象
      firstPictureLoading: false,
      bigPictureLoading: false,
      detailPictureLoading: false,
      swiperPictureId: '',                                          // 这个是上传之后的轮播图id
      bigPictureList: [],                                           // 商品大图列表
      detailPictureList: [],                                         // 商品详情图片
      deletePicture: {},                                             // 待删除的图片对象
      delDialogVisible: false,
      currentDeleteType: 0,                                          // 当前删除的图片类型，0：无类型，默认值；1：轮播图；2：商品大图；3：商品详情图片
      deletePictureTips: ''
    }
  },
  methods: {
    getSwiperHomeList() {
      this.firstPictureLoading = true
      fetchSwiperHomeList().then((res) => {
        console.log(res)
        const swiperHomeList = res.data                  // swiperHomeList 是一个数组
        this.firstPictureLoading = false
         console.log(`swiperHomeList = ${swiperHomeList}`)
         console.log(`swiperHomeList[0] = ${swiperHomeList[0]}`)
         console.log(`swiperHomeList[0].download_url = ${swiperHomeList[0].download_url}`)
         for (let i = 0; i < swiperHomeList.length; i++) {
           if (swiperHomeList[i]._id == this.swiperPictureId) {
             console.log('找到了刚上传的图片')
             this.swiperPicture.push(swiperHomeList[i])
             console.log(`i = ${i}`)
             console.log(`swiperPicture = ${this.swiperPicture[0]}`)
             console.log(`swiperPicture.download_url = ${this.swiperPicture[0].download_url}`)
           }
         }
      })
    },
    getBigPictureList() {
      this.bigPictureLoading = true
      console.log(`getBigPictureList swiperPictureId = ${this.swiperPictureId}`)
      console.log(`swiperPictureId type = ${Object.prototype.toString.call(this.swiperPictureId)}`)
      const swiperPictureId = (this.swiperPictureId).toString()
      console.log(`swiperPictureId = ${swiperPictureId}`)
      console.log(`swiperPictureId type = ${Object.prototype.toString.call(swiperPictureId)}`)
      fetchBigPictureList({
        swiperPicId: swiperPictureId
      }).then((res) => {
        console.log(`getBigPictureList res = ${res}`)
        console.log(`getBigPictureList res.data = ${res.data}`)
        this.bigPictureList = res.data
        this.bigPictureLoading = false
      })
    },
    getDetailPictureList() {
      this.detailPictureLoading = true
      const swiperPictureId = (this.swiperPictureId).toString()
      fetchDetailPictureList({
        swiperPicId: swiperPictureId
      }).then((res) => {
        this.detailPictureList = res.data
        this.detailPictureLoading = false
      })
    },
    uploadSwiperPictureSuccess(res) {
      if (res.id_list.length > 0) {
        this.alertMessage(1, '删除成功')
        /**
         * 这里返回的就是上传成功之后返回的数据库集合中的图片_id
         * 根据这个_id再查找并将图片显示在界面上
         */
        this.swiperPictureId = res.id_list
        console.log(`res.id_list = ${res.id_list}`)
        this.getSwiperHomeList()
        // 将上传按钮设置为不可用
        this.swiperDisabled = true
        this.swiperBtnText = '已上传'
      }
    },
    uploadBigPictureSuccess(res) {
      // 上传商品大图成功之后的回调函数
      console.log(`uploadBigPictureSuccess = ${res.id_list}`)              // 这个数据返回为空，这里是更新，不同于上面的新增，也可以用swiperPictureId 来获取上传之后的大图id
      this.getBigPictureList()
    },
    uploadDetailPictureSuccess(res) {
      // 上传商品详情图片成功之后的回调函数
      console.log(`uploadDetailPictureSuccess = ${res.id_list}`)
      this.getDetailPictureList()
    },
    // 删除轮播图片，也就是删除刚新建的这个商品的所有信息，包括首页图，大图，详情图片
    onFirstPictureDelete(row) {
      this.deletePicture = row
      console.log(`onDetail deletePicture = ${JSON.stringify(this.deletePicture)}`)
      this.delDialogVisible = true
      this.currentDeleteType = 1
      this.deletePictureTips = '警告!!! 删除轮播图片将删除该商品的全部信息，请慎重选择'
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
    // 删除对话框确定按钮
    doDelete() {
      this.delDialogVisible = false
      const currentDeleteType = this.currentDeleteType
      const deletePicture = this.deletePicture
      const deletePictureId = (this.swiperPictureId).toString()
      if (currentDeleteType == 1) {
        // 删除轮播图片，将直接删除欲新增的该商品
        this.firstPictureLoading = true
        del({
          deletePic: deletePicture,
          deleteType: currentDeleteType,
          deletePictureId: deletePictureId,
        }).then((res) => {
          this.firstPictureLoading = false 
          this.getSwiperHomeList()
          this.getBigPictureList()
          this.getDetailPictureList()
          this.swiperPicture = []
          this.alertMessage(1, '删除成功')
          this.swiperDisabled = false
          this.swiperBtnText = '点击上传'
          // 回到轮播商品列表页面
          this.$router.push('/swiper/homelist')
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
      }
    },
    // 删除对话框取消按钮
    doCancel() {
      this.delDialogVisible = false
      this.currentDeleteType = 0
    },
    // 新增商品最终确定按钮
    onSwiperGoodsSubmit() {
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
      if (this.swiperPicture.length == 0) {
        this.alertMessage(2, '轮播图片不能为空')
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
      const swiperPictureId = (this.swiperPictureId).toString()
      fetchNewGoods({
        swiperPicId: swiperPictureId,
        name: goodsName,
        price: goodsPrice,
      }).then((res) => {
        console.log(`res.data.length = ${res.data.length}`)
        this.alertMessage(1, '新增商品成功')
        this.$router.push('/swiper/homelist')
      })

    },
    // 新增商品最终取消按钮
    onSwiperGoodsCancel() {
      const deletePictureId = (this.swiperPictureId).toString()
      if (deletePictureId != null && deletePictureId != undefined && deletePictureId != '') {
        del({
          deletePic: this.deletePicture,
          deleteType: 1,
          deletePictureId: deletePictureId
        }).then((res) => {
          this.$router.push('/swiper/homelist')
        })
      } else {
        this.$router.push('/swiper/homelist')
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
.add-new-type {
  width: 200px;
  margin-left: 300px;
}

.add-new-type-btn {
  margin-left: 50px;
}
</style>
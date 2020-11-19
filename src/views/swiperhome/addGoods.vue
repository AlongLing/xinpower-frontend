<template>
  <div>
    <el-form ref="form" :model="newGoods" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="newGoods.name" placeholder="请输入商品名称和描述"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="newGoods.price" placeholder="请输入商品价格 格式：9999"></el-input>
      </el-form-item>
      <el-form-item label="商品类型">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">电子数码</el-checkbox>
          <el-checkbox label="2">养生达人</el-checkbox>
          <el-checkbox label="3">商务差旅</el-checkbox>
          <el-checkbox label="4">运动健康</el-checkbox>
          <el-checkbox label="5">休闲娱乐</el-checkbox>
          <el-checkbox label="6">专属定制</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="newGoods.brand" placeholder="请输入商品品牌"></el-input>
      </el-form-item>
      <el-form-item label="型号">
        <el-input v-model="newGoods.model" placeholder="请输入商品型号"></el-input>
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="newGoods.specification" placeholder="请输入商品规格"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="newGoods.description" placeholder="请输入商品描述"></el-input>
      </el-form-item>
      <el-form-item label="商品首图">
        <div>
          <div class="filter-container">
            <el-upload
            class="upload-demo"
            action="http://localhost:3000/swiper/uploadFirstPicture"
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
      <el-form-item label="商品小图">
        <div>
          <div class="filter-container">
            <el-upload
            class="upload-demo"
            action="http://localhost:3000/swiper/uploadSmallPicture"
            :on-success="uploadSmallPictureSuccess"
            :disabled="smallPictureDisabled"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">{{smallPictureBtnText}}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且只能上传一张</div>
          </el-upload>
          </div>
           <el-table v-loading="smallPictureLoading" :data="smallPicture" stripe style="width: 100%">
            <el-table-column label="图片" width="400">
              <template slot-scope="scope">
                <img :src="scope.row.download_url" alt height="50" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onsmallPictureDelete(scope.row)">删除</el-button>
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
import { fetchFirstPictureList, fetchBigPictureList, del, fetchNewGoods, fetchSmallPictureList } from '@/api/swiper'
import { fetchGoodsTypeList } from '@/api/goods'
export default {
  data() {
    return {
      newGoods: {
        name: "",
        price: "",
        brand: "",                      // 品牌
        model: "",                      // 型号
        specification: "",              // 规格
        description: ""                 // 描述
      },
      FirstPictureDisabled: false,
      FirstPictureBtnText: '点击上传',
      firstPicture: [],                                           // 这里用数组其实只是匹配格式，实际只用到了第一个对象
      firstPictureLoading: false,
      bigPictureLoading: false,
      goodsId: '',                                // 新增商品的id
      bigPictureList: [],                                           // 商品大图列表
      deletePicture: {},                                             // 待删除的图片对象
      delDialogVisible: false,
      currentDeleteType: 0,                                          // 当前删除的图片类型，0：无类型，默认值；1：轮播图；2：商品大图；3：商品详情图片
      deletePictureTips: '',
      goodsTypeList: [],                          // 商品分类列表数据
      smallPictureDisabled: false,
      smallPictureBtnText: '点击上传',
      smallPictureLoading: false,
      smallPicture: [],                             // 这里用数组其实只是匹配格式，实际只用到了第一个对象
      checkList: []                                 // 用户勾选的商品分类
    }
  },

  created() {
    // 获取商品的分类列表数据
    fetchGoodsTypeList().then((res) => {
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

// 获取商品小图列表，其实只有一张图片
    getSmallPictureList() {
      this.smallPictureLoading = true
      fetchSmallPictureList({
        goodsId: this.goodsId
      }).then((res) => {
        this.smallPicture = res.data
        this.smallPictureLoading = false
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

    uploadFirstPictureSuccess(res) {
      if (res.id_list.length > 0) {
        this.alertMessage(1, '上传成功')
        this.goodsId = (res.id_list).toString()
        this.getFirstPictureList()
        // 将上传按钮设置为不可用
        this.FirstPictureDisabled = true
        this.FirstPictureBtnText = '已上传'
      }
    },

    uploadSmallPictureSuccess(res) {
      this.alertMessage(1, '上传成功')
      this.getSmallPictureList()
      // 将上传按钮设置为不可用
      this.smallPictureDisabled = true
      this.smallPictureBtnText = '已上传'
    },

    uploadBigPictureSuccess(res) {
      // 上传商品大图成功之后的回调函数
      console.log(`uploadBigPictureSuccess = ${res.id_list}`)              // 这个数据返回为空，这里是更新，不同于上面的新增，也可以用swiperPictureId 来获取上传之后的大图id
      this.getBigPictureList()
    },
    // 删除轮播图片，也就是删除刚新建的这个商品的所有信息，包括首页图，大图，详情图片
    onFirstPictureDelete(row) {
      this.deletePicture = row
      this.delDialogVisible = true
      this.currentDeleteType = 1
      this.deletePictureTips = '警告!!! 删除轮播图片将删除该商品的全部信息，请慎重选择'
    },

    // 删除商品小图(后来添加的代码，所以标志位为 3，这里没错)
    onsmallPictureDelete(row) {
      this.deletePicture = row
      this.delDialogVisible = true
      this.currentDeleteType = 3
      this.deletePictureTips = '确定删除该图片吗?'
    },

    // 删除商品大图
    onBigPictureDelete(row) {
      this.deletePicture = row
      this.delDialogVisible = true
      this.currentDeleteType = 2
      this.deletePictureTips = '确定删除该图片吗?'
    },
    // 删除对话框确定按钮
    doDelete() {
      this.delDialogVisible = false
      const currentDeleteType = this.currentDeleteType
      const deletePicture = this.deletePicture
      const goodsId = this.goodsId
      if (currentDeleteType == 1) {
        // 删除轮播图片，将直接删除欲新增的该商品
        this.firstPictureLoading = true
        del({
          deletePic: deletePicture,
          deleteType: currentDeleteType,
          deleteGoodsId: goodsId,
        }).then((res) => {
          this.firstPictureLoading = false 
          this.getFirstPictureList()
          this.getSmallPictureList()
          this.getBigPictureList()
          this.firstPicture = []
          this.alertMessage(1, '删除成功')
          this.FirstPictureDisabled = false
          this.FirstPictureBtnText = '点击上传'
          this.smallPictureDisabled = false
          this.smallPictureBtnText = '点击上传'
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
        // 删除商品小图
        this.smallPictureLoading = true
        del({
          deletePic: deletePicture,
          deleteType: currentDeleteType
        }).then((res) => {
          this.smallPictureLoading = false
          this.getSmallPictureList()
          this.alertMessage(1, '删除成功')
          // 将上传按钮设置为不可用
          this.smallPictureDisabled = false
          this.smallPictureBtnText = '点击上传'
        })
      } else {
        // do nothing
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
      const brand = this.newGoods.brand
      const model = this.newGoods.model
      const specification = this.newGoods.specification
      const description = this.newGoods.description
      const checkList = this.checkList
      var goodsTypeId = ''
      if (goodsName == '') {
        this.alertMessage(2, '商品名称不能为空')
        return
      }
      if (goodsPrice == '') {
        this.alertMessage(2, '商品价格不能为空')
        return
      }
      if (checkList.length === 0) {
        this.alertMessage(2, '请选择商品类型')
        return
      } else {
        for (let i = 0; i < checkList.length; i++) {
          const typeId = JSON.parse(this.goodsTypeList[parseInt(checkList[i])])._id
          console.log(`onGoodsSubmit typeId = ${typeId}`)
          if (i === (checkList.length - 1)) {
            goodsTypeId = goodsTypeId + typeId
          } else {
            goodsTypeId = goodsTypeId + typeId + ','
          }
        }
      }
      if (brand == "") {
        this.alertMessage(2, '商品品牌不能为空')
        return
      }
      if (model == "") {
        this.alertMessage(2, '商品型号不能为空')
        return
      }
      if (specification == "") {
        this.alertMessage(2, '商品规格不能为空')
        return
      }
      if (description == "") {
        this.alertMessage(2, '商品描述不能为空')
        return
      }
      if (this.firstPicture.length == 0) {
        this.alertMessage(2, '商品首图不能为空')
        return
      }
      if (this.smallPicture.length === 0) {
        this.alertMessage(2, '商品小图不能为空')
        return
      }
      if (this.bigPictureList.length == 0) {
        this.alertMessage(2, '商品大图不能为空')
        return
      }
      fetchNewGoods({
        goodsId: this.goodsId,
        name: goodsName,
        price: goodsPrice,
        typeId: goodsTypeId,
        brand: brand,
        model: model,
        specification: specification,
        description: description
      }).then((res) => {
        this.alertMessage(1, '新增商品成功')
        this.$router.push('/swiper/homelist')
      })

    },
    // 新增商品最终取消按钮
    onSwiperGoodsCancel() {
      const goodsId = this.goodsId
      if (goodsId != null && goodsId != undefined && goodsId != '') {
        del({
          deletePic: this.deletePicture,
          deleteType: 1,
          deleteGoodsId: goodsId,
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
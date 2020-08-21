<template>
  <div>
    <el-form ref="form" :model="newGoods" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="newGoods.name" placeholder="请输入商品名称和描述"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="newGoods.price" placeholder="请输入商品价格 格式：9999"></el-input>
      </el-form-item>
      <el-form-item label="商品分类">
        <el-select v-model="newGoods.type" placeholder="请选择商品分类">
          <el-option label="户外" value="shanghai"></el-option>
          <el-option label="数码" value="beijing"></el-option>
          <el-option label="健康" value="beijing"></el-option>
        </el-select>
        <el-input class="add-new-type" placeholder="新增商品分类"></el-input>
        <el-button type="primary" class="add-new-type-btn" @click="onCancel">新增分类</el-button>
      </el-form-item>
      <el-form-item label="轮播图片">
        <div>
          <div class="filter-container">
            <el-upload
            class="upload-demo"
            action="http://localhost:3000/swiper/uploadSwiperPicture"
            :on-success="uploadSwiperPictureSuccess"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且只能上传一张</div>
          </el-upload>
          </div>
           <el-table v-loading="loading" :data="swiperPicture" stripe style="width: 100%">
            <el-table-column label="图片" width="400">
              <template slot-scope="scope">
                <img :src="scope.row.download_url" alt height="50" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
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
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，推荐3到5张商品大图</div>
          </el-upload>
          </div>
          <el-table v-loading="loading" :data="bigPictureList" stripe style="width: 100%">
            <el-table-column label="图片" width="400">
              <template slot-scope="scope">
                <img :src="scope.row.download_url" alt height="50" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchSwiperHomeList } from '@/api/swiper'
export default {
  data() {
    return {
      newGoods: {
        name: "",
        price: "",
        type: "",
      },
      swiperPicture: [],                                           // 这里用数组其实只是匹配格式，实际只用到了第一个对象
      loading: false,
      swiperPictureId: ''                                          // 这个是上传之后的轮播图id
    }
  },
  methods: {
    getSwiperHomeList() {
      this.loading = true
      fetchSwiperHomeList().then((res) => {
        console.log(res)
        const swiperHomeList = res.data                  // swiperHomeList 是一个数组
        this.loading = false
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
    uploadSwiperPictureSuccess(res) {
      if (res.id_list.length > 0) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        /**
         * 这里返回的就是上传成功之后返回的数据库集合中的图片_id
         * 根据这个_id再查找并将图片显示在界面上
         */
        this.swiperPictureId = res.id_list
        console.log(`res.id_list = ${res.id_list}`)
        this.getSwiperHomeList()
      }
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
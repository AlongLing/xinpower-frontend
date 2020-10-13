<template>
  <div class="upload-picture">
    <div class="filter-container">
      <el-upload
      class="upload-demo"
      action="http://localhost:3000/vphoto/uploadPicture"
      :on-success="uploadPictureSuccess"
      :show-file-list="false"
      >
      <el-button size="small" type="primary">点击上传图片</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
    </el-upload>
    </div>
    <el-table v-loading="pictureLoading" :data="pictureList" stripe style="width: 100%">
      <el-table-column label="图片" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="100" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onBigPictureDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchPictureListById, updateVphotoId } from '@/api/vphoto'
  export default {
    data() {
      return {
        pictureList: [],                                         // 活动图片列表
        pictureLoading: false,
        vphotoId: ''
      }
    },

    created() {
      this.vphotoId = this.$route.params.id
      // 更新后台的 vphoto id 的值
      updateVphotoId({
        vphotoId: this.vphotoId
      }).then((res) => {
        // 更新 vphoto id 成功
      })
      this.getPictureListById()
    },

    methods: {
      getPictureListById() {
        this.pictureLoading = true
        // 根据 vphoto id 查找 vphoto 实例
        fetchPictureListById({
          id: this.vphotoId
        }).then((res) => {
          this.pictureList = res.data
          this.pictureLoading = false

        })
      },
      // 上传图片成功的回调
      uploadPictureSuccess(res) {
        console.log(`uploadPictureSuccess = ${res.id_list}`)
        this.getPictureListById()
      }
    }
  }
</script>

<style>
  .upload-picture {
    margin-top: 10px;
    margin-left: 20px;
  }
</style>
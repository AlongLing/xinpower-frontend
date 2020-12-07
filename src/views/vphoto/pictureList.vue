<template>
  <div>
    <div>
      <el-form ref="form" :model="picture" label-width="80px">
        <el-form-item label="图片宽度">
          <el-input v-model="picture.pictureWidth" placeholder="横屏图片：宽：500；竖屏图片：宽300"></el-input>
        </el-form-item>
        <el-form-item label="图片高度">
          <el-input v-model="picture.pictureHeight" placeholder="横屏图片：高：300；竖屏图片：高：500" type="number"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <div class="filter-container">
            <el-upload
              class="upload-demo"
              action="http://localhost:3000/vphoto/uploadPicture"
              :on-success="uploadPictureSuccess"
              :disabled="pictureDisabled"
              :show-file-list="false"
              >
              <el-button size="small" type="primary">{{pictureUploadText}}</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div class="upload-btn-container">
        <el-button type="primary" @click="onPictureSubmit">确定</el-button>
        <el-button @click="onPictureCancel">取消</el-button>
      </div>
    </div>
    <el-table v-loading="pictureLoading" :data="pictureList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="图片" width="600">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="100" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onPictureDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该图片吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doCancel">取 消</el-button>
        <el-button type="primary" @click="doDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPictureListById, updateVphotoId, updatePictureInfo, del } from '@/api/vphoto'
  export default {
    data() {
      return {
        pictureList: [],                                         // 活动图片列表
        pictureLoading: false,
        vphotoId: '',
        picture: {
          pictureWidth: '',
          pictureHeight: ''
        },
        pictureDisabled: false,
        pictureUploadText: '点击上传图片',
        delDialogVisible: false,
        deletePicture: {}                                        // 待删除的图片对象
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
        // 根据 vphoto id 查找 vphoto 实例的图片列表
        fetchPictureListById({
          id: this.vphotoId
        }).then((res) => {
          this.pictureList = []
          const list = res.data
          console.log(`fetchPictureListById list.length = ${list.length}`)
          var listTemp = []
          for (let i = list.length - 1; i >= 0; i--) {
            listTemp.push(list[i])
          }
          this.pictureList = listTemp
          this.pictureLoading = false

        })
      },
      // 上传图片成功的回调
      uploadPictureSuccess(res) {
        console.log(`uploadPictureSuccess = ${JSON.stringify(res)}`)
        this.pictureDisabled = true
        this.pictureUploadText = '已上传'
      },
      // 确定
      onPictureSubmit() {
        const width = this.picture.pictureWidth
        const height = this.picture.pictureHeight
        if (width == '') {
          this.$message({
            message: '请输入图片宽度',
            type: 'warning'
          })
          return
        }
        if (height == '') {
          this.$message({
            message: '请输入图片高度',
            type: 'warning'
          })
          return
        }
        // 结合图片宽度和高度数据，插入一条图片数据
        updatePictureInfo({
          pictureWidth: parseInt(width),
          pictureHeight: parseInt(height)
        }).then((res) => {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.pictureDisabled = false
          this.pictureUploadText = '点击上传图片'
          this.getPictureListById()
        })
      },
      // 取消
      onPictureCancel() {

      },
      // 删除按钮
      onPictureDelete(row) {
        this.deletePicture = row
        this.delDialogVisible = true 
      },
      // 对话框取消按钮
      doCancel() {
        this.delDialogVisible = false
      },
      // 对话框确定按钮
      doDelete() {
       this.delDialogVisible = false
       del({
         vphotoId: this.vphotoId,
         deletePic: this.deletePicture
       }).then((res) => {
         this.getPictureListById()
         this.$message({
            message: '删除成功',
            type: 'success'
          })
       }) 
      }
    }
  }
</script>

<style>
  .upload-btn-container {
    margin-left: 13px;
  }
</style>
<template>
  <div>
      <el-form ref="form" :model="vphoto" label-width="80px">
        <el-form-item label="活动主题">
            <el-input v-model="vphoto.name" placeholder="请输入活动主题"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
            <el-date-picker
                v-model="vphoto.date"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="活动海报">
          <div>
            <div class="filter-container">
              <el-upload
              class="upload-demo"
              action="http://localhost:3000/vphoto/uploadPoster"
              :on-success="uploadPosterSuccess"
              :disabled="uploadDisabled"
              :show-file-list="false"
            >
              <el-button size="small" type="primary">{{uploadPosterText}}</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且只能上传一张</div>
            </el-upload>
            </div>
            <el-table v-loading="posterLoading" :data="vphotoPicture" stripe style="width: 100%">
              <el-table-column label="图片" width="400">
                <template slot-scope="scope">
                  <img :src="scope.row.download_url" alt height="50" />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="onPosterDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onVphotoSubmit">确定</el-button>
            <el-button @click="onVphotoCancel">取消</el-button>
        </el-form-item>
      </el-form>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该海报图片吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doCancel">取 消</el-button>
        <el-button type="primary" @click="doDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateVphotoById, fetchVphotoById, deleteVphotoById } from '@/api/vphoto'
export default {
  data() {
    return {
      vphoto: {                                        // 单个 vphoto 实例，包含活动主题，活动日期，活动图片列表
        name: '',                                      // 活动主题
        date: ''                                      // 活动日期
      },
      uploadDisabled: false,
      uploadPosterText: '点击上传',
      posterLoading: false,
      vphotoPicture: [],                                // 这里用数组其实只是匹配格式，实际只用到了第一个对象
      delDialogVisible: false,
      deleteVphoto: {},                                  // 待删除的活动
      vphotoId: ''                                       // 新创建的vphoto的_id
    }
  },

  created() {
  },

  methods: {
    // 上传海报成功
    uploadPosterSuccess(res) {
      this.posterLoading = true
      this.uploadDisabled = true
      this.uploadPosterText = '已上传'
      this.vphotoId = res.data.id_list[0]
      console.log(`uploadPosterSuccess this.vphotoId = ${this.vphotoId}`)
      // 根据id查找对应的vphoto，显示海报图片
      fetchVphotoById({
        vphotoId: this.vphotoId
      }).then((res) => {
        this.vphotoPicture = res.data
        this.posterLoading = false
      })
    },
    // 海报删除按钮
    onPosterDelete(row) {
      this.deleteVphoto = row
      this.delDialogVisible = true
    },
    // 保存新增的活动信息
    onVphotoSubmit() {
      const name = this.vphoto.name
      const date = Date.parse(this.vphoto.date)
      const uploadDisabled = this.uploadDisabled
      console.log(`onVphotoSubmit name = ${name}, date = ${date}`)
      if (name == '') {
        this.$message({
          message: '活动主题不能为空',
          type: 'warning'
        })
        return
      }
      if (date == '') {
        this.$message({
          message: '请选择活动日期',
          type: 'warning'
        })
        return
      }
      if (!uploadDisabled) {
        this.$message({
          message: '请上传活动海报',
          type: 'warning'
        })
        return
      } else {
        updateVphotoById({
          vphotoId: this.vphotoId,
          name: name,
          date: date
        }).then((res) => {
          this.$message({
            message: '新增活动成功',
            type: 'success'
          })
          this.$router.push('/vphoto/vphotoMenu')
        })
      }
    },
    // 取消
    onVphotoCancel() {
      if (this.uploadDisabled) {
        // 需要删除刚刚新创建的活动
        deleteVphotoById({
          vphotoId: this.vphotoId,
          deleteVphoto: this.vphotoPicture[0]
        }).then((res) => {
          this.$router.push('/vphoto/vphotoMenu')
        })
      } else {
        this.$router.push('/vphoto/vphotoMenu')
      }
    },
    // 删除对话框确认按钮
    doDelete() {
      this.posterLoading = true
      console.log(`doDelete this.deleteVphoto = ${JSON.stringify(this.deleteVphoto)}`)
      deleteVphotoById({
        vphotoId: this.vphotoId,
        deleteVphoto: this.deleteVphoto
      }).then((res) => {
        this.uploadDisabled = false
        this.uploadPosterText = '点击上传'
        this.vphotoPicture = []
        this.posterLoading = false
        this.delDialogVisible = false
      })
    },
    // 对话框取消按钮
    doCancel() {
      this.delDialogVisible = false
    }
  }
}
</script>

<style>
</style>
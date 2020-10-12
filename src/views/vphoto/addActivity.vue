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
        <el-form-item>
            <el-button type="primary" @click="onVphotoSubmit">确定</el-button>
            <el-button @click="onVphotoCancel">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { fetchAddVphoto } from '@/api/vphoto'
export default {
  data() {
    return {
      vphoto: {                                        // 单个 vphoto 实例，包含活动主题，活动日期，活动图片列表
        name: '',                                      // 活动主题
        date: ''                                       // 活动日期
      }
    }
  },

  created() {
  },

  methods: {
      // 保存新增的活动信息
      onVphotoSubmit() {
        const name = this.vphoto.name
        const date = Date.parse(this.vphoto.date)
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
        fetchAddVphoto({
          name: name,
          date: date
        }).then((res) => {
          this.$message({
            message: '新增活动成功',
            type: 'success'
          })
          this.$router.push('/vphoto/vphotoMenu')
        })
      },
      // 取消
      onVphotoCancel() {
        this.$router.push('/vphoto/vphotoMenu')
      }
  }
}
</script>

<style>
</style>
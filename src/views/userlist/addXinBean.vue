<template>
    <div>
    <el-form ref="form" :model="user" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="user.userName" :disabled="true" type="text"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="user.telephone" :disabled="true" type="number"></el-input>
      </el-form-item>
      <el-form-item label="是否注册">
        <el-input v-model="hasRegister" :disabled="true" type="text"></el-input>
      </el-form-item>
      <el-form-item label="当前鑫豆">
        <el-input v-model="user.score" :disabled="true" type="number"></el-input>
      </el-form-item>
      <el-form-item label="新增鑫豆">
        <el-input placeholder="0" v-model="addScore" clearable type="number"></el-input>
      </el-form-item>
      <el-form-item label="新增说明">
        <el-input placeholder="简短描述新增鑫豆的理由" v-model="reason" clearable type="text"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
        <p class="delete-btn"><el-button @click="onDelete" type="danger">删除</el-button></p>
      </el-form-item>
    </el-form>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该用户吗，请慎重!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="doDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserById, updateScoreById, deleteUser } from '@/api/userlist'
export default {
  data() {
    return {
      hasRegister: '否',
      user: {},
      reason: '',
      addScore: 0,
      delDialogVisible: false,                                              // 决定是否显示删除对话框
    }
  },
  created() {
    fetchUserById({
      id: this.$route.params.id,
    }).then((res) => {
      this.user = res.data
      if (this.user.hasRegister) {
        this.hasRegister = '是'
      } else {
        this.hasRegister = '否'
      }
    })
  },
  methods: {
    onSubmit() {
      const indateYear = new Date(this.user.indate).getFullYear()
      const currentYear = new Date().getFullYear()
      const currentTime = Date.parse(new Date())
      const record = '+' + parseInt(this.addScore)
      var lastYearScore = this.user.lastYearScore

      if (currentYear < indateYear) {
        // 当前是上一年，需要记录增加的积分
        lastYearScore = lastYearScore + parseInt(this.addScore)
      }

      const score = parseInt(this.user.score) + parseInt(this.addScore)
      const reason = this.reason
      if (reason === '' || reason === undefined) {
        this.$message({
            message: '请填写新增鑫豆的理由',
            type: 'warning'
        })
      } else {
        updateScoreById({
          id: this.user._id,
          score: score,
          lastYearScore: lastYearScore,
          currentTime: currentTime,
          reason: reason,
          record: record
        }).then((res) => {
          if (res.code === 20000) {
            this.$message({
                  message: '更新成功',
                  type: 'success'
              })
          } else {
            this.$message.error('更新失败')
          }
          this.addScore = 0
          this.reason = ''
          this.$router.push('/user/userlist')
        })
      }
    },
    
    onCancel() {
      this.$router.push('/user/userlist')
    },

    onDelete() {
      this.delDialogVisible = true
    },

    // 对话框中确认删除
    doDelete() {
      deleteUser({
        id: this.user._id,
      }).then((res) => {
        this.delDialogVisible = false
        if(res.data.deleted > 0) {
          console.log(`删除成功: ${res.data.deleted}`)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
        this.$router.push('/user/userlist')
      })
    }
  },
}
</script>

<style>
  .delete-btn {
    margin-left: 1100px;
  }

</style>
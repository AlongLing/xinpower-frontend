<template>
    <div>
    <el-form ref="form" :model="user" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="user.userName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="user.telephone" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="是否注册">
        <el-input v-model="user.hasRegister" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="可用积分">
        <el-input v-model="user.score" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="新增积分">
        <el-input placeholder="0" v-model="addScore" clearable></el-input>
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
import { fetchUserById, updateScore, deleteUser } from '@/api/userlist'
export default {
  data() {
    return {
      user: {},
      addScore: 0,
      delDialogVisible: false,                                              // 决定是否显示删除对话框
    }
  },
  created() {
    fetchUserById({
      id: this.$route.params.id,
    }).then((res) => {
      console.log(res)
      this.user = res.data
    })
  },
  methods: {
    onSubmit() {
      console.log(`score = ${this.user.score}, addScore = ${this.addScore}`)
      const total = parseInt(this.user.score) + parseInt(this.addScore)
      console.log(`total = ${total}`)
      updateScore({
        id: this.$route.params.id,
        score: total,
      }).then((res) => {
        if(res.data.modified > 0){
              this.$message({
                  message: '更新成功',
                  type: 'success'
              })
          }else{
              this.$message.error('更新失败')
          }
          this.$router.push('/user/userlist')
      })
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
        id: this.$route.params.id,
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
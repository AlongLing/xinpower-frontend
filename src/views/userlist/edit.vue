<template>
    <div>
    <el-form ref="form" :model="user" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="user.userName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="user.telephone" :disabled="true"></el-input>
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
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchUserById, updateScore } from '@/api/userlist'
export default {
    data() {
    return {
      user: {},
      addScore: 0,
    };
  },
  created() {
    fetchUserById({
      id: this.$route.params.id,
    }).then((res) => {
      console.log(res);
      this.user = res.data;
    });
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
  },
}
</script>

<style>

</style>
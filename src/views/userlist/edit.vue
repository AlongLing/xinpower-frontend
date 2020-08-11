<template>
    <div>
    <el-form ref="form" :model="user" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="user.userName"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="user.telephone"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchUserById } from '@/api/userlist'
export default {
    data() {
    return {
      user: {},
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
}
</script>

<style>

</style>
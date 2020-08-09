<template>
  <div>
    <el-table v-loading="loading" :data="userlist" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="telephone" label="电话号码"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该歌单吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList } from '@/api/userlist'
import scroll from '@/utils/scroll'

export default {
  data() {
    return {
      userlist: [],
      count: 50,
      loading: false,
      // 删除用户的对话框是否显示
      delDialogVisible: false,
      info: {}
    }
  },

  created() {
    this.getUserList()
  },

  mounted() {
    scroll.start(this.getUserList)
  },

  methods: {
    getUserList() {
      this.loading = true
      fetchUserList({
        start: this.userlist.length,
        count: this.count
      }).then((res) => {
        console.log(res)           // 获取到所有的用户数据
        this.userlist = this.userlist.concat(res.data)
        if (res.data.length < this.count) {                      // 当上拉回调的数据量小于 count 值时，说明数据全部请求完了，就不需要再请求了
          scroll.end()
        }
        this.loading = false
      })
    }
  },
}
</script>

<style>

</style>

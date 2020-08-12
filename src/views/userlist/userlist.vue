<template>
  <div>
    <el-row>
      <el-col :span="4" class="input-telephone"><el-input placeholder="请输入电话号码" v-model="addTelephone" clearable></el-input></el-col>
      <el-col :span="4" class="input-button"><el-button type="primary" icon="el-icon-zoom-in" @click="addUser()">新增营员</el-button></el-col>
      <el-col :span="4" class="input-telephone"><el-input placeholder="请输入电话号码" v-model="searchTelephone" clearable></el-input></el-col>
      <el-col :span="4" class="input-button"><el-button type="primary" icon="el-icon-search">查找营员</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="userlist" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="telephone" label="电话号码"></el-table-column>
      <el-table-column prop="score" label="可使用积分"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="onDel(scope.row)">查看详情</el-button>
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
import { fetchUserList, fetchUserByTelephone, addUser } from '@/api/userlist'                          // 导入对应的 api 的函数
import scroll from '@/utils/scroll'

export default {
  data() {
    return {
      userlist: [],
      count: 50,
      loading: false,
      // 删除用户的对话框是否显示
      delDialogVisible: false,
      info: {},
      addTelephone: ''
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
    },

    addUser() {
      const phone = this.addTelephone
      if(phone.length != 11) {
        alert('电话号码格式不对')
      } else {
        console.log(`新增号码为: ${this.addTelephone}`)
        fetchUserByTelephone({                                  // 根据输入的电话号码查找该电话号码是否已存在
          telephone: phone
        }).then((res) => {
          if(res.data.length === 0) {
            console.log('当前号码未注册')
            // 插入这条记录
            addUser({
              telephone: phone
            }).then((res) => {
              if(res.code == 20000) {                           // 这个判断存疑
                alert('新增营员成功')
                this.addTelephone = ''
                // 重新刷新列表数据
                this.getUserList()
              } else {
                alert('新增失败，请重新尝试')
              }
            })
          } else {
            console.log('当前号码已注册')
            alert('当前号码已存在')
          }
        })
      }
    },

    onEdit(row) {
      this.$router.push(`/user/edit/${row._id}`)              // 跳转到对应路由的页面
    },
  },
}
</script>

<style>
  .input-telephone {
    margin-left: 50px;
    margin-right: 50px;
    margin-top: 20px;
  }

  .input-button {
    margin-top: 20px;
  }
</style>

<template>
  <div>
    <el-row>
      <el-col :span="4" class="input-telephone"><el-input placeholder="请输入电话号码" v-model="addTelephone" clearable></el-input></el-col>
      <el-col :span="4" class="input-button"><el-button type="primary" icon="el-icon-zoom-in" @click="addUser()">新增营员</el-button></el-col>
      <el-col :span="4" class="input-telephone"><el-input placeholder="请输入电话号码" v-model="searchTelephone" clearable></el-input></el-col>
      <el-col :span="4" class="input-button"><el-button type="primary" icon="el-icon-search" @click="findUser()">查找营员</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="userlist" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="230"></el-table-column>
      <el-table-column prop="telephone" label="电话号码" width="230"></el-table-column>
      <el-table-column prop="score" label="可使用积分" width="230"></el-table-column>
      <el-table-column prop="growthValue" label="当前成长值" width="230"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="onAddXinBean(scope.row)">新增鑫豆</el-button>
          <el-button size="mini" @click="onAddGrowthValue(scope.row)">新增成长值</el-button>
          <el-button size="mini" type="primary" @click="onUserDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { fetchUserList, fetchUserByTelephone, addUser, updateUserIndateById, updateScoreById } from '@/api/userlist'                          // 导入对应的 api 的函数
import scroll from '@/utils/scroll'

export default {
  data() {
    return {
      userlist: [],
      count: 50,
      loading: false,
      addTelephone: '',
      searchTelephone: ''
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
        this.userlist = this.userlist.concat(res.data)
        if (res.data.length < this.count) {                      // 当上拉回调的数据量小于 count 值时，说明数据全部请求完了，就不需要再请求了
          scroll.end()
        }
        this.loading = false
        this.updateUserInfo()
      })
    },

    // 用户有效期到了时更新用户信息
    async updateUserInfo() {
      const userlist = this.userlist
      const currentTime = Date.parse(new Date())
      const currentYear = new Date().getFullYear()
      for (let i = 0; i < userlist.length; i++) {
        const user = userlist[i]
        if (currentTime > user.indate) {
          console.log(`before i = ${i}`)
          // 过了用户的有效期
          const nextYear = currentYear + 1
          const indate = Date.parse(new Date(nextYear + '/12/31 23:59:59'))
          const lastYearScorePre = user.lastYearScore
          const score = user.score - lastYearScorePre
          const lastYearScore = score
          await updateUserIndateById({
            id: user._id,
            indate: indate
          }).then((res) => {
            // 更新成功
            console.log(`after i = ${i}`)
          })
          // 更新鑫豆记录
          const reason = lastYearScorePre + '鑫豆已过有效期'
          const record = '-' + lastYearScorePre
          await updateScoreById({
            id: user._id,
            score: score,
            lastYearScore: lastYearScore,
            currentTime: currentTime,
            reason: reason,
            record: record
          }).then((res) => {
            // 新增一条鑫豆记录成功
          })
        }
      }
    },

    // 新增营员
    addUser() {
      const phone = this.addTelephone
      if(phone.length != 11) {
        this.alertMessage(2, '电话号码格式不对')
      } else {
        fetchUserByTelephone({                                  // 根据输入的电话号码查找该电话号码是否已存在
          telephone: phone
        }).then((res) => {
          if(res.data.length === 0) {
            // 当前号码未注册 插入这条记录
            addUser({
              telephone: phone
            }).then((res) => {
              if(res.code === 20000) {                           // 这个判断存疑
                this.alertMessage(1, '新增营员成功')
                this.addTelephone = ''
                // 重新刷新列表数据
                this.getUserList()
              } else {
                this.alertMessage(4, '新增失败，请重新尝试')
              }
            })
          } else {
            this.alertMessage(1, '当前号码已存在')
          }
        })
      }
    },

    onAddXinBean(row) {
      this.$router.push(`/user/addXinBean/${row._id}`)              // 跳转到新增鑫豆页面
    },

    onAddGrowthValue(row) {
      this.$router.push(`/user/addGrowthValue/${row._id}`)              // 跳转到新增成长值页面
    },

    onUserDetail(row) {
      // 查看详情
    },

    findUser() {
      const phone = this.searchTelephone
      if(phone.length != 11) {
        this.alertMessage(2, '电话号码格式不对')
      } else {
        fetchUserByTelephone({
          telephone: phone
        }).then((res) => {
          if(res.data.length === 0) {
            this.alertMessage(2, '当前号码不存在')
          } else {
            this.userlist = []
            this.userlist.push(JSON.parse(res.data))
          }
        })
      }
    },

    // 弹出消息提醒
    alertMessage(type, msg) {
      var msgType
      switch(type) {
        case 1:
          msgType = 'success'
          break
        case 2:
          msgType = 'warning' 
          break
        case 3:
          msgType = 'info'
          break
        case 4:
          msgType = 'error'
          break
        default:
          break     
      }
      this.$message({
        message: msg,
        type: msgType
      })
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

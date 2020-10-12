<template>
  <div>
    <el-button type="primary" class="add-activity-btn" @click="addActivity">新建活动</el-button>
    <el-table v-loading="loading" :data="vphotoList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="活动主题" width="600"></el-table-column>
      <el-table-column prop="date" label="活动时间"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="updateVphotoList(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="onVphotoDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchVphotoList } from '@/api/vphoto'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      vphotoList: [],                         // vphoto列表
      loading: false,
      count: 50,
    }
  },

  created() {
    this.getVphotoList()
  },

  mounted() {
    scroll.start(this.getVphotoList)
  },

  methods: {
      // 新增活动
    addActivity() {
      this.$router.push('/vphoto/addActivity')                               // 跳转到新增活动界面，需要在 router/index.js 中注册
    },
    // 获取 vphoto 列表数据
    getVphotoList() {
      this.loading = true
      fetchVphotoList({
        start: this.vphotoList.length,
        count: this.count
      }).then((res) => {
        console.log(`fetchVphotoList res.data = ${res.data}`)
        var vphotoListTemp = res.data
        for (let i = 0; i < vphotoListTemp.length; i++) {
          vphotoListTemp[i].date = this.formatDate(parseFloat(vphotoListTemp[i].date))
        }
        this.vphotoList = this.vphotoList.concat(vphotoListTemp)
        if (res.data.length < this.count) {                      // 当上拉回调的数据量小于 count 值时，说明数据全部请求完了，就不需要再请求了
          scroll.end()
        }
        this.loading = false
      })
    },

    formatDate(date) {
      var date = new Date(date);
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },

    updateVphotoList(row) {
      console.log(`updateVphotoList row = ${row}`)
      this.$router.push(`/vphoto/pictureList/${row._id}`)              // 跳转到对应路由的页面
    },
  }
}
</script>

<style>
    .add-activity-btn {
    margin-top: 10px;
    margin-left: 20px;
    }
</style>
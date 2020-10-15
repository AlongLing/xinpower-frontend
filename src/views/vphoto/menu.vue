<template>
  <div>
    <el-button type="primary" class="add-activity-btn" @click="addActivity">新建活动</el-button>
    <el-table v-loading="loading" :data="vphotoList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="图片" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="100" />
        </template>
      </el-table-column>
      <el-table-column label="活动主题" width="300">
        <template slot-scope="scope">
          <p v-text="scope.row.name"></p>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="300">
        <template slot-scope="scope">
          <p v-text="scope.row.date"></p>
        </template>
      </el-table-column>

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

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该场活动吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doCancel">取 消</el-button>
        <el-button type="primary" @click="doDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchVphotoList, deleteVphotoById } from '@/api/vphoto'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      vphotoList: [],                         // vphoto列表
      loading: false,
      count: 50,
      delDialogVisible: false,
      deleteVphoto: {}                        // 待删除的活动
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

    onVphotoDelete(row) {
      this.deleteVphoto = row
      this.delDialogVisible = true
    },

    // 删除对话框确定按钮
    doDelete() {
      deleteVphotoById({
        vphotoId: this.deleteVphoto._id,
        deleteVphoto: this.deleteVphoto
      }).then((res) => {
        this.delDialogVisible = false
        this.vphotoList = []
        this.getVphotoList()
      })
    },
    // 删除对话框取消按钮
    doCancel() {
      this.delDialogVisible = false
    }
  }
}
</script>

<style>
  .add-activity-btn {
    margin-top: 10px;
    margin-left: 20px;
  }
</style>
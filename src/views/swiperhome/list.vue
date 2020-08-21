<template>
  <div>
    <el-button type="primary" class="add-goods-btn" @click="addGoods">新增商品</el-button>
    <el-table v-loading="loading" :data="swiperHomeList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="图片" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="50" />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该图片吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchSwiperHomeList } from '@/api/swiper'
export default {
  data() {
    return {
      swiperHomeList: [],
      loading: false,
    };
  },
  created() {
    this.getSwiperHomeList()
  },
  methods: {
    getSwiperHomeList() {
      this.loading = true
      fetchSwiperHomeList().then(res => {
        console.log(res)
        this.swiperHomeList = res.data
        this.loading = false
      })
    },
    
    // 新增轮播页的商品
    addGoods() {
      this.$router.push('/swiper/addGoods')                               // 跳转到新增商品界面，需要在 router/index.js 中注册
    }
  }
};
</script>

<style>
  .add-goods-btn {
    margin-top: 10px;
    margin-left: 20px;
  }
</style>
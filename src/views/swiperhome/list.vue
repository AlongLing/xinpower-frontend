<template>
  <div>
    <el-button type="primary" class="add-goods-btn" @click="addGoods">新增商品</el-button>
    <el-table v-loading="loading" :data="swiperHomeList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="图片" width="200">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="50" />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="400">
        <template slot-scope="scope">
          <p v-text="scope.row.name"></p>
        </template>
      </el-table-column>
      <el-table-column label="商品价格">
        <template slot-scope="scope">
          <p v-text="scope.row.price"></p>
        </template>
      </el-table-column>
      <el-table-column label="兑换数量">
        <template slot-scope="scope">
          <p v-text="scope.row.saleNumber"></p>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onSwipeGoodsDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该商品吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSwipeGoodsDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchSwiperHomeList, del } from '@/api/swiper'
export default {
  data() {
    return {
      swiperHomeList: [],                                     // 轮播商品列表
      loading: false,
      delDialogVisible: false,
      deleteSwiperGoods: {},                                  // 待删除的轮播商品
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
    },
    // 删除轮播商品
    onSwipeGoodsDelete(row) {
      this.deleteSwiperGoods = row
      this.delDialogVisible = true
    },
    // 删除对话框确定按钮
    doSwipeGoodsDelete() {
      this.delDialogVisible = false
      this.loading = true
      const deletePicture = this.deleteSwiperGoods
      del({
        deletePic: deletePicture,
        deleteType: 1,
        deletePictureId: deletePicture._id
      }).then((res) => {
        this.loading = false
        this.getSwiperHomeList()
        this.$message({
        message: '删除成功',
        type: 'success'
        })
      })
    },
  }
};
</script>

<style>
  .add-goods-btn {
    margin-top: 10px;
    margin-left: 20px;
  }
</style>
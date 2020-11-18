<template>
  <div>
    <el-button type="primary" class="add-goods-btn" @click="getGoodsUp">已上架商品</el-button>
    <el-button type="primary" class="add-goods-btn" @click="getGoodsDown">已下架商品</el-button>
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
          <el-button size="mini" type="primary" @click="updateSwipeGoodsState(scope.row)">{{dowmUpBtnText}}</el-button>
          <el-button size="mini" type="danger" @click="onSwipeGoodsDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除或下架的对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{dialogTitle}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchSwiperHomeList, del, updateSwiperGoodsState } from '@/api/swiper'
export default {
  data() {
    return {
      swiperHomeList: [],                                     // 轮播商品列表
      loading: false,
      dialogVisible: false,                               // 商品删除或者下架对话框显示 or 隐藏
      swiperGoods: {},                                  // 待删除或下架的轮播商品
      dialogTitle: '确定删除该商品吗？',
      dialogTip: 0,                                        // 对话框类型，1：商品下架对话框 2：商品删除对话框
      goodsState: '已上架',
      dowmUpBtnText: '下架'                                // 上架或下架按钮文字
    };
  },
  created() {
    this.getSwiperHomeList()
  },
  methods: {
    getSwiperHomeList() {
      this.loading = true
      fetchSwiperHomeList({
        goodsState: this.goodsState
      }).then(res => {
        console.log(res)
        this.swiperHomeList = res.data
        this.loading = false
      })
    },
    
    // 获取已上架商品
    getGoodsUp() {
      this.goodsState = '已上架'
      this.dowmUpBtnText = '下架'
      this.getSwiperHomeList()
    },
    // 获取已下架商品
    getGoodsDown() {
      this.goodsState = '已下架'
      this.dowmUpBtnText = '上架'
      this.getSwiperHomeList()
    },
    // 新增轮播页的商品
    addGoods() {
      this.$router.push('/swiper/addGoods')                               // 跳转到新增商品界面，需要在 router/index.js 中注册
    },
    // 删除轮播商品
    onSwipeGoodsDelete(row) {
      this.dialogTitle = '确定删除该商品吗？'
      this.dialogTip = 2
      this.swiperGoods = row
      this.dialogVisible = true
    },
    // 下架或上架轮播商品
    updateSwipeGoodsState(row) {
      if (this.dowmUpBtnText == '下架') {
        this.dialogTitle = '确定下架该商品吗？'
      } else if (this.dowmUpBtnText == '上架') {
        this.dialogTitle = '确定上架该商品吗？'
      } else {
        // do nothing
      }
      this.dialogTip = 1
      this.swiperGoods = row
      this.dialogVisible = true
    },
    // 删除对话框确定按钮
    dialogConfirm() {
      this.dialogVisible = false
      this.loading = true
      const deletePicture = this.swiperGoods
      if (this.dialogTip == 1) {
        if (this.dowmUpBtnText == '下架') {
          updateSwiperGoodsState({
            goodsId: deletePicture._id,
            goodsState: '已下架'
          }).then((res) => {
            this.loading = false
            this.getSwiperHomeList()
            this.$message({
            message: '下架成功',
            type: 'success'
            })
          })
        } else if (this.dowmUpBtnText == '上架') {
          updateSwiperGoodsState({
            goodsId: deletePicture._id,
            goodsState: '已上架'
          }).then((res) => {
            this.loading = false
            this.getSwiperHomeList()
            this.$message({
            message: '上架成功',
            type: 'success'
            })
          })
        }
      } else if (this.dialogTip == 2) {
        del({
          deletePic: deletePicture,
          deleteType: 1,
          deleteGoodsId: deletePicture._id
        }).then((res) => {
          this.loading = false
          this.getSwiperHomeList()
          this.$message({
          message: '删除成功',
          type: 'success'
          })
        })
      } else {
        // do nothing
      }
      this.dialogTip = 0
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
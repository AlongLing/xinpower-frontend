<template>
  <div>
    <el-button type="primary" class="add-goods-btn" @click="getGoodsUp">已上架商品</el-button>
    <el-button type="primary" class="add-goods-btn" @click="getGoodsDown">已下架商品</el-button>
    <el-button type="primary" class="add-goods-btn" @click="addGoods">新增商品</el-button>
    <el-table v-loading="loading" :data="goodsList" stripe style="width: 100%">
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
          <el-button size="mini" type="primary" @click="updateGoodsState(scope.row)">{{dowmUpBtnText}}</el-button>
          <el-button size="mini" type="primary" @click="editGoods(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onGoodsDelete(scope.row)">删除</el-button>
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
import { fetchGoodsList, del, updateGoodsState } from '@/api/goods'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      goodsList: [],
      loading: false,
      count: 50,
      dialogVisible: false,
      goods: {},                             // 待下架或删除的商品
      dialogTitle: '确定删除该商品吗？',
      dialogTip: 0,                                        // 对话框类型，1：商品下架对话框 2：商品删除对话框
      goodsState: '已上架',
      dowmUpBtnText: '下架'                                // 上架或下架按钮文字
    }
  },
  created() {
    this.getGoodsList()
  },

  mounted() {
    // scroll.start(this.getGoodsList)
  },

  methods: {
    // 获取商品列表数据
    getGoodsList() {
      this.loading = true
      fetchGoodsList({
        start: this.goodsList.length,
        count: this.count,
        goodsState: this.goodsState
      }).then((res) => {
        console.log(`res.data.length = ${res.data.length}`)
        this.goodsList = this.goodsList.concat(res.data)
        if (res.data.length <= this.count && res.data.length !== 0) {                      // 当上拉回调的数据量小于 count 值时，说明数据全部请求完了，就不需要再请求了
          this.getGoodsList()
        }
        this.loading = false
      })
    },
    // 下架或上架轮播商品
    updateGoodsState(row) {
      if (this.dowmUpBtnText === '下架') {
        this.dialogTitle = '确定下架该商品吗？'
      } else if (this.dowmUpBtnText === '上架') {
        this.dialogTitle = '确定上架该商品吗？'
      } else {
        // do nothing
      }
      this.dialogTip = 1
      this.goods = row
      this.dialogVisible = true
    },

    // 编辑商品
    editGoods(row) {
      this.$router.push(`/gift/addGoods/${row._id}`)              // 跳转到新增商品页面，如果id=0，则新增，id != 0,则修改
    },

    // 删除按钮
    onGoodsDelete(row) {
      this.dialogTitle = '确定删除该商品吗？'
      this.dialogTip = 2
      this.goods = row
      this.dialogVisible = true
    },
    // 获取已上架商品
    getGoodsUp() {
      this.goodsState = '已上架'
      this.dowmUpBtnText = '下架'
      this.goodsList = []
      this.getGoodsList()
    },
    // 获取已下架商品
    getGoodsDown() {
      this.goodsState = '已下架'
      this.dowmUpBtnText = '上架'
      this.goodsList = []
      this.getGoodsList()
    },
    // 新增商品
    addGoods() {
      this.$router.push('/gift/addGoods/0')                              // 跳转到新增商品界面，需要在 router/index.js 中注册
    },
    // 商品删除或下架对话框确定按钮
    dialogConfirm() {
      this.dialogVisible = false
      this.loading = true
      const goods = this.goods
      if (this.dialogTip == 1) {
        if (this.dowmUpBtnText === '下架') {
          updateGoodsState({
            goodsId: goods._id,
            goodsState: '已下架'
          }).then((res) => {
            this.loading = false
            this.goodsList = []
            this.getGoodsList()
            this.$message({
            message: '下架成功',
            type: 'success'
            })
          })
        } else if (this.dowmUpBtnText === '上架') {
          updateGoodsState({
            goodsId: goods._id,
            goodsState: '已上架'
          }).then((res) => {
            this.loading = false
            this.goodsList = []
            this.getGoodsList()
            this.$message({
            message: '上架成功',
            type: 'success'
            })
          })
        }
      } else if (this.dialogTip === 2) {
        del({
          deletePic: goods,
          deleteType: 1,
          deleteGoodsId: goods._id,
        }).then((res) => {
          this.loading = false
          this.goodsList = []
          this.getGoodsList()
          this.$message({
          message: '删除成功',
          type: 'success'
          })
        })
      }
    },
  }
}
</script>

<style>
  .add-goods-btn {
    margin-top: 10px;
    margin-left: 20px;
  }

</style>

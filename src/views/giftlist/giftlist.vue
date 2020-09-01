<template>
  <div>
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
          <el-button size="mini" type="danger" @click="onGoodsDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该商品吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doGoodsDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchGoodsList, del } from '@/api/goods'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      goodsList: [],
      loading: false,
      count: 50,
      delDialogVisible: false,
      deleteGoods: {},                             // 待删除的商品
    }
  },
  created() {
    this.getGoodsList()
  },

   mounted() {
    scroll.start(this.getGoodsList)
  },

  methods: {
    // 获取商品列表数据
    getGoodsList() {
      this.loading = true
      fetchGoodsList({
        start: this.goodsList.length,
        count: this.count
      }).then((res) => {
        console.log(res)           // 获取到所有的商品数据
        this.goodsList = this.goodsList.concat(res.data)
        if (res.data.length < this.count) {                      // 当上拉回调的数据量小于 count 值时，说明数据全部请求完了，就不需要再请求了
          scroll.end()
        }
        this.loading = false
      })
    },
    // 删除按钮
    onGoodsDelete(row) {
      this.deleteGoods = row
      this.delDialogVisible = true
    },
    // 新增商品
    addGoods() {
      this.$router.push('/gift/addGoods')                               // 跳转到新增商品界面，需要在 router/index.js 中注册
    },
    // 删除对话框确定按钮
    doGoodsDelete() {
      this.delDialogVisible = false
      this.loading = true
      del({
        deletePic: this.deleteGoods,
        deleteType: 1,
        deleteGoodsId: this.deleteGoods._id,
      }).then((res) => {
        this.loading = false
        this.goodsList = []
        this.getGoodsList()
        this.$message({
        message: '删除成功',
        type: 'success'
        })
      })
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

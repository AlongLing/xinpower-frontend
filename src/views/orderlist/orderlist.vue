<template>
  <div>
    <el-row>
      <el-col :span="2" class="input-button"><el-button type="primary" @click="unshippedOrder">未发货</el-button></el-col>
      <el-col :span="2" class="input-button"><el-button type="primary" @click="shippedOrder">已发货</el-button></el-col>
      <el-col :span="2" class="input-button"><el-button type="primary" @click="receivedOrder">已收货</el-button></el-col>
      <el-col :span="4" class="input-telephone"><el-input placeholder="请输入用户电话号码" v-model="userTelephone" clearable></el-input></el-col>
      <el-col :span="4" class="input-button"><el-button type="primary" icon="el-icon-search" @click="findOrder">查找订单</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="orderList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="商品" width="200" type="expand">
        <template slot-scope="scope">
          <el-table v-loading="loading" :data="scope.row.goodsList" stripe style="width: 90%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="图片" width="200">
            <template slot-scope="scope">
              <img :src="scope.row.download_url" alt height="50" />
            </template>
            </el-table-column>
            <el-table-column label="商品名称" width="400">
              <template slot-scope="scope">
                <p v-text="scope.row.goodsName"></p>
              </template>
            </el-table-column>
            <el-table-column label="购买数量" width="210">
              <template slot-scope="scope">
                <p v-text="scope.row.goodsNumber"></p>
              </template>
            </el-table-column>
            <el-table-column label="商品价格" width="210">
              <template slot-scope="scope">
                <p v-text="scope.row.goodsPrice"></p>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号码">
        <template slot-scope="scope">
          <p v-text="scope.row.userPhone"></p>
        </template>
      </el-table-column>
      <el-table-column label="收货人">
        <template slot-scope="scope">
          <p v-text="scope.row.receiveName"></p>
        </template>
      </el-table-column>
      <el-table-column label="收货人电话号码">
        <template slot-scope="scope">
          <p v-text="scope.row.receivePhone"></p>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <p v-text="scope.row.orderState"></p>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onOrderItemOperation(scope.row)">{{operationText}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchOrderList, fetchOrderListByUserPhone, fetchUpdateOrderStateByOrderId } from '@/api/order'                          // 导入对应的 api 的函数
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      userTelephone: '',
      loading: false,
      orderList: [],                       
      operationText: '编辑',
      orderState: '未发货',                    // 订单状态：未发货 已发货 已收货
      count: 50,
      orderStateIndex: 0,                      // 标志当前订单状态类型：0：默认值；1：未发货；2：已发货；3：已收货
      hasCalledAutoConfirmOrderMethod: false   // true 表示已经调用了 autoConfirmOrder 方法
    }
  },

  created() {
    this.getOrderList()
  },

  mounted() {
    scroll.start(this.getOrderList)
  },

  methods: {
    // 获取订单信息
    getOrderList() {
      this.loading = true
      fetchOrderList({
        start: this.orderList.length,
        count: this.count,
        orderState: this.orderState
      }).then((res) => {
        console.log(`orderlist getOrderList res.data = ${JSON.stringify(res.data)}`)           // 获取到所有的订单数据
        this.orderList = this.orderList.concat(res.data)
        if (res.data.length < this.count) {                      // 当上拉回调的数据量小于 count 值时，说明数据全部请求完了，就不需要再请求了
          scroll.end()
        }
        this.loading = false
        if (this.orderStateIndex == 2 && !this.hasCalledAutoConfirmOrderMethod) {
          this.hasCalledAutoConfirmOrderMethod = true
          // 已发货状态，如果发货时间超过十天，则自动收货
          this.autoConfirmOrder()
        }
      })
    },
    // 未发货按钮
    unshippedOrder() {
      this.orderList = []
      this.orderState = '未发货'
      this.orderStateIndex = 1
      this.getOrderList()
    },
    // 已发货按钮
    shippedOrder() {
      this.orderList = []
      this.orderState = '已发货'
      this.orderStateIndex = 2
      this.getOrderList()
    },
    // 已收货按钮
    receivedOrder() {
      this.orderList = []
      this.orderState = '已收货'
      this.orderStateIndex = 3
      this.getOrderList()
    },
    // 查找订单
    findOrder() {
      const userPhone = this.userTelephone
      console.log(`findOrder userPhone = ${userPhone}`)
      if (userPhone.length != 11) {
        alert('电话号码格式不对')
      } else {
        console.log(`要查找电话号码为: ${userPhone}`)
        this.loading = true
        fetchOrderListByUserPhone({
          userPhone: userPhone
        }).then((res) => {
          if(res.data.length === 0) {
            console.log('当前号码没有订单记录')
            this.$message.error('当前号码没有订单记录')
          } else {
            this.orderList = []
            this.orderList = res.data
          }
          this.loading = false
        })
      }
    },
    //编辑按钮，如果订单是未发货状态，则需要发货，其他状态，只是查看页面数据而已
    onOrderItemOperation(row) {
      this.$router.push(`/order/edit/${row._id}`)              // 跳转到对应路由的页面
    },
    // 发货后，超过十天，自动收货
    async autoConfirmOrder() {
      console.log(`orderlist autoConfirmOrder`)
      const orderList = this.orderList
      for (let i = 0; i < orderList.length; i++) {
        const order = orderList[i]
        if (order.orderState == '已发货') {
          const timeMillis = new Date().getTime() - parseFloat(order.sendOutTime)
          if (timeMillis > 864000000) {
            await fetchUpdateOrderStateByOrderId({
              id: order._id,
              orderState: '已收货'
            }).then((res) => {

            })
          }
        }
      }
      this.orderList = []
      this.getOrderList()
    },
    
  }
}
</script>

<style>
  .unshipped-btn {
    margin-top: 10px;
    margin-left: 20px;
  }

  .input-telephone {
    margin-left: 50px;
    margin-right: 50px;
    margin-top: 20px;
  }

  .input-button {
    margin-top: 20px;
    margin-left: 20px;
  }
</style>

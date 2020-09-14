<template>
  <div>
    <el-form ref="form" :model="order" label-width="120px">
      <el-form-item label="快递单号">
        <el-input v-model="order.orderId" :disabled="orderIdDisabled" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-input v-model="order.orderState" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="收货人">
        <el-input v-model="order.receiveName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="收货人电话号码">
        <el-input v-model="order.receivePhone" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="收货人地址">
        <el-input v-model="order.receiveAddress" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onConfirm">{{confirmText}}</el-button>
        <el-button @click="onCancel">取消</el-button>
        <p class="delete-btn">
          <el-button @click="onDelete" type="danger">删除</el-button>
        </p>
      </el-form-item>
    </el-form>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除这条订单信息吗？删除后不可恢复，请慎重!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="doDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchOrderById, updateOrderIdAndState, deleteOrderById } from "@/api/order";
export default {
  data() {
    return {
      order: {},
      orderIdDisabled: false,
      confirmText: "发货",
      delDialogVisible: false,
    };
  },

  created() {
    // 根据订单 id 查找订单信息
    fetchOrderById({
      orderId: this.$route.params.id,
    }).then((res) => {
      console.log(res)
      this.order = res.data
      if (this.order.orderState != '未发货') {
        this.orderIdDisabled = true
        this.confirmText = '确定'
      }
    })
  },

  methods: {
    onConfirm() {
      // 点击发货或者确定按钮
      console.log(`onConfirm: order = ${JSON.stringify(this.order)}`)
      const orderState = this.order.orderState
      const id = this.order._id
      if (orderState == "未发货") {
        const orderId = this.order.orderId;
        console.log(`onConfirm orderId = ${orderId}`);
        if (orderId == "") {
          alert("快递单号不能为空");
        } else {
          // 修改订单的快递单号和订单状态,发货时间
          updateOrderIdAndState({
            id: id, // 订单id
            orderId: orderId, // 订单的快递单号
            orderState: '已发货',
            sendOutTime: Date.parse(new Date()),
          })
            .then((res) => {
              this.$message({
                message: "发货成功",
                type: "success",
              })
              this.$router.push("/order/orderlist")
            })
            .catch((err) => {
              this.$message({
                message: "发货失败",
                type: "error",
              })
              this.$router.push("/order/orderlist")
            });
        }
      } else {
        this.$router.push("/order/orderlist")
      }
    },

    onCancel() {
      // 点击取消按钮
      this.$router.push("/order/orderlist")
    },

    onDelete() {
      this.delDialogVisible = true
    },

    // 对话框删除确定按钮
    doDelete() {
      this.delDialogVisible = false
      const id = this.order._id
      deleteOrderById({
        id: id
      }).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        })
        this.$router.push("/order/orderlist")
      })
    },
  },
};
</script>

<style>
.delete-btn {
  margin-left: 1100px;
}
</style>
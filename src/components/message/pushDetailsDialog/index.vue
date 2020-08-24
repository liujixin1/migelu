<template>
  <div class="container">
    <el-dialog
      title="推送目标详情"
      :visible.sync="dialog.centerDialogVisible"
      width="50%"
      center
      :lock-scroll="true"
      @open="getData"
    >
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column prop="ch_name" label="中文名" align="center"></el-table-column>
        <el-table-column prop="en_name" label="英文名" align="center"></el-table-column>
         <el-table-column prop="phone" label="电话" align="center"></el-table-column>
        <el-table-column prop="sex_name" label="性别" align="center"></el-table-column>
        <el-table-column prop="province" label="城市" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { selectUserIdStrShow } from "@/api/message/push";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      tableData: []
    };
  },

  methods: {
    //提交
    getData() {
      let data = {
        id: this.dialog.id
      };
      selectUserIdStrShow(data).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.userList;
        }
      });
    },
    confirm() {
      this.dialog.centerDialogVisible = false;

    },
   
  }
};
</script>
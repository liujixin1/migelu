<template>
  <div class="container">
    <el-button
      class="add"
      size="small"
      type="primary"
      icon="el-icon-circle-plus"
      @click="handleAddAdmin()"
    >新增管理员</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
      <el-table-column prop="admin_id" label="id" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
      <el-table-column prop="nickname" label="管理员名称" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column label="操作" width="450" align="center">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-refresh" type="info" @click="time(scope)">重置登录次数</el-button>
          <el-button size="mini" icon="el-icon-lock" type="warning" @click="password(scope)">重置密码</el-button>
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- dialog -->
    <adminDialog :dialog="dialog" :formData="formData" @upData="getData"></adminDialog>
  </div>
</template>
<script>
import AdminDialog from "@/components/permission/adminDialog";
import Pagination from "@/components/pagination";
import { SelectAdminList, delAdminInfo,resetAdminPassword,resetAuthTimes } from "@/api/permission/adminlist";
export default {
  components: {
    pagination: Pagination,
    adminDialog: AdminDialog
  },
  data() {
    return {
      //页面数据
      tableData: [],
      //分页
      pageData: {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper"
      },
      //dialog信息
      dialog: {
        centerDialogVisible: false,
        dialogType: "",
        admin_id: ""
      },

      formData: {}
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    //页面数据
    this.getData();
  },
  methods: {
    //页面数据
    getData() {
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page
      };
      SelectAdminList(data)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.data;
            this.pageData.page = res.data.current_page;
            this.pageData.pagesize = res.data.per_page;
            this.pageData.total = res.data.total;
          }
        })
        .catch(err => {});
    },
    //重置密码
    password(scope) {
      let data = {
        admin_id: scope.row.admin_id
      };
      console.log(scope);
      this.$confirm("是否重置密码?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          resetAdminPassword(data).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg
              });
            }else{
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //重置登录次数
    time(scope){
       let data = {
        id: scope.row.admin_id
      };
      console.log(scope);
      this.$confirm("是否重置登录次数?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          resetAuthTimes(data).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg || res.message
              });
            }else{
              this.$message({
                type: "error",
               message: res.msg || res.message
              });
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 添加管理员
    handleAddAdmin() {
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "";
      this.dialog.admin_id = "";
    },
    handleEdit(scope) {
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "edit";
      this.dialog.admin_id = scope.row.admin_id;
    },
    //删除管理员
    handleDelete(scope) {
      let data = {
        admin_id: scope.row.admin_id
      };
      console.log(scope);
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delAdminInfo(data).then(res => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //每页多少条
    handleCurrentChange(val) {
      this.pageData.page = 1;
      this.pageData.pageSize = val;
      this.getData();
    },
    //选取页数
    handleSizeChange(page) {
      this.pageData.page = page;
      this.getData();
    },
    //选取
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style scoped>
.add {
  margin-left: auto;
  margin-bottom: 10px;
  display: block;
}
</style>
<template>
  <div class="container">
    <el-button class="add" size="small" type="primary" icon="el-icon-circle-plus" @click="handleAddAdmin()">新增权限分组</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
      <!-- <el-table-column prop="id" label="id" align="center"></el-table-column> -->
      <el-table-column prop="name" label="权限分组名称" align="center"></el-table-column>
      <el-table-column prop="code" label="code" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination> -->
    <!-- dialog -->
    <rightsGroupDialog
      :dialog="dialog"
      @upData="getData"
    ></rightsGroupDialog>
  </div>
</template>
<script>
import RightsGroupDialog from "@/components/permission/rightsGroupDialog";
import Pagination from "@/components/pagination";
import { getRightGroupList,delRightGroup } from "@/api/permission/rightsGroup";
export default {
  components: {
    pagination: Pagination,
    rightsGroupDialog: RightsGroupDialog
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
        admin_id:''
      },
      
      formData: {},
     
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
      getRightGroupList(data)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data;
            this.pageData.page = res.data.current_page;
            this.pageData.pagesize = res.data.per_page;
            this.pageData.total = res.data.total;
          }
        })
        .catch(err => {});
    },
      // 添加分组
    handleAddAdmin() {
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "";
      this.dialog.admin_id = ''
    },
    handleEdit(scope){
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "edit";
      this.dialog.admin_id = scope.row.id;
    },
    //删除分组
    handleDelete(scope){
       let data = {
        id: scope.row.id
      };
      console.log(scope);
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
         
          delRightGroup(data).then(res => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: res.msg ||res.message
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
    },
  
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
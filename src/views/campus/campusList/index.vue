<template>
  <div class="container">
    <el-button class="add" size="small" type="primary" @click="handleAddRole()">添加校区</el-button>
    <el-table :data="tableData" border style="width: 100%" empty-text="暂无数据">
      <el-table-column prop="name" label="校区名称" align="center"></el-table-column>
      <el-table-column prop="token" label="校区token" align="center"></el-table-column>
      <el-table-column prop="org_id" label="校区ID" align="center"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- 新建校区dialog -->
    <addcampusDialog :dialog="dialog" @upData="getData"></addcampusDialog>
  </div>
</template>
<script>
import AddcampusDialog from "@/components/campus/addcampusDialog";
import Pagination from "@/components/pagination";
import { campusList,deleteSchool} from "@/api/campus/campusList";

export default {
  components: {
    pagination: Pagination,
    addcampusDialog: AddcampusDialog,
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
      //新建dialog
      dialog: {
        centerDialogVisible: false,
        dialogType: ""
      },
      // 修改dialog
      modificationDialog: {
        centerDialogVisible: false,
        dialogType: ""
      },

      formData: {
        name: "",
        describe: "",
        id: ""
      }
    };
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

      campusList(data)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.data;
            this.pageData.page = res.data.current_page;
            this.pageData.pagesize = res.data.per_page;
            this.pageData.total = res.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改
    handleEdit(scope) {
      this.dialog.dialogType = "edit";
      this.dialog.centerDialogVisible = true;
      this.dialog.id = scope.row.id;
    },
    //删除
    handleDelete(scope) {
      let data = {
        id: scope.row.id
      };
      console.log(data);
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSchool(data).then(res => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: res.message|| res.msg
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
    // 添加角色
    handleAddRole() {
      this.dialog.dialogType = "";
      this.dialog.centerDialogVisible = true;
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
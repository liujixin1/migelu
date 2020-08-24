<template>
  <div class="container">
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="searchName"
        clearable
        placeholder="请输入用户名称"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="searchPhone"
        clearable
        placeholder="请输入手机号码"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
      <el-button class="add" size="small" type="primary" @click="addPermission">添加用户</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
      <el-table-column prop="username" label="学员用户名" align="center"></el-table-column>
      <el-table-column prop="phone" label="学员手机" align="center"></el-table-column>

      <el-table-column prop="en_name" label="英文名" align="center"></el-table-column>
      <el-table-column prop="ch_name" label="中文名" align="center"></el-table-column>
      <el-table-column prop="sex_name" label="性别" align="center"></el-table-column>
      <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
      <el-table-column prop="province" label="地址" align="center"></el-table-column>
      <el-table-column prop="nyk_student_id" label="飞博学员id" align="center"></el-table-column>
      <el-table-column prop="nyk_student_number" label="飞博学员编号" align="center"></el-table-column>
      <el-table-column prop="last_login_time" label="最后登录时间" align="center"></el-table-column>

      <el-table-column label="学员类型" width="150" align="center">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.type_name"
            @change="changeType(scope,scope.row.type_name)"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- dialog -->
    <addUserDialog :dialog="dialog" @upData="getData"></addUserDialog>
  </div>
</template>
<script>
import AddUserDialog from "@/components/userList/addUserDialog";
import Pagination from "@/components/pagination";
import { userList, changeType } from "@/api/userList";
export default {
  components: {
    pagination: Pagination,
    addUserDialog: AddUserDialog
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
        dialogType: ""
      },
      searchName: "",
      searchPhone: "",
      options: [
        {
          value: 1,
          label: "其他"
        },
        {
          value: 2,
          label: "麦禾学员"
        },
        {
          value: 3,
          label: "米格鲁学员"
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //获取页面数据
    getData() {
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page,
        searchName: this.searchName,
        searchPhone: this.searchPhone
      };

      userList(data)
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
    changeType(scope, type) {
      let data = {
        id: scope.row.id,
        type: type
      };
      changeType(data).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg || res.message
          });
        } else {
          this.getData();
          this.$message({
            type: "info",
            message: res.msg || res.message
          });
        }
      });
    },
    //添加用户
    addPermission() {
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "";
      this.dialog.id = "";
    },
    //修改用户
    handleEdit(scope) {
      console.log(scope);
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "edit";
      this.dialog.id = scope.row.id;
    },
    //删除
    handleDelete(scope) {
      let data = {
        id: scope.row.id
      };
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletes(data).then(res => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: "删除成功!"
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
    //dialog触发该函数。关闭dialog,在没对表单重置之前先清空表单。
    // 搜索
    handleSearch() {
      this.pageData.page = 1;
      this.pageData.total = null;
      this.getData();
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
.top {
  position: relative;
}

.add {
  position: absolute;
  right: 0;
  top: 4px;
}
.pagination {
  text-align: right;
  padding: 10px;
}
</style>
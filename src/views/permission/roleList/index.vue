<template>
  <div class="container">
    <el-button class="add" size="small" type="primary" @click="handleAddRole()">新增角色</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
      <el-table-column prop="role_id" label="id" align="center"></el-table-column>
      <el-table-column prop="role_name" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="role_desc" label="描述" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            @click="handleEdit(scope)"
          >编辑</el-button> -->
          <el-button
            size="mini"
            v-if="scope.row.role_id == 1?false:true"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            size="mini"
            v-if="scope.row.role_id == 1?false:true"
            type="danger"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- 修改角色dialog -->
    <roleDialog
      :dialog="modificationDialog"
      :dialogPermissionCenter="dialogPermissionCenter"
      :dialogmenuCenter="dialogmenuCenter"
      :props="props"
      :formData="formData"
      @upData="getData"
    ></roleDialog>
    <!-- 新建角色dialog -->
    <addRoleDialog :dialog="dialog" @upData="getData"></addRoleDialog>
  </div>
</template>
<script>
import AddRoleDialog from "@/components/permission/addRoleDialog";
import RoleDialog from "@/components/permission/roleDialog";
import Pagination from "@/components/pagination";
import { roleList, getRoleInfo, removeRole } from "@/api/permission/roleList";
import { asyncRoutes, constantRoutes } from "@/router";

export default {
  components: {
    pagination: Pagination,
    roleDialog: RoleDialog,
    addRoleDialog: AddRoleDialog
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
      props: {
        children: "children",
        label: "name"
      },
      formData: {
        name: "",
        describe: "",
        id: "",
        menuList: null,
        actList: null
      },
      //doalog权限数据
      dialogPermissionCenter: null,
      dialogmenuCenter: null
    };
  },

  created() {
    //页面数据
    this.getData();
    //权限列表数据
    this.getRoutes();
    //菜单数据
    this.getRoleList();
  },
  methods: {
    //权限列表数据
    getRoutes() {
      getRoleInfo()
        .then(res => {
          this.dialogPermissionCenter = this.generatePermission(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //菜单数据
    getRoleList() {
      this.dialogmenuCenter = asyncRoutes;
    },
    //权限列表数据对象数组转换二维数组
    generatePermission(res) {
      let center = [];
      for (let i in res) {
        for (let j in res[i]) {
          let obj = {};
          obj.name = res[i][j][0].group_name;
          obj.group = res[i][j][0].group;
          obj.children = [];
          res[i][j].forEach(data => {
            obj.children.push(data);
          });
          center.push(obj);
        }
      }
      return center;
    },

    //页面数据
    getData() {
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page
      };

      roleList(data)
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
    //修改权限
    handleEdit(scope) {
      //获取权限分配ID数组
      let actStrList = scope.row.act_list;
      let actArrList = [];
      if (actStrList) {
        actArrList = actStrList.split(",");
      }
      //获取菜单栏分配ID数组
      let menu_list = JSON.parse(scope.row.menu_list);
      this.modificationDialog.centerDialogVisible = true;
      this.modificationDialog.dialogType = "edit";
      this.formData.id = scope.row.role_id;
      this.formData.name = scope.row.role_name;
      this.formData.describe = scope.row.role_desc;
      this.formData.menuList = menu_list ? menu_list.menuId : []; //菜单栏分配ID数组
      this.formData.actList = actArrList; //权限分配ID数组
    },
    //删除
    handleDelete(scope) {
      let data = {
        id: scope.row.role_id
      };
      console.log(data);
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeRole(data).then(res => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: res.message
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
    // 添加角色和修改角色
    handleAddRole() {
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
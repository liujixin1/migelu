<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改角色':'创建角色'"
      :visible.sync="dialog.centerDialogVisible"
      width="50%"
      center
      :lock-scroll="true"
      :before-close="hideDialog"
    >
      <el-form
        ref="form"
        :model="formData"
        label-width="100px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述：" prop="describe">
          <el-input v-model="formData.describe" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
        <div class="tab">
          <el-form-item v-if="formData.id != 1" label="权限分配：">
            <el-tree
              node-key="id"
              :default-checked-keys="formData.actList"
              :props="props"
              :data="dialogPermissionCenter"
              show-checkbox
              ref="permissionTree"
            ></el-tree>
          </el-form-item>
          <el-form-item label="菜单栏分配：">
            <el-tree
              node-key="id"
              :default-checked-keys="formData.menuList"
              :props="props"
              :data="dialogmenuCenter"
              show-checkbox
              ref="menuTree"
            ></el-tree>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { editRole } from "@/api/permission/roleList";
export default {
  props: {
    dialog: Object,
    dialogPermissionCenter: Array,
    dialogmenuCenter: Array,
    props: Object,
    formData: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "填写角色名称", trigger: "blur" }],
        describe: [{ required: true, message: "填写描述", trigger: "blur" }]
      },
      arrid: []
    };
  },
  methods: {
    hideDialog() {
      if (this.formData.id != 1) {
        this.$refs.permissionTree.setCheckedKeys([]); //清空权限分配tree控件
      }
      this.$refs.menuTree.setCheckedKeys([]); //清空菜单栏分配tree控件
      this.dialog.centerDialogVisible = false;
    },
    //提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let permissionArr = [];
          let permissionTree =
            this.formData.id != 1
              ? this.$refs.permissionTree.getCheckedNodes()
              : [];
          let menuTree = this.$refs.menuTree.getCheckedNodes();
          let menuCenter = this.dialogmenuCenter;
          for (var i = 0; i < permissionTree.length; i++) {
            if (permissionTree[i].id) {
              permissionArr.push(permissionTree[i].id);
            }
          }
          let menuId = this.nodeArr(menuTree);
          // let menu = this.menuList(menuId, menuCenter, menuCenter, 3);
          //菜单ID和菜单栏
          let menuData = {
            menuId
            // menu
          };
          // return false;
          if (permissionArr.length > 0 || this.formData.id == 1) {
            if (menuId.length > 0) {
              let data = {
                role_id: this.formData.id,
                role_name: this.formData.name,
                role_desc: this.formData.describe,
                right: permissionArr,
                menu: JSON.stringify(menuData)
              };
              editRole(data)
                .then(res => {
                  if (res.code == 0) {
                    this.$message({
                      message: res.message,
                      type: "success"
                    });
                    this.hideDialog();
                    this.$emit("upData");
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              this.$message({
                message: "请选择菜单栏",
                type: "warning"
              });
            }
          } else {
            this.$message({
              message: "请选择权限分配",
              type: "warning"
            });
          }
        }
      });
    },
    //获取全部添加role菜单列表
    menuList(arrId, menu, menus, roles) {
      arrId.forEach(id => {
        let nodeObj = function(id, menu) {
          menu.forEach(data => {
            if (data.id == id) {
              if (data.meta) {
                let bool = data.meta.role.find(res => {
                  return res == roles;
                });
                if (!bool) {
                  data.meta.role.push(roles);
                }
                if (data.parentId) {
                  nodeObj(data.parentId, menus);
                }
              }
            }
            if (data.children && data.children.length) {
              nodeObj(id, data.children);
            }
          });
        };
        nodeObj(id, menu);
      });
      return menu;
    },
    //获取选中菜单ID
    nodeArr(menuCenter) {
      let arr = [];
      menuCenter.forEach(res => {
        if (!res.children) {
          arr.push(res.id);
        }
        if (res.children && res.children.length) {
          this.nodeArr(res.children);
        }
      });
      return arr;
    },
    cancelTree() {
      this.$refs.permissionTree.setCheckedKeys([]);
      this.$refs.menuTree.setCheckedKeys([]);
    },
    //取消
    cancel() {
      this.hideDialog();
    }
  }
};
</script>
<style scoped>
.tab {
  display: flex;
}
.tab .el-form-item {
  flex: 1;
}
</style>
<template>
  <div class="container">
    <el-dialog
      class="dialog"
      :title="dialog.dialogType==='edit'?'修改权限资源':'创建权限资源'"
      :visible.sync="dialog.centerDialogVisible"
      center
      width="35%"
      :lock-scroll="true"
      @close="hideDialog"
      @open="getData"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="120px"
        style="margin:10px;width:auto"
        label-position="left"
      >
        <el-form-item label="权限名称：" prop="name">
          <el-input style="width:200px" v-model="formData.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="所属分组：" prop="grouping">
          <el-select v-model="formData.grouping" v-on:change="oneChange" placeholder="请选择分组">
            <el-option
              v-for="(item,index) in groupingList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加权限码：">
          <el-select
            v-model="formData.getController"
            v-on:change="twoChange(formData.getController)"
            placeholder="请选择权限码"
          >
            <el-option
              v-for="(item,index) in getControllerList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择权限码：">
          <div class="radioList">
            <el-radio-group v-for="(item,index) in getActionsList" :key="index" v-model="radio">
              <el-radio :label="index" @change="btnChange(index)">{{item}}</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="权限码：" prop="getActions">
          <el-input style="width:200px" v-model="formData.getActions" disabled />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  permissionGrouping,
  permissionGetControllers,
  permissionGetActions,
  getRightInfo,
  submit
} from "@/api/permission/sysAuthoritiesResources";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "填写角色名称", trigger: "blur" }],
        grouping: [{ required: true, message: "选择分组", trigger: "change" }],
        getActions: [
          { required: true, message: "选择权限码", trigger: "change" }
        ]
      },
      groupingList: null,
      getControllerList: null,
      getActionsList: null,
      radio: null,
      formData: {
        id: "",
        name: "",
        grouping: "",
        groupingCode: "",
        getController: "",
        getActions: ""
      }
    };
  },
  methods: {
    //选择分组
    oneChange() {
      this.formData.groupingCode = this.formData.grouping;
    },
    usedInPar(e) {
      this.getActionsList = null;
    },
    //选择添加权限码
    twoChange(e) {
      this.permissionGetActions(e);
      this.radio = null;
    },
    //选择权限码
    btnChange(e) {
      this.formData.getActions =
        this.formData.getController + "@" + this.getActionsList[e];
    },
    getData() {
      //获取页面数据
      if (this.dialog.dialogType === "edit") {
        let data = {
          id: this.dialog.id
        };
        getRightInfo(data).then(res => {
          this.formData = {
            id: this.dialog.id,
            name: res.data.name,
            grouping: res.data.group_name,
            groupingCode: res.data.group,
            getController: "",
            getActions: res.data.right
          };
        });
      }

      //分组
      permissionGrouping()
        .then(res => {
          if (res.code == 0) {
            this.groupingList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
      //添加权限码
      permissionGetControllers()
        .then(res => {
          if (res.code == 0) {
            this.getControllerList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //方法列表
    permissionGetActions(e) {
      let data = {
        controller: e
      };

      permissionGetActions(data)
        .then(res => {
          if (res.code == 0) {
            this.getActionsList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //关闭dialog
    hideDialog() {
      this.dialog.centerDialogVisible = false;
      this.getActionsList = null;
      this.formData = {};
      this.$refs["form"].resetFields();
    },

    //提交
    confirm(form) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            id: this.formData.id ? this.formData.id : "",
            name: this.formData.name,
            group: this.formData.groupingCode,
            right: this.formData.getActions
          };
          submit(data)
            .then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$emit("upData");
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });

          this.hideDialog();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消
    cancel() {
      this.hideDialog();
    }
  }
};
</script>
<style scoped>
.radioList {
  border: 1px solid #dcdfe6;
  min-height: 40px;
  border-radius: 4px;
}
.el-radio-group {
  margin-left: 10px;
}
</style>
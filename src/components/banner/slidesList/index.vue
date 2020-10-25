<template>
  <div class="container">
    <el-dialog
      :title="this.addDialog.dialogType=='edit'?'修改banner图':'创建banner图'"
      :visible.sync="addDialog.centerDialogVisible"
      width="700px"
      center
      @open="getData"
      @close="hideDialog()"
      :lock-scroll="true"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="150px" label-position="left">
        <el-form-item label="banner标题：" prop="name">
          <el-input v-model="form.name" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="banner跳转链接" prop="redirect_url">
          <el-input v-model="form.redirect_url" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="是否显示：" prop="is_show">
          <el-radio-group v-model="form.is_show">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="上传照片：">
          <div class="photo">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="handleAvatarSuccess"
            >
              <el-image v-if="form.imageUrl" fit="scale-down" :src="form.imageUrl" class="avatar"></el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="uploadMsg">
            <div>图片应小于200KB，尺寸为670*260，格式为PNG格式。</div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { add, show, update } from "@/api/banner/slidesList";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/pagination";

export default {
  props: {
    addDialog: Object,
  },
  components: {
    pagination: Pagination,
  },
  data() {
    return {
      //分页
      pageData: {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper",
      },
      form: {
        name: "",
        redirect_url: "",
        is_show: "1",
        imageUrl: "",
        sort: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入banner标题", trigger: "blur" },
        ],
        redirect_url: [
          { required: true, message: "请输入banner跳转链接", trigger: "blur" },
        ],
        // imageUrl: [{ required: true, message: "请上传图片", trigger: "change" }]
      },
      baseUrl: "",
    };
  },
  created() {
    let url = this.$axios.defaults.baseURL;
    let endlength = url.indexOf("/index");
    this.baseUrl = url.substring(0, endlength);
  },
  methods: {
    getData() {
      if (this.addDialog.dialogType == "edit") {
        let data = {
          id: this.addDialog.id,
        };
        show(data).then((res) => {
          if (res.code == 0) {
            this.form = {
              name: res.data.name,
              redirect_url: res.data.redirect_url,
              is_show: res.data.is_show + "",
              imageUrl: res.data.img_url,
              sort: res.data.sort,
            };
          }
        });
      }
    },
    hideDialog() {
      this.addDialog.centerDialogVisible = false;
      this.form = {
        name: "",
        redirect_url: "",
        is_show: "2",
        imageUrl: "",
        sort: "",
      };
    },
    //图片上传
    handleAvatarSuccess(param) {
      console.log(param.file);
      let data = new window.FormData();
      data.append("uploadType", "form");
      data.append("uploadfiles", param.file);
      data.append("type", "popupadv");
      data.append("opt", "single");
      data.append("token", getToken());
      console.log(data);
      this.$axios.post("api/Common/uploadImg", data).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.message || res.data.msg,
            type: "success",
          });
          this.form.imageUrl = res.data.data.url;
        }
      });
    },

    //提交
    confirm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (!this.form.imageUrl) {
            this.$message({
              message: "请上传图片",
              type: "info",
            });
          } else {
            let data = {
              name: this.form.name,
              redirect_url: this.form.redirect_url,
              is_show: this.form.is_show,
              img_url: this.form.imageUrl,
              sort: this.form.sort,
            };
            console.log(data);
            // return;
            if (this.addDialog.dialogType == "edit") {
              data.id = this.addDialog.id;
              update(data).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    message: res.message,
                    type: "success",
                  });
                  this.hideDialog();
                  this.$emit("upData");
                } else {
                  this.$message({
                    message: res.message,
                    type: "error",
                  });
                }
              });
            } else {
              add(data).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    message: res.message,
                    type: "success",
                  });
                  this.hideDialog();
                  this.$emit("upData");
                } else {
                  this.$message({
                    message: res.message,
                    type: "error",
                  });
                }
              });
            }
          }
        }
      });
    },
    //取消
    cancel() {
      this.hideDialog();
    },
  },
};
</script>
<style scoped>
.remove {
  margin: 0 auto;
  display: block;
}
.photo {
  border: 1px dashed #d9d9d9;
  width: 178px;
  height: 178px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-tag {
  margin-right: 5px !important;
}
.top {
  margin-bottom: 5px;
}
.uploadMsg {
  margin-top: 10px;
}
.uploadMsg div {
  line-height: 20px;
  color: red;
}
</style>
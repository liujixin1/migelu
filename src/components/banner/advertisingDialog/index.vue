<template>
  <div class="container">
    <el-dialog
      :title="this.addDialog.dialogType == 'edit' ? '修改广告图' : '创建广告图'"
      :visible.sync="addDialog.centerDialogVisible"
      width="800px"
      center
      @open="getData"
      @close="hideDialog()"
      :lock-scroll="true"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="广告图名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入消息标题" />
        </el-form-item>

        <el-form-item label="视频id串">
          <el-select
            size="small"
            v-model="inside.value"
            :multiple="false"
            filterable
            remote
            center
            reserve-keyword
            placeholder="请选择视频"
            :remote-method="insideRemoteMethod"
            :loading="inside.loading"
            style="width: 300px"
            @change="getOptionId(inside.value)"
          >
            <el-option
              v-for="item in inside.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-circle-plus"
            @click="addVideo()"
            >添加</el-button
          >
          <div class="itemList">
            <el-tag
              v-for="tag in tags"
              :key="tag.name"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
              :type="tag.type"
            >
              {{ tag.name }}
            </el-tag>
          </div>

          <!-- <div style="margin-bottom: 5px">
            <el-input
              v-model="videoName"
              placeholder="请输入消息标题"
              style="width: 200px"
            />
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              class="handleSearch"
              @click="handleSearch()"
              >查询</el-button
            >
          </div>
          <el-transfer
            :titles="['视频列表1', '视频列表2']"
            v-model="form.video_id"
            @change="handleChange"
            :data="videoList"
          >
          </el-transfer> -->
          <!-- <el-select style="width:500px" v-model="form.video_id" multiple placeholder="请选择视频">
            <el-option
              v-for="item in videoList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <!-- <el-input v-model="form.video_id" placeholder="请输入视频id串" /> -->
        </el-form-item>

        <el-form-item label="是否显示：" prop="is_show">
          <el-radio-group v-model="form.is_show">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
              <el-image
                v-if="form.imageUrl"
                fit="scale-down"
                :src="form.imageUrl"
                class="avatar"
              ></el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="uploadMsg">
            <div>全屏图片应小于200KB，尺寸为670*260，格式为PNG格式。</div>
            <div>居中小图应小于200KB，尺寸为320*186，格式为PNG格式。</div>
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
import {
  add,
  show,
  update,
  getSelectVideo,
} from "@/api/banner/advertisingList";
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
        type: 1,
        is_show: "1",
        imageUrl: "",
        sort: "",
        // video_id: [],
      },
      type: [
        {
          value: 1,
          label: "绘本",
        },
        {
          value: 2,
          label: "儿歌",
        },
      ],
      baseUrl: "",
      // videoList: [],
      inside: {
        innerVisible: false,
        options: [],
        list: [],
        loading: false,
      },
      tags: [],
      videoItme: {},
      rules: {
        name: [
          { required: true, message: "请输入banner标题", trigger: "blur" },
        ],
        // tags: [{ required: true, message: "请输入视频id串", trigger: "blur" }],
        // imageUrl: [{ required: true, message: "请上传图片", trigger: "change" }]
      },
    };
  },
  created() {
    let url = this.$axios.defaults.baseURL;
    let endlength = url.indexOf("/index");
    this.baseUrl = url.substring(0, endlength);
  },
  methods: {
    //获取修改数据
    getVideoData() {
      let data = {
        name: "",
        page: 1,
        limit: 50,
      };
      //获取视频列表
      getSelectVideo(data).then((res) => {
        this.inside.options = res.data.data.map((item) => {
          return { value: `${item.id}`, label: `${item.name}` };
        });
      });
    },
    // getVideo(query = "") {
    //   let data = {
    //     name: query,
    //     limit: 1000,
    //     page: 1,
    //   };
    //   getSelectVideo(data).then((res) => {
    //     res.data.data.forEach((item, index) => {
    //       this.videoList.push({
    //         value: item.id + "",
    //         key: index,
    //         label: item.name,
    //       });
    //     });
    //   });
    // },
    // handleSearch() {
    //   this.videoList = [];
    //   this.getVideo(this.videoName);
    // },
    getData() {
      if (this.addDialog.dialogType == "edit") {
        let data = {
          id: this.addDialog.id,
        };
        show(data).then((res) => {
          if (res.code == 0) {
            this.form = {
              name: res.data.name,
              // video_id: res.data.video_id.split(","),
              is_show: res.data.is_show + "",
              imageUrl: res.data.img_url,
              sort: res.data.sort,
              type: res.data.type,
            };
            this.tags = res.data.videoInfo;
          }
        });
      }
      this.getVideoData();
    },
    getOptionId(e) {
      let arr = this.inside.options.filter((res) => {
        return res.value == e;
      });
      this.videoItme = { name: arr[0].label, id: arr[0].value };
    },
    // 搜索视频列表
    insideRemoteMethod(query) {
      if (query !== "") {
        this.getSupplierList(query);
      } else {
        this.inside.options = [];
      }
    },
    //获取视频列表数据
    getSupplierList(query) {
      let data = {
        name: query,
        page: 1,
        limit: 50,
      };
      this.inside.loading = true;
      getSelectVideo(data).then((res) => {
        this.inside.options = res.data.data.map((item) => {
          return { value: `${item.id}`, label: `${item.name}` };
        });
        this.inside.loading = false;
      });
    },
    hideDialog() {
      this.addDialog.centerDialogVisible = false;
      this.form = {
        name: "",
        type: 1,
        is_show: "1",
        imageUrl: "",
        sort: "",
        // video_id: [],
      };
      this.inside={
        innerVisible: false,
        options: [],
        list: [],
        loading: false,
      }
      // this.videoList = [];
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    //图片上传
    handleAvatarSuccess(param) {
      let data = new window.FormData();
      data.append("uploadType", "form");
      data.append("uploadfiles", param.file);
      data.append("type", "popupadv");
      data.append("opt", "single");
      data.append("token", getToken());
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
    //添加
    addVideo() {
      let arr = this.tags.filter((res) => {
        return res.id == this.videoItme.id;
      });
      if (arr.length > 0) {
        this.$message({
          message: "视频已添加",
        });
      } else {
        this.tags.push({
          name: this.videoItme.name,
          id: this.videoItme.id,
        });
      }
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
          } else if (this.tags.length == 0) {
            this.$message({
              message: "请添加视频id串",
              type: "info",
            });
          } else {
            let video_id = [];
            this.tags.forEach((res) => {
              video_id.push(res.id);
            });
            let data = {
              name: this.form.name,
              video_id:video_id.join(","),
              is_show: this.form.is_show,
              img_url: this.form.imageUrl,
              sort: this.form.sort,
              type: this.form.type,
            };
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
.itemList {
  border: 1px solid #eee;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 3px;
  min-height: 60px;
}
</style>
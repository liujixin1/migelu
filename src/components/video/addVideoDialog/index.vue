<template>
  <div class="container">
    <el-dialog
      :title="this.addDialog.dialogType=='edit'?'修改视频库':'创建视频库'"
      :visible.sync="addDialog.centerDialogVisible"
      width="700px"
      center
      @open="getData"
      @close="hideDialog()"
      :lock-scroll="true"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="150px" label-position="left">
        <el-form-item label="视频名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入视频名称" />
        </el-form-item>
        <!-- <el-form-item label="banner跳转链接" prop="redirect_url">
          <el-input v-model="form.redirect_url" placeholder="请输入跳转链接" />
        </el-form-item>-->
        <!-- <el-form-item label="是否显示：" prop="is_show">
          <el-radio-group v-model="form.is_show">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="排序：">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="适合年龄段：">
          <el-select v-model="form.age_type" placeholder="请选择年龄阶段">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="上传照片：">
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
            <div>全屏图片应小于200KB，尺寸为290*350，格式为PNG格式。</div>
            <div>居中小图应小于200KB，尺寸为230*320，格式为PNG格式。</div>
          </div>
        </el-form-item>-->
        <el-form-item label="上传视频：">
          <div class="upload">
            <div id="video_container">
              <el-button id="pickfiles" type="primary">选择视频</el-button>
              <div>
                <!-- <div class="upload_info">
                  <b>共{{ fileSize }}MB | 已上传{{ fileLoaded }} | 上传速度{{ fileSpeed }}/s</b>
                </div>
                <div>
                  <b>上传进度：{{ filePercent }}%</b>
                </div>
                <button @click="pauseUpload">暂停上传</button>
                <button @click="continueUpload">继续上传</button>-->
              </div>
            </div>
            <!-- <div class="cover-pic" v-if="coverPic">
              <img :src="coverPic" alt />
            </div>-->
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
import { getUpToken } from "@/api/video/videoList";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/pagination";
require("qiniu-js/dist/qiniu.min.js");

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
        // redirect_url: "",
        age_type: "",
        // is_show: "1",
        imageUrl: "",
        sort: "",
      },
      type: [
        {
          value: 1,
          label: "3-6岁",
        },
        {
          value: 2,
          label: "6-9岁",
        },
        {
          value: 3,
          label: "9-12岁",
        },
        {
          value: 4,
          label: "12-15岁",
        },
      ],
      rules: {
        name: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
        // redirect_url: [
        //   { required: true, message: "请输入banner跳转链接", trigger: "blur" },
        // ],
        // imageUrl: [{ required: true, message: "请上传图片", trigger: "change" }]
      },
      baseUrl: "",
      // fileSize: 0,
      // fileLoaded: 0,
      // fileSpeed: 0,
      // filePercent: 0,
      uploader: null,
      token: "",
      filename: "",
      hash: "",
      resFileName: "",
      coverPic: "",
      // phoneType: null,
      domain: "",
    };
  },
  created() {
    let url = this.$axios.defaults.baseURL;
    let endlength = url.indexOf("/index");
    this.baseUrl = url.substring(0, endlength);
  },
  methods: {
    getData() {
      // this.phoneType = this.getPhoneType();
      this.getToken(() => {
        this.initUploader();
      });
      // if (this.addDialog.dialogType == "edit") {
      //   let data = {
      //     id: this.addDialog.id,
      //   };
      //   show(data).then((res) => {
      //     if (res.code == 0) {
      //       this.form = {
      //         name: res.data.name,
      //         redirect_url: res.data.redirect_url,
      //         // is_show: res.data.is_show + "",
      //         imageUrl: res.data.img_url,
      //         sort: res.data.sort,
      //       };
      //     }
      //   });
      // }
    },
    hideDialog() {
      this.addDialog.centerDialogVisible = false;
      this.form = {
        name: "",
        // redirect_url: "",
        // is_show: "2",
        imageUrl: "",
        sort: "",
      };
    },
    //图片上传
    // handleAvatarSuccess(param) {
    //   console.log(param.file);
    //   let data = new window.FormData();
    //   data.append("uploadType", "form");
    //   data.append("uploadfiles", param.file);
    //   data.append("type", "popupadv");
    //   data.append("opt", "single");
    //   data.append("token", getToken());
    //   console.log(data);
    //   this.$axios.post("api/Common/uploadImg", data).then((res) => {
    //     if (res.data.code == 0) {
    //       this.$message({
    //         message: res.data.message || res.data.msg,
    //         type: "success",
    //       });
    //       this.form.imageUrl = res.data.data.url;
    //     }
    //   });
    // },

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
              // redirect_url: this.form.redirect_url,
              // is_show: this.form.is_show,
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
    // pauseUpload() {
    //   this.uploader.stop();
    // },
    // continueUpload() {
    //   this.uploader.start();
    // },
    // toDecimal(size) {
    //   size = size / 1024 / 1024;
    //   var f = parseFloat(size);
    //   if (isNaN(f)) {
    //     return;
    //   }
    //   f = Math.round(size * 10) / 10;
    //   var s = f.toString();
    //   var rs = s.indexOf(".");
    //   if (rs < 0) {
    //     rs = s.length;
    //     s += ".";
    //   }
    //   while (s.length <= rs + 1) {
    //     s += "0";
    //   }
    //   return s;
    // },
    initUploader() {
      let plupload = window.plupload;
      let Qiniu = global.Qiniu;
      let _this = this;
      // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
      // let isIphone5 = this.phoneType === "5";
      // uploader为一个plupload对象，继承了所有plupload的方法

      this.uploader = Qiniu.uploader({
        runtimes: "html5,flash,html4", // 上传模式，依次退化
        browse_button: "pickfiles", // 上传选择的点选按钮，必需
        uptoken: _this.token, // uptoken是上传凭证，由其他程序生成
        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
        bucket_name: "common-web", // 空间名
        unique_names: false, // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
        save_key: false, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
        domain: _this.domain, // bucket domain eg:http://qiniu-plupload.qiniudn.com/
        container: "video_container", // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: "100mb", // 最大文件体积限制
        dragdrop: false, // 开启可拖曳上传
        drop_element: "video_container", // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: "4mb", // 分块上传时，每块的体积
        max_retries: 3, // 上传失败最大重试次数
        auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        // multi_selection: !isIphone5,
        filters: {
          max_file_size: "100mb",
          prevent_duplicates: false,
          // Specify what files to browse for
          mime_types: [
            { title: "视频格式", extensions: "mp4" }, // 限定文件后缀上传格式上传
          ],
        },
        init: {
          Key: function (up, files) {
            return _this.filename;
          },
          FilesAdded: function (up, files) {
            plupload.each(files, function (file) {
              // 文件添加进队列后，处理相关的事情
              console.log("FilesAdded");
              // _this.fileSize = _this.toDecimal(file.size);
            });
          },
          BeforeUpload: function (up, file) {
            console.log("BeforeUpload");
          },
          ChunkUploaded: function (up, file, info) {
            console.log("ChunkUploaded");
          },
          UploadProgress: function (up, file) {
            // 每个文件上传时，处理相关的事情
            console.log(file, 222222);
            _this.filePercent = parseInt(file.percent);
            _this.fileLoaded = plupload.formatSize(file.loaded).toUpperCase();
            _this.fileSpeed = plupload.formatSize(file.speed).toUpperCase();
          },
          FileUploaded: function (up, file, info) {
            console.log("FileUploaded");
            let response = JSON.parse(info.response);
            console.log(up, 1);
            console.log(file, 2);
            console.log(info, 3);
            _this.getToken(function () {});
            _this.hash = response.hash;
            _this.resFileName = response.key;
            console.log(response, 111111);
            _this.coverPic =
              "https://xxx.com/" + response.key + "?vframe/png/offset/7/w/480";
          },
          Error: function (up, err, errTip) {
            // 上传出错时，处理相关的事情
            _this.$message({
              type: "info",
              message: err,
            });
            _this.$message({
              type: "info",
              message: errTip,
            });
          },
          UploadComplete: function () {
            // 队列文件处理完毕后，处理相关的事情
            _this.$message({
              type: "success",
              message: "UploadComplete",
            });
          },
        },
      });
    },
    getToken(callback) {
      this.filename = "webvideo/" + new Date().getTime() + ".mp4";
      getUpToken().then((res) => {
        this.token = res.data.uptoken;
        this.domain = res.data.domain;
        callback();
      });
    },
    // getPhoneType() {
    //   // 正则,忽略大小写
    //   var patternPhone = new RegExp("iphone", "i");
    //   var patternAndroid = new RegExp("Android", "i");
    //   var userAgent = navigator.userAgent.toLowerCase();
    //   var isAndroid = patternAndroid.test(userAgent);
    //   var isIphone = patternPhone.test(userAgent);
    //   var phoneType = "phoneType";
    //   if (isAndroid) {
    //     var zhCnIndex = userAgent.indexOf("-");
    //     var spaceIndex = userAgent.indexOf("build", zhCnIndex + 4);
    //     var fullResult = userAgent.substring(zhCnIndex, spaceIndex);
    //     phoneType = fullResult.split("")[1];
    //   } else if (isIphone) {
    //     // 6   w=375    6plus w=414   5s w=320     5 w=320
    //     var wigth =
    //       window.innerWidth ||
    //       document.documentElement.clientWidth ||
    //       document.body.clientWidth;
    //     if (wigth > 400) {
    //       phoneType = "iphone6 plus";
    //     } else if (wigth > 370) {
    //       phoneType = "iphone6";
    //     } else if (wigth > 315) {
    //       phoneType = "5";
    //     } else {
    //       phoneType = "iphone 4s";
    //     }
    //   } else {
    //     phoneType = "您的设备太先进了";
    //   }
    //   return phoneType;
    // },
  },
  mounted() {},
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
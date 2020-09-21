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
        <el-form-item label="排序：">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="时长(秒)：">
          <el-input-number v-model="form.date" :min="0"></el-input-number>
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
        <el-form-item label="上传视频封面：">
          <div class="upload">
            <el-image style="width:200px" v-if="imgStatus" :src="imgUrl"></el-image>
            <div id="img_container">
              <el-button id="imgPickfiles" type="primary">选择照片</el-button>
              <div></div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="上传视频：">
          <div class="upload">
            <video :src="videoUrl" v-if="videoStatus" controls="controls">您的浏览器不支持视频播放</video>
            <div id="video_container">
              <el-button id="videoPickfiles" type="primary">选择视频</el-button>
              <div></div>
            </div>
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
import { Loading } from "element-ui";

import { getUpToken, updata, store, show } from "@/api/video/videoList";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/pagination";
// require("qiniu-js/dist/qiniu.min.js");

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
        age_type: "",
        sort: 0,
        date: 0,
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
      },
      baseUrl: "",

      uploader: null,
      token: "",
      // videoName: "",
      // imgName:'',
      hash: "",
      resFileName: "",
      coverPic: "",
      videoUrl: "",
      videoStatus: false,
      imgUrl: "",
      imgStatus: false,
      domain: "",
      num: 1,
    };
  },
  created() {
    let url = this.$axios.defaults.baseURL;
    let endlength = url.indexOf("/index");
    this.baseUrl = url.substring(0, endlength);
  },
  methods: {
    getData() {
      this.getToken(() => {
        this.num += 1;
        if (this.num > 2) {
          return;
        } else {
          this.initUploader();
          this.initUploader_img();
        }
      });
      if (this.addDialog.dialogType == "edit") {
        let data = {
          id: this.addDialog.id,
        };
        show(data).then((res) => {
          if (res.code == 0) {
            this.form = {
              name: res.data.name,
              date: res.data.long_time,
              sort: res.data.sort,
              age_type: res.data.age_type,
            };
            this.videoUrl = res.data.video_url;
            this.videoStatus = true;
            this.imgUrl = res.data.img_url;
            this.imgStatus = true;
          }
        });
      }
    },
    hideDialog() {
      this.addDialog.centerDialogVisible = false;
      this.form = {
        name: "",
        age_type: "",
        sort: 0,
        date: 0,
      };
      this.videoUrl = "";
      this.videoStatus = false;
      this.imgUrl = "";
      this.imgStatus = false;
    },

    //提交
    confirm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (!this.imgUrl) {
            this.$message({
              message: "请上传视频封面",
              type: "info",
            });
          } else if (!this.videoUrl) {
            this.$message({
              message: "请上传视频",
              type: "info",
            });
          } else {
            let data = {
              name: this.form.name,
              video_url: this.videoUrl,
              img_url: this.imgUrl,
              long_time: this.form.date,
              sort: this.form.sort,
              age_type: this.form.age_type,
            };
            console.log(data);
            // return;
            if (this.addDialog.dialogType == "edit") {
              data.id = this.addDialog.id;
              updata(data).then((res) => {
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
              store(data).then((res) => {
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

    initUploader() {
      let plupload = window.plupload;
      let Qiniu = global.Qiniu;
      let _this = this;
      let login = _this.login();
      // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
      // let isIphone5 = this.phoneType === "5";
      // uploader为一个plupload对象，继承了所有plupload的方法
      this.uploader = Qiniu.uploader({
        runtimes: "html5,flash,html4", // 上传模式，依次退化
        browse_button: "videoPickfiles", // 上传选择的点选按钮，必需
        uptoken: _this.token, // uptoken是上传凭证，由其他程序生成
        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
        bucket_name: "common-web", // 空间名
        unique_names: true, // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
        save_key: false, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
        domain: _this.domain, // bucket domain eg:http://qiniu-plupload.qiniudn.com/
        container: "video_container", // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: "500mb", // 最大文件体积限制
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
            // return _this.videoName;
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
            login[0]();
            _this.filePercent = parseInt(file.percent);
            _this.fileLoaded = plupload.formatSize(file.loaded).toUpperCase();
            _this.fileSpeed = plupload.formatSize(file.speed).toUpperCase();
          },
          FileUploaded: function (up, file, info) {
            console.log("FileUploaded");
            console.log(file, 1111);
            login[1]();
            let response = JSON.parse(info.response);
            if (response.code == 0) {
              _this.$message({
                type: "success",
                message: "上传成功",
              });
              _this.videoUrl = response.data.url;
              _this.videoStatus = true;
            } else {
              _this.videoStatus = false;
            }
          },
          Error: function (up, err, errTip) {
            // 上传出错时，处理相关的事情
            login[0]();
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
            // _this.$message({
            //   type: "success",
            //   message:'' ,
            // });
          },
        },
      });
    },
    //图片上传
    initUploader_img() {
      let plupload = window.plupload;
      let Qiniu = global.Qiniu;
      let _this = this;
      let login = _this.login();
      // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
      // let isIphone5 = this.phoneType === "5";
      // uploader为一个plupload对象，继承了所有plupload的方法
      this.uploader = Qiniu.uploader({
        runtimes: "html5,flash,html4", // 上传模式，依次退化
        browse_button: "imgPickfiles", // 上传选择的点选按钮，必需
        uptoken: _this.token, // uptoken是上传凭证，由其他程序生成
        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
        bucket_name: "common-web", // 空间名
        unique_names: true, // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
        save_key: false, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
        domain: _this.domain, // bucket domain eg:http://qiniu-plupload.qiniudn.com/
        container: "img_container", // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: "500mb", // 最大文件体积限制
        dragdrop: false, // 开启可拖曳上传
        drop_element: "img_container", // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: "4mb", // 分块上传时，每块的体积
        max_retries: 3, // 上传失败最大重试次数
        auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        // multi_selection: !isIphone5,
        filters: {
          max_file_size: "100mb",
          prevent_duplicates: false,
          // Specify what files to browse for
          mime_types: [
            { title: "图片格式", extensions: "jpg,png" }, // 限定文件后缀上传格式上传
          ],
        },
        init: {
          Key: function (up, files) {
            // return _this.videoName;
          },
          FilesAdded: function (up, files) {
            plupload.each(files, function (file) {
              // 文件添加进队列后，处理相关的事情
              console.log("FilesAdded");
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
            login[0]();
            _this.filePercent = parseInt(file.percent);
            _this.fileLoaded = plupload.formatSize(file.loaded).toUpperCase();
            _this.fileSpeed = plupload.formatSize(file.speed).toUpperCase();
          },
          FileUploaded: function (up, file, info) {
            console.log("FileUploaded");
            login[1]();
            let response = JSON.parse(info.response);
            if (response.code == 0) {
              _this.$message({
                type: "success",
                message: "上传成功",
              });
              _this.imgUrl = response.data.url;
              _this.imgStatus = true;
            } else {
              _this.imgStatus = false;
            }
          },
          Error: function (up, err, errTip) {
            // 上传出错时，处理相关的事情
            login[0]();
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
            // _this.$message({
            //   type: "success",
            //   message:'' ,
            // });
          },
        },
      });
    },
    login() {
      let loading; //定义loading变量
      function startLoading() {
        //使用Element loading-start 方法
        loading = Loading.service({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.1)",
        });
      }
      function endLoading() {
        //使用Element loading-close 方法
        loading.close();
      }
      return [startLoading, endLoading];
    },
    getToken(callback) {
      // this.videoName = new Date().getTime() + ".mp4";
      // this.ImgName = new Date().getTime() + ".jpg";

      getUpToken().then((res) => {
        this.token = res.data.uptoken;
        this.domain = res.data.domain;
        callback();
      });
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
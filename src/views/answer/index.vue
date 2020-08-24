<template>
  <div class="container">
    <div class="top">
      <!-- <el-select style="width:130px;margin-bottom:5px;" v-model="search.field">
        <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select> -->
      <el-input style="width:150px;margin-bottom:5px;" v-model="search.phone" placeholder="请输入手机号码"></el-input>
      <el-select v-model="search.type" placeholder="请选择评测年龄阶段">
        <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="search.level" placeholder="请选择评测等级">
        <el-option v-for="item in level" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-date-picker
        v-model="date"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
      <el-button type="danger" class="handleSearch" icon="el-icon-delete" @click="empty()">清空</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
      <!-- <el-table-column prop="username" label="学员用户名" align="center"></el-table-column>
      <el-table-column prop="en_name" label="英文名" align="center"></el-table-column>
      <el-table-column prop="ch_name" label="中文名" align="center"></el-table-column> -->
      <el-table-column prop="phone" label="学员手机" align="center"></el-table-column>
      <el-table-column prop="levelMsg" label="评测等级" align="center"></el-table-column>
      <el-table-column prop="typeMsg" label="年龄阶段" align="center"></el-table-column>
      <el-table-column prop="add_time" label="评测时间" align="center"></el-table-column>
      <el-table-column prop="total_num" label="总题数" align="center"></el-table-column>
      <el-table-column prop="right_num" label="正确题数" align="center"></el-table-column>
      <el-table-column prop="error_num" label="错误题数" align="center"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
  </div>
</template>
<script>
import Pagination from "@/components/pagination";
import { selectCePingList } from "@/api/answer";
export default {
  components: {
    pagination: Pagination
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
      search: {
        // field: "username",
        // keyword: "",
        phone:'',
        start_date: "",
        end_date: "",
        type: "",
        level: ""
      },
      date: [],
      type: [
        {
          value: 1,
          label: "5-7岁"
        },
        {
          value: 2,
          label: "8岁以上"
        }
      ],
      level: [
        {
          value: "KB-1",
          label: "L4"
        },
        {
          value: "KB-2",
          label: "L5"
        },
        {
          value: "KB-3",
          label: "L6"
        },
        {
          value: "KB-4",
          label: "L7"
        },
        {
          value: "KB-5",
          label: "L8"
        },
        {
          value: "KB-6",
          label: "L9"
        }
      ],
      option: [
        {
          value: "username",
          label: "用户姓名"
        },
        {
          value: "ch_name",
          label: "中文姓名"
        },
        {
          value: "en_name",
          label: "英文姓名"
        },
        {
          value: "phone",
          label: "联系方式"
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
        start_date: this.search.start_date,
        end_date: this.search.end_date,
        // field: this.search.field,
        // keyword: this.search.keyword,
        phone:this.search.phone,
        type: this.search.type,
        level: this.search.level
      };

      selectCePingList(data)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.list.data.forEach(result => {
              result.typeMsg = result.type == 1 ? "5-7岁" : "8岁以上";
              switch (result.level) {
                case "KB-1":
                  result.levelMsg = "L4";
                  break;
                case "KB-2":
                  result.levelMsg = "L5";
                  break;
                case "KB-3":
                  result.levelMsg = "L6";
                  break;
                case "KB-4":
                  result.levelMsg = "L7";
                  break;
                case "KB-5":
                  result.levelMsg = "L8";
                  break;
                case "KB-6":
                  result.levelMsg = "L9";
                  break;
              }
            });
            this.tableData = res.data.list.data;
            this.pageData.page = res.data.list.current_page;
            this.pageData.pagesize = res.data.list.per_page;
            this.pageData.total = res.data.list.total;
          }
        })
        .catch(err => {
          console.log(err);
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

    // 搜索
    handleSearch() {
      console.log(this.date);
      if (this.date != []) {
        this.search.start_date = this.date[0];
        this.search.end_date = this.date[1];
      }
       this.pageData.page = 1;
      this.pageData.total = null;
      this.getData();
    },
    empty() {
      this.date = [];
      this.search = {
        // field: "username",
        // keyword: "",
        phone:'',
        start_date: "",
        end_date: "",
        type: "",
        level: ""
      };
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
  margin-bottom: 5px;
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
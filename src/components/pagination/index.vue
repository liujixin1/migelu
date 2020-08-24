<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleCurrentChange"
      @current-change="handleSizeChange"
       :current-page.sync='currentPage'
      :page-sizes="pageData.pageSizes"
      :page-size="pageData.pageSize"
      :layout="pageData.layout"
      :total="pageData.total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    pageData: Object
  },
  data() {
    return {

      currentPage: 1 //当前页数，当选取每页条数的时候，让页数码返回到1
    };
  },
  methods: {
    //每页多少条
    handleCurrentChange(val) {
      this.currentPage = 1;
      this.$emit("pagesize", val);
    },
    //选取页数
    handleSizeChange(page) {
      this.$emit("page", page);
    }
  }
};
</script>
<style scoped>
.pagination {
  text-align: right;
  padding: 10px;
}
</style>
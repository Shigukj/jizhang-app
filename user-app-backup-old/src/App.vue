<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #F5F5F5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #262626;
}

/* 主色 */
.text-primary {
  color: #00A5A0;
}

.bg-primary {
  background-color: #00A5A0;
}

/* 收入支出色 */
.text-expense {
  color: #FF4D4F;
}

.text-income {
  color: #52C41A;
}

/* 通用卡片样式 */
.card {
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
}

/* 安全区域 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

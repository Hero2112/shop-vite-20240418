<template>
  <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
    <vab-card :body-style="{ height: '240px' }" skeleton>
      <template #header>{{ title }}</template>
      <vab-chart :option="option" />
    </vab-card>
  </el-col>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabChartPie',
})

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const settingsStore = useSettingsStore()
const { color } = storeToRefs(settingsStore)
let timer: any = null

const option = reactive<any>({
  grid: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40,
  },
  tooltip: {
    trigger: 'item',
  },
  series: {
    name: '访问来源',
    type: 'pie',
    radius: ['40%', '80%'],
    itemStyle: {
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 2,
    },
    data: [
      { value: random(0, 100), name: '搜索引擎' },
      { value: random(0, 100), name: '直接访问' },
      { value: random(0, 100), name: '邮件营销' },
      { value: random(0, 100), name: '联盟广告' },
      { value: random(0, 100), name: '视频广告' },
    ],
  },
})

watch(
  color,
  () => {
    option.color = [color.value]
  },
  { immediate: true }
)

onActivated(() => {
  timer = setInterval(() => {
    option.series.data = [
      { value: random(0, 100), name: '搜索引擎' },
      { value: random(0, 100), name: '直接访问' },
      { value: random(0, 100), name: '邮件营销' },
      { value: random(0, 100), name: '联盟广告' },
      { value: random(0, 100), name: '视频广告' },
    ]
  }, 3000)
})

onDeactivated(() => {
  if (timer) clearInterval(timer)
})
</script>

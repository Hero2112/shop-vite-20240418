<template>
  <div class="split-table-container no-background-container auto-height-container">

    <vab-card class="auto-height-card hidden-sm-and-up">
      <vab-alert title="手机端不支持分割表格演示" type="warning" />
    </vab-card>

    <vab-pane-split class="hidden-xs-only" ratio="4/20">
      <template #one>
        <vab-card class="auto-height-card">
          <el-input v-model="filterText" placeholder="请输入查询条件" style="margin-bottom: 10px" />
          <el-tree
            ref="treeRef"
            :data="data"
            default-expand-all
            :filter-node-method="filterNode"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </vab-card>
      </template>
      <template #two>
        <vab-card class="auto-height-card">
          <vab-alert title="长按竖线左右拖拽可重新分割面板大小" />
          <vab-query-form>
            <vab-query-form-top-panel>
              <el-form inline label-width="49px" :model="queryForm" @submit.prevent>
                <el-form-item label="标题">
                  <el-input v-model="queryForm.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item v-show="!fold" label="标题">
                  <el-input v-model="queryForm.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item v-show="!fold" label="标题">
                  <el-input v-model="queryForm.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item v-show="!fold" label="标题">
                  <el-input v-model="queryForm.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item v-show="!fold" label="标题">
                  <el-input v-model="queryForm.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item v-show="!fold" label="标题">
                  <el-input v-model="queryForm.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item v-show="!fold" label="标题">
                  <el-input v-model="queryForm.title" clearable placeholder="请输入标题" />
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData">查询</el-button>
                  <el-button class="hidden-xs-only" text type="primary" @click="handleFold">
                    <span v-if="fold">展开</span>
                    <span v-else>合并</span>
                    <vab-icon class="vab-dropdown" :class="{ 'vab-dropdown-active': fold }" icon="arrow-up-s-line" />
                  </el-button>
                </el-form-item>
              </el-form>
            </vab-query-form-top-panel>
            <vab-query-form-left-panel :span="24">
              <el-button :icon="Plus" type="primary" @click="handleAdd">添加</el-button>
              <el-button :icon="Delete" type="danger" @click="handleDelete">删除</el-button>
              <el-button type="primary" @click="handleDetail">详情</el-button>
              <el-button class="hidden-xs-only" type="primary" @click="handleDetailStayTable">后台打开详情</el-button>
            </vab-query-form-left-panel>
          </vab-query-form>
          <el-table ref="tableRef" v-loading="listLoading" border :data="list" @selection-change="setSelectRows">
            <el-table-column type="selection" width="38" />
            <el-table-column align="center" label="序号" width="55">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="序号" width="55">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="标题" min-width="200" prop="title" />
            <el-table-column align="center" label="作者" prop="author" />
            <el-table-column align="center" label="评级" min-width="200">
              <template #default="{ row }">
                <el-rate v-model="row.rate" disabled />
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量" min-width="100" prop="count" sortable />
            <el-table-column align="center" label="开关" prop="switch">
              <template #default="{ row }">
                <el-switch v-model="row.switch" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" min-width="100">
              <template #default="{ row }">
                <el-tag effect="dark" :type="statusFilter(row.status)">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="时间" min-width="160" prop="datetime" />
            <el-table-column align="center" label="操作" width="215">
              <template #default="{ row }">
                <el-button text type="primary" @click="handleDetail(row)">详情</el-button>
                <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
                <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" />
            </template>
          </el-table>
          <vab-pagination
            :current-page="queryForm.pageNo"
            :page-size="queryForm.pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </vab-card>
      </template>
    </vab-pane-split>

    <default-table-edit ref="editRef" @fetch-data="fetchData" />
  </div>
  
</template>

<script lang="ts" setup>
import { Delete, Plus, Search } from '@element-plus/icons-vue'
import { ElTree } from 'element-plus'
import { doDelete, getList } from '/@/api/table'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'

defineOptions({
  name: 'SplitTable',
})

const router = useRouter()
const $baseConfirm = inject<any>('$baseConfirm')
const $baseMessage = inject<any>('$baseMessage')
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)
const tableRef = ref<any>(null)
const fold = ref<boolean>(true)
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<any>(0)
const selectRows = ref<any>([])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})

const filterText = ref<string>('')
const treeRef = ref<InstanceType<typeof ElTree>>()

watch(filterText, (value) => {
  treeRef.value?.filter(value)
})

const filterNode: any = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const data: Tree[] = [
  {
    id: 1,
    label: '一级 1',
    children: [
      {
        id: 4,
        label: '二级 1-1',
        children: [
          {
            id: 9,
            label: '三级 1-1-1',
          },
          {
            id: 10,
            label: '三级 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: '一级 2',
    children: [
      {
        id: 5,
        label: '二级 2-1',
      },
      {
        id: 6,
        label: '二级 2-2',
      },
    ],
  },
  {
    id: 3,
    label: '一级 3',
    children: [
      {
        id: 7,
        label: '二级 3-1',
      },
      {
        id: 8,
        label: '二级 3-2',
      },
    ],
  },
]
const handleNodeClick = () => {
  fetchData()
}

const defaultProps = {
  children: 'children',
  label: 'label',
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const statusFilter = (status: string | number) => {
  const statusMap: any = {
    published: 'success',
    draft: 'primary',
    deleted: 'danger',
  }
  return statusMap[status]
}

const handleFold = () => {
  fold.value = !fold.value
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row = {}) => {
  editRef.value.showEdit(row)
}

const handleDelete = (row: any) => {
  if (row.id) {
    $baseConfirm('您确定要删除当前项吗', null, async () => {
      const { msg }: any = await doDelete({ ids: row.id })
      $baseMessage(msg, 'success', 'hey')
      await fetchData()
    })
  } else {
    if (selectRows.value.length > 0) {
      const ids = selectRows.value.map((item: { id: any }) => item.id).join()
      $baseConfirm('您确定要删除选中项吗', null, async () => {
        const { msg }: any = await doDelete({ ids })
        $baseMessage(msg, 'success', 'hey')
        await fetchData()
      })
    } else {
      $baseMessage('您未选中任何行', 'warning', 'hey')
    }
  }
}

const handleDetailStayTable = async () => {
  if (selectRows.value.length === 1)
    for (let i = 0; i < selectRows.value.length; i++) {
      const matched = handleMatched(allRoutes.value, '/vab/table/defaultTableDetail')
      const tab = handleTabs({
        ...matched[matched.length - 1],
        query: selectRows.value[i],
      })
      if (tab) {
        await addVisitedRoute(tab)
        await changeTabsMeta({
          title: '详情页',
          meta: {
            title: `${tab.query.title} 详情页`,
          },
        })
      }
    }
  else $baseMessage('请选择一行进行详情页跳转', 'warning', 'hey')
}

const handleDetail = (row: any) => {
  if (row.id)
    router.push({
      path: '/vab/table/defaultTableDetail',
      query: {
        ...row,
        timestamp: Date.now(), //允许同一个详情页同时打开多次，否则会触发路由被缓存下次无法刷新的bug
      },
    })
  else {
    if (selectRows.value.length === 1)
      router.push({
        path: '/vab/table/defaultTableDetail',
        query: {
          ...selectRows.value[0],
          timestamp: Date.now(), //允许同一个详情页同时打开多次，否则会触发路由被缓存下次无法刷新的bug
        },
      })
    else $baseMessage('请选择一行进行详情页跳转', 'warning', 'hey')
  }
}

onActivated(() => {
  tableRef.value.doLayout()
})

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.split-table-container {
  width: 100%;

  :deep() {
    .el-card {
      margin-bottom: 0;
    }

    .split {
      .resizer {
        height: var(--el-container-height) !important;
        margin-right: calc(var(--el-margin) / 2);
        margin-left: calc(var(--el-margin) / 2);
      }
    }
  }
}
</style>

<template>
  <div>
    <el-form label-width="80px" :model="formData" @submit.prevent>
      <el-form-item label="名称">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="活动区域">
        <el-input v-model="formData.region" />
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input v-model="formData.type" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default defineComponent({
  props: {
    nodeData: {
      type: Object,
      default: () => {},
    },
    lf: {
      type: Object || String,
      default: () => {},
    },
  },
  emits: ['onClose'],
  data() {
    return {
      formData: {
        name: '',
        region: '',
        type: '',
      },
    }
  },
  mounted() {
    const { properties } = this.$props.nodeData
    if (properties) {
      this.$data.formData = Object.assign({}, this.$data.formData, properties)
    }
  },
  methods: {
    onSubmit() {
      const { id } = this.$props.nodeData
      this.$props.lf.setProperties(id, this.$data.formData)
      this.$emit('onClose')
    },
  },
})
</script>

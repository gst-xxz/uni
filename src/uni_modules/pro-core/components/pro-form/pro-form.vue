<template>
  <pro-form ref="form" :model="innerFormData">
    <pro-cell-group border>
      <template v-for="field in fields" :key="field.prop">

        <wd-calendar :label="field.label" :label-width="field.labelWidth" :prop="field.prop"
          :placeholder="field.placeholder" v-model="innerFormData[field.prop]" v-if="field.component === 'calendar'" />

        <wd-cell v-else-if="field.component === 'checkbox'" :label="field.label">
          <pro-checkbox-group v-model="innerFormData[field.prop]" :min="field.min" :max="field.max"
            custom-class="flex gap-x-2 items-center justify-end">
            <wd-checkbox v-for="item in field.options" :key="item.value" :modelValue="item.value" customClass="!mb-0">
              {{ item.label }}
            </wd-checkbox>
          </pro-checkbox-group>

        </wd-cell>

        <wd-textarea :label="field.label" :label-width="field.labelWidth" :prop="field.prop"
          :clearable="field.clearable" :placeholder="field.placeholder" :rules="field.rules" :required="field.required"
          v-model="innerFormData[field.prop]" :customClass="fieldClass" v-else-if="field.component === 'textarea'" />

        <wd-cell v-else-if="field.component === 'inputNumber'" :label="field.label">
          <wd-input-number v-model="innerFormData[field.prop]" :min="field.min" :max="field.max" :step="field.step"
            :precision="field.precision" />
        </wd-cell>

        <wd-cell v-else-if="field.component === 'switch'" :label="field.label">
          <pro-switch v-model="innerFormData[field.prop]" />
        </wd-cell>

        <wd-picker :label="field.label" :label-width="field.labelWidth" :prop="field.prop"
          v-model="innerFormData[field.prop]" :columns="field.options" :placeholder="field.placeholder"
          v-else-if="field.component === 'picker'" />

        <wd-select-picker :label="field.label" :label-width="field.labelWidth" :prop="field.prop"
          v-model="innerFormData[field.prop]" :columns="field.options" :placeholder="field.placeholder"
          v-else-if="field.component === 'selectPicker'" />

        <wd-datetime-picker :label="field.label" :label-width="field.labelWidth" :prop="field.prop"
          :placeholder="field.placeholder" v-model="innerFormData[field.prop]"
          v-else-if="field.component === 'datetimePicker'" />


        <wd-col-picker :label="field.label" :label-width="field.labelWidth" :prop="field.prop"
          :placeholder="field.placeholder" v-model="innerFormData[field.prop]" :columns="field.options"
          v-else-if="field.component === 'colPicker'" />

        <wd-input :label="field.label" :label-width="field.labelWidth" :prop="field.prop" :clearable="field.clearable"
          :placeholder="field.placeholder" :rules="field.rules" :required="field.required"
          v-model="innerFormData[field.prop]" :customClass="fieldClass" v-else />
      </template>
    </pro-cell-group>
    <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
  </pro-form>
</template>

<script>
export default {
  name: 'pro-form',
  props: {
    layout: {
      type: String,
      default: 'vertical'
    },
    fields: {
      type: Array,
      default: () => [
        {
          label: 'Input',
          prop: 'value1',
          clearable: true,
          placeholder: 'Input',
          rules: [{ required: false, pattern: /\d{6}/, message: '请输入6位字符' }],
          required: true
        },
        {
          label: 'textarea',
          prop: 'value2',
          clearable: true,
          component: 'textarea',
          placeholder: 'textarea',
          rules: [{ required: false, pattern: /\d{6}/, message: '请输入6位字符' }]
        },
        {
          label: 'inputNumber',
          prop: 'value3',
          clearable: true,
          component: 'inputNumber',
          placeholder: 'inputNumber',
        },
        {
          label: 'switch',
          prop: 'value4',
          clearable: true,
          component: 'switch',
          placeholder: 'switch',
        },
        {
          label: 'datetimePicker',
          prop: 'value0',
          clearable: true,
          component: 'datetimePicker',
          placeholder: 'datetimePicker',
        },
        {
          label: 'picker',
          prop: 'value5',
          clearable: true,
          component: 'picker',
          placeholder: 'picker',
          options: [
            {
              value: '1',
              label: '满减'
            },
            {
              value: '2',
              label: '无门槛'
            }
          ]
        },
        {
          label: 'checkbox',
          prop: 'value51',
          clearable: true,
          component: 'checkbox',
          placeholder: 'checkbox',
          options: [
            {
              value: '1',
              label: '满减'
            },
            {
              value: '2',
              label: '无门槛'
            }
          ]
        },
        {
          label: 'selectPicker',
          prop: 'value6',
          clearable: true,
          component: 'selectPicker',
          placeholder: 'selectPicker',
          options: [
            {
              value: '1',
              label: '京东'
            },
            {
              value: '2',
              label: '开普勒'
            },
            {
              value: '3',
              label: '手Q'
            },
            {
              value: '4',
              label: '微信'
            },
            {
              value: '5',
              label: '1号店'
            },
            {
              value: '6',
              label: '十元街'
            },
            {
              value: '7',
              label: '京东极速版'
            }
          ]
        },
        {
          label: 'calendar',
          prop: 'value7',
          clearable: true,
          component: 'calendar',
          placeholder: 'calendar',
        },
      ]
    },
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      innerFormData: this.modelValue
    }
  },
  watch: {
    modelValue (newVal) {
      this.innerFormData = newVal
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.form.validate().then(res => {
        console.log('res', res)
      })
    },
    reset () {
      this.innerFormData = this.modelValue
    }
  },
  computed: {
    fieldClass () {
      return ''
      // return this.layout === 'vertical' ? 'flex flex-col' : ''
    }
  }
}
</script>
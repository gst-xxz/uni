<template>
  <uni-forms
    :modelValue="formData"
    :labelPosition="labelPosition"
    class="p-4"
    ref="form"
  >
    <template v-for="field in calcFields" :key="field.name">
      <uni-forms-item
        :name="field.name"
        :label="field.label"
        :required="field.required"
        v-if="field.visible"
      >
        <uni-easyinput
          v-if="field.component === 'input'"
          v-model="formData[field.name]"
          :placeholder="field.placeholder"
        />

        <uni-data-select
          v-if="field.component === 'select'"
          v-model="formData[field.name]"
          :localdata="field.options"
          :placeholder="field.placeholder"
        />

        <uni-data-picker
          v-if="field.component === 'cascader'"
          v-model="formData[field.name]"
          :localdata="field.options"
          :placeholder="field.placeholder"
        />

        <uni-data-checkbox
          v-model="formData[field.name]"
          v-if="field.component === 'checkbox'"
          :localdata="field.options"
        />
      </uni-forms-item>
    </template>

    <button type="primary" @click="submit">提交</button>
  </uni-forms>
</template>

<script>
const parseOptions = (options) => {
  return options.map((option) => {
    option.text = option.label;
    if (option.children) {
      option.children = parseOptions(option.children);
    }
    return option;
  });
};

export default {
  props: {
    // label 位置，默认 left 取值  top/left
    labelPosition: {
      type: String,
      default: "top",
    },
    rules: {
      type: Object,
      default: () => ({
        input: {
          rules: [{ required: true, errorMessage: "请输入名称" }],
        },
      }),
    },
  },
  mounted() {
    this.$refs.form.setRules(this.rules);
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  data() {
    return {
      fields: [
        {
          component: "input",
          label: "输入框",
          name: "input",
          required: true,
          placeholder: "请输入",
        },
        {
          component: "select",
          label: "下拉选择框",
          name: "select",
          options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
          ],
        },
        {
          component: "cascader",
          label: "级联选择框",
          name: "cascader",
          options: [
            {
              label: "一年级",
              value: "1-0",
              children: [
                {
                  label: "1.1班",
                  value: "1-1",
                },
                {
                  label: "1.2班",
                  value: "1-2",
                },
              ],
            },
            {
              label: "二年级",
              value: "2-0",
              children: [
                {
                  label: "2.1班",
                  value: "2-1",
                },
                {
                  label: "2.2班",
                  value: "2-2",
                },
              ],
            },
            {
              label: "三年级",
              value: "3-0",
              disable: true,
            },
          ],
          onVisible: (_, formData) => {
            if (formData.select === "B") {
              return true;
            }
            return false;
          },
        },
        {
          component: "checkbox",
          label: "复选框",
          name: "checkbox",
          options: [
            { value: 0, label: "篮球" },
            { value: 1, label: "足球" },
            { value: 2, label: "游泳" },
          ],
        },
      ],
      formData: {},
    };
  },
  computed: {
    calcFields() {
      return this.fields.map((field) => {
        let options = field.options;

        if (options) {
          options = parseOptions(options);
        }

        const visible =
          field.onVisible?.(this.formData[field.name], this.formData) ?? true;

        return {
          ...field,
          visible,
        };
      });
    },
  },
  methods: {
    submit() {
      this.$refs.form
        .validate()
        .then((res) => {
          console.log("表单数据信息：", res);
        })
        .catch((err) => {
          console.log("表单错误信息：", err);
        });
    },
  },
};
</script>

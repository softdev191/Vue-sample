import Button from "./Button";

export default {
  title: "Button",
  component: Button,
  parameters: {
    docs: {
      extractComponentDescription: (component, { notes }) => {
        return notes;
      },
    },
    notes: "aaa",
  },
};

export const ButtonStory = (args, { argTypes }) => ({
  components: Button,
  parameters: { notes: "Some Notes" },
  template: `<Button :theme="theme" :icon="icon">あいうえお</Button>`,
  props: Object.keys(argTypes),
});
ButtonStory.args = {
  theme: "",
  icon: false,
};

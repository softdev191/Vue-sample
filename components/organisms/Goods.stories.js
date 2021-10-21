import Goods from "./Goods";

export default {
  title: "Goods",
  component: Goods,
};

export const GoodsStory = (args, { argTypes }) => ({
  components: Goods,
  parameters: { notes: "Some Notes" },
  template: `<Goods :desktopSize="desktopSize">あいうえお</Goods>`,
  props: Object.keys(argTypes),
});
GoodsStory.args = {
  desktopSize: 4,
};

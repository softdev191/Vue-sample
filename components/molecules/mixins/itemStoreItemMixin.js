const mixins = {
  props: {
    item: {
      type: Object,
      required: true,
    },
    store: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isAccordionOpen: false,
    };
  },
  computed: {
    googleMapUrl() {
      const { longitude, latitude } = this.store.location;
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    },
    itemDetailStoreDict() {
      return this.store.item_detail_stores.reduce((dict, itemDetailStore) => {
        return Object.assign(dict, {
          [itemDetailStore.item_detail_id]: itemDetailStore,
        });
      }, {});
    },
  },
  methods: {
    handleClickAccordionButton() {
      this.isAccordionOpen = !this.isAccordionOpen;
    },
  },
};

export default mixins;

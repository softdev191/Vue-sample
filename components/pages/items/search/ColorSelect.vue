<template>
  <div>
    <div class="color-palet">
      <div
        v-for="(group, index1) in colorGroups"
        :key="index1"
        class="columns is-mobile is-gapless"
      >
        <label
          v-for="(color, index2) in group"
          :key="index2"
          class="column squre"
          :style="{ background: color.color_panel }"
          :class="lightOrDark(color.color_panel)"
        >
          <p class="has-text-centered">
            {{ color.display_name }}
          </p>
          <Checkbox
            :id="`color-${color.id}`"
            v-model="inputs[color.id]"
            :name="`color-${color.id}`"
            :is-color-select="isColorSelect"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from "@/components/atoms/Checkbox";

export default {
  name: "ColorSelect",
  components: {
    Checkbox,
  },
  props: {
    inputs: {
      type: Object,
      default: () => ({}),
    },
    columnLength: {
      type: Number,
      default: 4,
    },
    isColorSelect: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    colors() {
      return this.$store.getters["master/colors"];
    },
    colorGroups() {
      return this.colors.reduce((group, color) => {
        const length = group.length;
        let index = length - 1;

        if (length === 0 || group[length - 1].length === this.columnLength) {
          group[length] = [];
          index = length;
        }

        group[index].push(color);

        return group;
      }, []);
    },
  },
  methods: {
    lightOrDark(color) {
      // 赤、緑、青の値の変数
      let r, g, b;

      // 色の形式(16進法またはRGB法)を確認します。
      if (color.match(/^rgb/)) {
        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(
          /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        );

        r = color[1];
        g = color[2];
        b = color[3];
      } else {
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +(
          "0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
        );

        r = color >> 16;
        g = (color >> 8) & 255;
        b = color & 255;
      }

      // HSP（Highensitive Poo）方程式
      const hsp = Math.sqrt(
        0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
      );

      // HSP 値を使用して、色が薄いか暗いかを確認します。
      if (hsp > 127.5) {
        return "bg-light";
      } else {
        return "bg-dark";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.color-palet {
  padding: 30px 10px 69px 10px;

  .columns.is-gapless {
    margin-bottom: 3px;

    .column {
      margin: auto 2px;
      width: 20%;
      height: 85px;
      line-height: 85px;
      vertical-align: middle;
      position: relative;

      &::v-deep .checkbox {
        position: absolute;
        top: -4px;
        right: 26px;

        .label {
          padding: 0;
          margin: 0;
        }
      }
      &.bg-light {
        .has-text-centered {
          color: black;
        }
      }
      &.bg-dark {
        .has-text-centered {
          color: white;
        }
        &::v-deep .checkbox {
          .label::before {
            border: 1px solid #fff;
            background: transparent;
          }
        }
      }
    }
  }
  .letter-white {
    color: #fff;
  }
  .white {
    background: #fff;
    border: 1px solid #dbdbdb;
  }
}
</style>

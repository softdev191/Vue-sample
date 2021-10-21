<template>
  <ValidationObserver
    v-slot="observer"
    ref="obs"
    tag="div"
    class="form-wrapper"
  >
    <section v-if="member.cardId" class="form-section">
      <div class="form-section-title">会員カード情報</div>
      <div class="form-section-content">
        <div class="form-group">
          <label class="form-label">YMDY Co.LTD MEMBERSCARD ID</label>
          <label calss="form-label">{{ member.cardId }}</label>
        </div>
        <div class="form-group">
          <label class="form-label">PINコード</label>
          <label calss="form-label">{{ member.pin }}</label>
        </div>
      </div>
    </section>
    <section class="form-section">
      <div class="form-section-title">① アカウント情報</div>
      <div class="form-section-content">
        <div class="form-group">
          <label class="form-label">メールアドレス</label>
          <label calss="form-label">{{ member.email }}</label>
        </div>
        <div class="form-group">
          <label class="form-label">パスワード</label>
          <div class="form-confirm">
            <div class="form-value">
              {{ showPassword ? member.password : "●●●●●●●●" }}
              <span class="search" @click="togglePassword">
                {{ showPassword ? "非表示にする" : "見る" }}
              </span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">氏名</label>
          <div class="form-confirm">
            <span class="form-value">
              {{ `${member.lastName} ${member.firstName}` }}
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">氏名（カナ）</label>
          <div class="form-confirm">
            <span class="form-value">
              {{ `${member.lastNameKana} ${member.firstNameKana}` }}
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">⽣年⽉⽇</label>
          <div class="form-confirm">
            <span class="form-value">{{ member.birthday }}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">性別</label>
          <div class="form-confirm">
            <span class="form-value">{{ member.gender | enumGender }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="form-section">
      <div class="form-section-title">② 会員情報</div>
      <div class="form-section-content">
        <div class="form-group">
          <label class="form-label">電話番号</label>
          <div class="form-confirm">
            <span class="form-value">{{ member.phone }}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">郵便番号</label>
          <div class="form-confirm">
            <span class="form-value">{{ member.postal }}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">都道府県</label>
          <div class="form-confirm">
            <span class="form-value">{{ member.pref | pref }}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">住所</label>
          <div class="form-confirm">
            <span class="form-value">
              {{ `${member.city}${member.town}${member.address}` }}
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">マンション・ビル名等</label>
          <div class="form-confirm">
            <span class="form-value">{{ member.building }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="form-section">
      <div class="form-section-title">③ メールマガジン登録</div>
      <div class="form-section-content">
        <div class="form-group">
          <div class="form-confirm">
            <span class="form-value">{{
              member.mailMagazine | enumMailDm
            }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="form-section">
      <div class="form-section-title">④ 郵便DM登録</div>
      <div class="form-section-content">
        <div class="form-group">
          <div class="form-confirm">
            <span class="form-value">{{ member.postalDm | enumPostDm }}</span>
          </div>
        </div>
      </div>
    </section>
    <p class="form-text">
      利⽤規約とプライバシーポリシーに同意の上、登録するボタンを押してください。
    </p>
    <ValidationProvider
      v-slot="{ dirty, invalid }"
      vid="agree"
      name="同意"
      :rules="{ required: { allowFalse: false } }"
      tag="div"
      class="form-group mt30"
    >
      <input
        id="agree"
        v-model="agree"
        type="checkbox"
        name="remember"
        class="form-checkbox"
        :class="[dirty && invalid ? 'error' : '']"
      />
      <label for="agree">
        <NuxtLink to="/terms" class="link" target="_blank">利用規約 </NuxtLink
        >、
        <NuxtLink to="/privacy" class="link" target="_blank">
          プライバシーポリシー
        </NuxtLink>
        に同意する
      </label>
    </ValidationProvider>
    <div class="form-group">
      <ButtonWrapper theme="flex" class-name="mt30">
        <Button @click="edit" :disabled="pending">修正する</Button>
        <Button
          theme="dark"
          :disabled="observer.invalid"
          :pending="pending"
          @click="confirm"
        >
          登録する
        </Button>
      </ButtonWrapper>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapState } from "vuex";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    ButtonWrapper,
    Button,
  },
  props: {
    namespace: {
      type: String,
      default: "register/activate",
    },
  },
  data() {
    return {
      showPassword: false,
      agree: false,
    };
  },
  computed: {
    ...mapState({
      member(state, getters) {
        return getters[`${this.namespace}/member`];
      },
    }),
    faChevronRight() {
      return faChevronRight;
    },
    pending() {
      return this.$store.getters["common/pending"];
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    edit() {
      this.$emit("edit");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="scss" scoped>
.form-section {
  margin-bottom: 40px;
  .form-section-title {
    border-bottom: 1px solid $black;
    padding: 0 5px;
    margin: 0 -5px 20px;
  }
}
.form-confirm {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .edit {
    display: inline-block;
    font-size: 10px;
    border-bottom: 1px solid $black;
    cursor: pointer;
  }
}
.terms-privacy {
  display: inline-block;
  font-size: 12px;
  color: $black;
  border-bottom: 1px solid $black;
  cursor: pointer;
}
.search {
  font-size: 10px;
  border-bottom: 1px solid $black;
  margin-left: 10px;
  cursor: pointer;
}
.my-modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .btn + .btn {
    margin-left: 10px;
  }
}
.link {
  text-decoration: underline;
}
</style>

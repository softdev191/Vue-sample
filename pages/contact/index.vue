<template>
  <div class="fixed-container">
    <ErrorBox v-if="hasError">
      パスワードが間違っているようです。パスワード、パスワード(確認⽤)の⼊⼒を再度してください。
    </ErrorBox>
    <div class="page-title">お問い合わせフォーム</div>
    <div class="text mb30">
      <p>こちらはYAMADAYA online storeお問い合わせフォームです。</p>
      <p>※本社へのお問い合わせはこちら。</p>
      <p>
        →<a
          href="https://www.ymdy.co.jp/contact/"
          target="_blink"
          class="txt-link"
          >https://www.ymdy.co.jp/contact/</a
        >
      </p>
      <p>
        ※実店舗に関わるお問い合わせは、直接店舗にご質問いただくとスムーズです。
      </p>
      <p class="mb15">
        →<a
          href="https://www.ymdy.co.jp/search-store/"
          target="_blink"
          class="txt-link"
          >https://www.ymdy.co.jp/search-store/</a
        >
      </p>
      <p>■お問い合わせご対応日時■</p>
      <p class="mb15">
        新型コロナウイルスの感染拡大防止に伴い、スタッフの人数制限・時差出勤をしております為お問い合わせのご対応日時を下記に変更させていただきます。
      </p>
      <p>●ご対応日：毎日ご対応致します。</p>
      <p>●ご対応時間：正午12:00～16:00</p>
      <p>
        ※多くのお問い合わせをいただいた場合や、お問い合わせ内容に関する担当者が不在の場合は、ご返答までにお日にちを頂戴することがございます。
      </p>
    </div>
    <ValidationObserver ref="obs" v-slot="{ handleSubmit, invalid }">
      <form>
        <div class="form-wrapper">
          <div class="form-group">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
              name="お問い合わせ内容"
            >
              <label class="form-label required" for="type">
                お問い合わせ内容
              </label>
              <div class="select-wrapper">
                <select id="type" v-model="contact.type" class="form-control">
                  <option value>お問い合わせ内容をお選びください</option>
                  <option
                    v-for="contactType in contactTypes"
                    :key="contactType.key"
                    :value="contactType.value"
                  >
                    {{ contactType.label }}
                  </option>
                </select>
                <div class="error-msg">{{ errors[0] }}</div>
              </div>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|max:3000"
              name="お問い合わせ本⽂"
            >
              <label class="form-label required mb20" for="content">
                お問い合わせ本⽂（3,000⽂字以内）
              </label>
              <p class="text kome">
                商品名、カラー・サイズなど、お問い合わせ商品を特定できる内容を明記してください。
              </p>
              <p class="text kome mb10">
                お問い合わせ内容に、個⼈情報は記載しないようにお願い致します。
              </p>
              <textarea
                id="content"
                v-model="contact.content"
                class="form-control"
                maxlength="3000"
                rows="10"
              ></textarea>
              <div class="error-msg">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <section class="form-section">
            <div class="form-section-title">ご連絡先</div>
            <div class="form-section-content">
              <div class="form-group-wrapper col-2">
                <div class="form-group">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="氏"
                  >
                    <label for="last_name" class="form-label required">
                      氏
                    </label>
                    <input
                      id="last_name"
                      v-model="contact.lastName"
                      class="form-control"
                      type="text"
                      name="last_name"
                    />
                    <div class="error-msg">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>
                <div class="form-group">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="名"
                  >
                    <label for="first_name" class="form-label required">
                      名
                    </label>
                    <input
                      id="first_name"
                      v-model="contact.firstName"
                      class="form-control"
                      type="text"
                      name="first_name"
                    />
                    <div class="error-msg">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-group-wrapper col-2">
                <div class="form-group">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required|kana"
                    name="氏（カナ）"
                  >
                    <label for="last_name_kana" class="form-label required">
                      氏（カナ）
                    </label>
                    <input
                      id="last_name_kana"
                      v-model="contact.lastNameKana"
                      class="form-control"
                      type="text"
                      name="last_name_kana"
                    />
                    <div class="error-msg">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>
                <div class="form-group">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required|kana"
                    name="名（カナ）"
                  >
                    <label class="form-label required" for="first_name_kana">
                      名（カナ）
                    </label>
                    <input
                      id="first_name_kana"
                      v-model="contact.firstNameKana"
                      class="form-control"
                      type="text"
                      name="first_name_kana"
                    />
                    <div class="error-msg">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-group">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required|email"
                  name="メールアドレス"
                  vid="email_confirmation"
                >
                  <label class="form-label required" for="email">
                    メールアドレス
                  </label>
                  <input
                    id="email"
                    v-model="contact.email"
                    class="form-control"
                    type="email"
                    name="email"
                    placeholder="メールアドレスを入力してください"
                  />
                  <div class="error-msg">{{ errors[0] }}</div>
                </ValidationProvider>
              </div>
              <div class="form-group">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required|confirmed:email_confirmation"
                  name="メールアドレス（確認用）"
                >
                  <label class="form-label required" for="email_confirmation">
                    メールアドレス（確認用）
                  </label>
                  <input
                    id="email_confirmation"
                    v-model="contact.email_confirmation"
                    class="form-control"
                    type="email"
                    name="email_confirmation"
                    placeholder="メールアドレスを入力してください"
                  />
                  <div class="error-msg">{{ errors[0] }}</div>
                </ValidationProvider>
              </div>
              <div class="form-group">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required|numeric|min:10|max:11"
                  name="電話番号"
                >
                  <label class="form-label required" for="phone">
                    電話番号
                  </label>
                  <input
                    id="phone"
                    v-model="contact.phone"
                    class="form-control"
                    type="text"
                    name="phone"
                    placeholder="電話番号を⼊⼒してください"
                  />
                  <div class="error-msg">{{ errors[0] }}</div>
                </ValidationProvider>
              </div>
            </div>
          </section>
          <p class="error mb25">は必須項目です。</p>
          <div class="form-group">
            <ValidationProvider
              v-slot="{ errors }"
              :rules="{ required: { allowFalse: false } }"
              name="個⼈情報の取り扱い"
            >
              <input
                id="agree"
                v-model="contact.agree"
                type="checkbox"
                name="agree"
                class="form-checkbox"
              />
              <label for="agree">
                <nuxt-link to="/privacy" class="security">
                  個⼈情報の取り扱い
                  <fa :icon="faChevronRight" />
                </nuxt-link>
                に同意する
              </label>
              <div class="error-msg">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <ButtonWrapper theme="normal" class-name="mt30">
              <Button
                theme="dark"
                :disabled="invalid || isSubmiting"
                @click="handleSubmit(handleContact)"
              >
                お問い合わせする
              </Button>
            </ButtonWrapper>
          </div>
        </div>
      </form>
    </ValidationObserver>
    <BaseDialog
      ref="completeDialog"
      title="送信完了しました"
      ok-text="閉じる"
      :has-cancel="false"
      @ok="handleDialogClose"
    >
    </BaseDialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import BaseDialog from "@/components/atoms/BaseDialog";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import Button from "@/components/atoms/Button";

export default {
  components: {
    BaseDialog,
    ButtonWrapper,
    Button,
  },
  data() {
    return {
      isSubmiting: false,
      contact: {
        type: "",
        content: "",
        email: "",
        email_confirmation: "",
        lastName: "",
        firstName: "",
        lastNameKana: "",
        firstNameKana: "",
        phone: "",
        agree: "",
      },
    };
  },
  computed: {
    ...mapState({
      currentUser(state, getters) {
        return state.auth.user;
      },
    }),
    ...mapGetters({
      contactTypes: "master/contactTypes",
    }),
    faChevronRight() {
      return faChevronRight;
    },
    hasError() {
      return false;
    },
  },
  mounted() {
    this.contact = {
      ...this.contact,
      lastName: this.currentUser?.lname,
      firstName: this.currentUser?.fname,
      lastNameKana: this.currentUser?.lkana,
      firstNameKana: this.currentUser?.fkana,
      phone: this.currentUser?.tel,
      email: this.currentUser?.email,
    };

    if (this.$route.query.product_number) {
      this.contact = {
        ...this.contact,
        type: 2,
        content: `お問い合わせ商品番号 : ${this.$route.query.product_number}`,
      };
    }
  },
  methods: {
    async handleContact() {
      try {
        this.isSubmiting = true;
        await this.$api.store("contact", this.contact);
        this.$store.dispatch("contact/set", this.contact);
        this.$router.push({ name: "contact-complete" });
      } catch (error) {
        const errorMessages = extractFlatValidationError(error);

        // FIXME: どこからも参照されていない？
        this.$store.dispatch("error/setError", {
          title: "もう一度お試しください",
          detail: errorMessages[0],
        });
      } finally {
        this.isSubmiting = false;
      }
    },
    handleDialogClose() {
      this.$refs.completeDialog.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
  &.kome {
    position: relative;
    padding-left: 1rem;
    &::before {
      content: "※";
      position: absolute;
      left: 0;
    }
  }
}
.error {
  position: relative;
  color: $error;
  font-size: 10px;
  padding-left: 1rem;
  &::before {
    content: "*";
    position: absolute;
    top: -3px;
    left: 0;
    font-size: 30px;
    line-height: 1;
  }
}
.error-msg {
  font-size: 10px;
  color: $error;
  margin-top: 4px;
}
.security {
  border-bottom: 1px solid $black;
}
.mt25 {
  margin-top: 25px;
}
.mb10 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 20px;
}
.mb25 {
  margin-bottom: 25px;
}
.mb30 {
  margin-bottom: 30px;
}
</style>

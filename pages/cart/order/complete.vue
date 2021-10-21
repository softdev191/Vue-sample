<template>
  <div class="fixed-container">
    <div class="page-title has-text-centered">
      ご注文いただき誠にありがとうございます。<br />
      商品の準備を進めて参りますので、しばらくおまちくださいませ。
    </div>
    <p class="text">
      ご注文いただき、誠にありがとうございます。<br />
      <br />
      頂いた内容にてご注文を受付致しましたので、<br />
      {{ userName }}様にお送りするために商品の準備を進めて参ります。<br />
      <br />
      <!-- eslint-disable-next-line prettier/prettier -->
      また、ご登録メールアドレス宛に、「件名：【YAMADAYA online store】ご購入手続きが完了いたしました。」のメールを送信致しました。<br />
      ご確認のほどよろしくお願い致します。<br />
      引き続きヤマダヤでのお買い物をお楽しみください。<br />
    </p>
    <div class="order-section">
      <div class="order-section-title">お客さまのご注文コード</div>
      <div class="order-section-content">
        <div class="form-group">
          <label class="form-label">{{ order.code }}</label>
        </div>
        <div v-if="isGuestOrder" class="form-group">
          お買い上げから1週間以内に下記URLから会員登録をしていただくと、今回のお買い上げ分のポイントを取得することが可能です。ぜひご登録ください。
        </div>
        <ButtonWrapper theme="flex" class-name="mt24">
          <ButtonLink v-if="isGuestOrder" :to="memberActivateLink" theme="light"
            >本登録する</ButtonLink
          >
          <ButtonLink v-else to="/mypage/purchase-history" theme="light"
            >注文履歴を確認する</ButtonLink
          >
          <ButtonLink to="/" theme="dark">トップに戻る</ButtonLink>
        </ButtonWrapper>
      </div>
    </div>
    <div class="info-section">
      <div class="info-section-header">発送状況の確認方法</div>
      <div v-if="isGuestOrder" class="info-section-content">
        <!-- eslint-disable-next-line prettier/prettier -->
        ゲスト購入のお客さまのご注文の発送状況は、オンラインストアの画面で確認することはできません。お問い合わせより、メールに記載のお客さまの注文コードをお伝えいただければ発送状況の確認を致します。YAMADAYA online store全体の発送状況は、スタッフがTwitterで発信している事がございます。(不定期更新です)<br />
        少しでもご参考になりましたら幸いです。
        <a href="https://twitter.com/ymdy_web_katou"
          >https://twitter.com/ymdy_web_katou</a
        >
      </div>
      <div v-else class="info-section-content">
        お客様のご注文の発送状況は、<br />
        [会員メニュー]の[購入履歴・発送状況・キャンセルページ]からご確認いただけます。<br />
        YAMADAYA online store全体の発送状況は、<br />
        スタッフがTwitterで発信している事がございます。(不定期更新です)<br />
        少しでもご参考になりましたら幸いです。<br />
        <a href="https://twitter.com/ymdy_web_katou"
          >https://twitter.com/ymdy_web_katou</a
        >
      </div>
    </div>
    <div class="info-section">
      <div class="info-section-header">「ご注文完了メール」が届かない場合</div>
      <div class="info-section-content">
        (１)【メール受信ボックス内】と【迷惑メールフォルダ内】で、下記を確認してください。<br />
        ・最新の受信状態に更新する<br />
        ・「〇〇@ymdy.co.jp」のメールアドレスを検索<br />
        ・「〇〇」の件名を検索<br />
        ↓<br />
        (２)それでも見つからない場合は、<br />
        メールを受信出来るように「@ymdy.co.jp」のドメイン指定をお願いします。<br /><br />
        尚、ご注文コード（ご購入日時の文字列から始まります
        例:2021年12月10日に購入された場合、20211210〜と始まります。）が発行されている場合はご注文が完了してます。ご安心ください。
      </div>
    </div>
    <div class="info-section">
      <div class="info-section-header">商品のお届けまでの期日</div>
      <div class="info-section-content">
        通常は在庫があれば翌日～7日以内となります。（都道府県により配達日時は前後する場合がございます。）<br />
        予約商品や、取り寄せ商品など一部の商品は、商品詳細ページに記載されたお届け予定日となります。
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import ButtonLink from "@/components/atoms/ButtonLink";

export default {
  components: {
    ButtonWrapper,
    ButtonLink,
  },
  beforeRouteEnter(to, from, next) {
    if (
      !["cart-order-confirm", "cart-guest-order-confirm"].includes(from.name)
    ) {
      return next(false);
    }

    next();
  },
  computed: {
    ...mapGetters({
      order: "order/order",
      guestSihippingAddress: "order/guestSihippingAddress",
      isGuestOrder: "order/isGuestOrder",
      fullMemberActivateLink: "order/memberActivateLink",
    }),
    userInfo() {
      return this.$auth.user || this.guestSihippingAddress;
    },
    userName() {
      const { lname, fname } = this.userInfo || {};

      return `${lname} ${fname}`;
    },
    memberActivateLink() {
      return "/" + this.fullMemberActivateLink.split("/").slice(3).join("/");
    },
  },
  beforeMount() {
    this.$store.commit("cart/setProducts", []);
  },
  beforeDestroy() {
    this.$store.commit("cart/resetAll");
    this.$store.commit("order/resetAll");
    this.$store.commit("setSessionData", {
      memberToken: null,
      memberId: null,
    });
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
  line-height: 22px;
}
.order-section {
  margin-top: 40px;
  .order-section-title {
    border-bottom: 1px solid $black;
    margin: 0 -5px 20px;
    padding: 0 5px;
  }
  .order-section-content {
    margin-bottom: 50px;
  }
}
.info-section {
  .info-section-header {
    font-size: 10px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  .info-section-content {
    font-size: 10px;
    margin-bottom: 16px;
  }
}
</style>

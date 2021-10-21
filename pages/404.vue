<template>
  <div class="container">
    <div class="title mb20">404</div>
    <div class="sub-title mb40">Page Not Found</div>
    <div class="explanation mb40">
      申し訳ございません。<br />指定されたページ（URL）が<br />見つかりませんでした。
    </div>
    <div class="detail-section mb10">
      <ul>
        <li class="index">以下の状況が考えられます</li>
        <li>・ページがこのサーバー上に存在しない</li>
        <li>・ページの名前が変更されている</li>
        <li>・ページが現在利用できない</li>
      </ul>
    </div>
    <div class="detail-section mb40">
      <ul>
        <li class="index">次のことをお試しください</li>
        <li>
          ・ページアドレス（URL）を正しく入力したか、確認してみてください。
        </li>
        <li>
          ・ブラウザの更新ボタンをクリックして、再度読み込みを行ってみてください。
        </li>
      </ul>
    </div>
    <div class="form-group mb100">
      <ButtonWrapper theme="normal">
        <ButtonLink to="/" theme="light">トップに戻る</ButtonLink>
      </ButtonWrapper>
    </div>
    <div class="column has-text-centered">
      <nuxt-link to="/">
        <LogoSvg />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
// NOTE: ステータスコードが適切に返せなくなるので、
// サーバーサイドでエラーページにリダイレクトするときは、
// この画面に$router.pushで飛ばさずにerror関数を利用する。
import ButtonWrapper from "@/components/molecules/ButtonWrapper";
import ButtonLink from "@/components/atoms/ButtonLink";
import LogoSvg from "@/assets/images/logos/logo-black.svg";

export default {
  layout: "top",
  components: {
    ButtonWrapper,
    ButtonLink,
    LogoSvg,
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $desktop;
  text-align: center;
  background-image: url("~assets/images/not-found-background.png");
  background-size: auto 900px;
  background-repeat: no-repeat;
  height: 100vh;
  @include touch {
    background-position: 100px -41px;
  }
  @include desktop {
    background-position: 100% -20%;
  }
}
.title {
  font-size: 80px;
  padding-top: 70px;
}
.sub-title {
  font-size: 28px;
}
.explanation {
  font-size: 14px;
}
.detail-section {
  background-color: rgba(219, 219, 219, 0.7);
  padding: 15px 10px;
  margin: 0 10px 0;
  text-align: left;
  font-size: 12px;
  li:not(:last-child) {
    padding-bottom: 10px;
  }
  .index {
    font-weight: bold;
  }
  @include desktop {
    width: 50%;
    margin: auto;
  }
}
.form-group {
  @include desktop {
    width: 30%;
    margin: auto;
  }
}
.has-text-centered {
  svg {
    height: 30px;
  }
}
</style>

<template>
  <div class="fixed-container">
    <SuccessBox v-if="success">{{ success }}</SuccessBox>
    <Breadcrumb text="HOME > マイページ" />
    <div class="mypage-layout">
      <SideMenu />
      <div v-if="user" class="mypage-main">
        <section class="top-section">
          <div class="point-wrapper">
            所持ポイント数
            <span class="point">{{ pointAmount | numberFormat }}pt</span>
          </div>
          <div class="expire-date">
            <div class="date-text">有効期限 : {{ pointLimitDate | date }}</div>
            <InformationMessage
              class="mb20"
              :align-right="true"
              :show-text="false"
              dialog-title="有効期限"
            >
              <template v-slot:message>
                YAMADAYA会員のポイントは、最終ポイント付与日から1年間ポイントが有効です。<br />
                1年の間に1回でもポイントを獲得すると、保有しているポイントの有効期間が切れることはございません。<br /><br />
                ポイント付与は、主に以下のタイミングにて行われます。<br />
                ・新規会員登録時<br />
                ・購買完了時<br />
                ・誕生日ポイント獲得時<br /><br />
                1年間未更新のままにしてしまうと、所持しているポイントはすべて失効してしまうので、お気をつけてください。
              </template>
            </InformationMessage>
          </div>
          <div class="bar-code-wrapper">
            <barcode
              :value="user.id"
              :options="{ format: 'CODE39', width: 1, height: 80 }"
            ></barcode>
          </div>
          <p class="text mb30">
            会員IDバーコードは、実店舗でお買い物いただく際にレジでご提示ください。
          </p>
        </section>
        <section class="info-section">
          <Accordion>
            <template v-slot:head>
              <div class="section-title">会員情報詳細</div>
            </template>
            <template v-slot:body>
              <div class="section-content">
                <div class="email-table-wrapper">
                  <table class="email-table">
                    <tbody>
                      <tr>
                        <th class="align-left">会員ID</th>
                        <td>{{ user.id }}</td>
                      </tr>
                      <tr>
                        <th class="align-left">メールアドレス</th>
                        <td>{{ user.email }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p class="edit-wrapper">
                    <NuxtLink to="/mypage/change/email" class="edit">
                      編集する
                      <fa :icon="faChevronRight" />
                    </NuxtLink>
                  </p>
                </div>
                <div class="account-table-wrapper">
                  <table class="account-table">
                    <tbody>
                      <tr>
                        <th>氏名</th>
                        <td>{{ user.lname }} {{ user.fname }} 様</td>
                      </tr>
                      <tr>
                        <th>氏名（カナ）</th>
                        <td>{{ user.lkana }} {{ user.fkana }} 様</td>
                      </tr>
                      <tr>
                        <th>生年月日</th>
                        <td>{{ user.birthday | date }}</td>
                      </tr>
                      <tr>
                        <th>性別</th>
                        <td>{{ user.gender | enumGender }}</td>
                      </tr>
                      <tr>
                        <th>電話番号</th>
                        <td>{{ user.tel }}</td>
                      </tr>
                      <tr>
                        <th>郵便番号</th>
                        <td>{{ user.zip }}</td>
                      </tr>
                      <tr>
                        <th>住所</th>
                        <td>
                          {{ user.pref.id | pref
                          }}{{ `${user.city}${user.town}${user.address}`
                          }}<br />
                          {{ user.building }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p class="edit-wrapper">
                    <NuxtLink to="/mypage/change/member" class="edit">
                      編集する
                      <fa :icon="faChevronRight" />
                    </NuxtLink>
                  </p>
                </div>
              </div>
            </template>
          </Accordion>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import SuccessBox from "@/components/atoms/SuccessBox";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import Accordion from "@/components/atoms/Accordion";
import InformationMessage from "@/components/molecules/InformationMessage";
import { faChevronRight, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    SuccessBox,
    Breadcrumb,
    SideMenu,
    Accordion,
    InformationMessage,
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch("point/fetch", this.$auth.user.id),
      this.$store.dispatch("coupon/fetch"),
    ]);
  },
  data() {
    return {
      success: null,
    };
  },
  computed: {
    ...mapState({
      user(state, getters) {
        return state.auth.user;
      },
    }),
    ...mapGetters({
      pointAmount: "point/amount",
      pointLimitDate: "point/limitDate",
    }),
    faChevronUp() {
      return faChevronUp;
    },
    faChevronRight() {
      return faChevronRight;
    },
  },
  mounted() {
    switch (this.$route.query.result) {
      case "LoginSuccess":
        this.success = "ログインしました！";
        break;
      case "ProfileUpdated":
        this.success = "会員情報を更新しました。";
        break;
      case "PasswordUpdated":
        this.success = "パスワードを変更しました。";
        break;
      case "MailMagazineUpdated":
        this.success = "メルマガ配信設定を更新されました。";
        break;
    }
  },
  head() {
    return {
      title: "マイページ",
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 5px;
}
.section-title {
  font-size: 14px;
}
.section-content {
  margin-top: 30px;
  .section-block-title {
    font-size: 14px;
    border-bottom: 1px solid $black;
    padding: 0 5px;
    margin-bottom: 20px;
  }
}
.top-section {
  text-align: center;
  .point-wrapper {
    font-size: 10px;
    margin: 25px 0 10px;
    .point {
      font-size: 16px;
      font-weight: 600;
      margin-left: 26px;
    }
  }
  .expire-date {
    font-size: 10px;
    position: relative;
    text-align: left;
    > .date-text {
      text-align: center;
    }
  }
  .bar-code-wrapper {
    margin-bottom: 10px;
  }
  .text {
    font-size: 10px;
  }
}
.info-section {
  border-top: 1px solid $middle-gray;
  padding: 15px 0;
  @include touch {
    border-bottom: 1px solid $middle-gray;
  }
  .email-table-wrapper {
    margin-bottom: 30px;
    .email-table {
      width: 100%;
      font-size: 10px;
      padding: 0 5px;
      th {
        width: 92px;
      }
      th,
      td {
        padding: 5px 6px;
      }
    }
  }
  .account-table-wrapper {
    .account-table {
      width: 100%;
      font-size: 10px;
      border-collapse: collapse;
      th {
        width: 92px;
        text-align: center;
        vertical-align: middle;
        border-right: 1px solid $middle-gray;
      }
      th,
      td {
        padding: 10px 12px;
        border-top: 1px solid $middle-gray;
        border-bottom: 1px solid $middle-gray;
      }
    }
  }
}
.edit-wrapper {
  text-align: right;
  padding: 0 5px;
  .edit {
    font-size: 10px;
    border-bottom: 1px solid $black;
  }
}
.mb30 {
  margin-bottom: 30px;
}
</style>

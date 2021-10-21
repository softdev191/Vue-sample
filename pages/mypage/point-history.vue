<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > ポイント履歴" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>ポイント履歴</PageTitle>
        <section class="point-history-section">
          <div class="point-status-table-wrapper">
            <table class="point-status-table">
              <tbody>
                <tr>
                  <th>所持ポイント数</th>
                  <td>{{ pointAmount | numberFormat }}ポイント</td>
                </tr>
                <tr>
                  <th>有効期限</th>
                  <td>{{ pointLimitDate | date }}</td>
                </tr>
              </tbody>
            </table>
            <InformationMessage
              class="mb20"
              dialog-title="ポイントの有効期限について"
            >
              <template v-slot:message>
                ・YAMADAYA会員のポイントは、最終ポイント付与日から1年間ポイントが有効です。<br />
                ・1年の間に1回でもポイントを獲得すると、所持しているポイントの有効期間が切れることはございません。<br />
                ・1年間未更新のままにしてしまうと、所持しているポイントはすべて失効します。<br /><br />

                【(例)所持ポイントが500ptの会員の場合】<br />
                2030年12月10日に1000pt獲得 <br />
                [所持ポイント]1500pt(1500ptの有効期限:2031年12月9日23:59) <br />
                ↓ <br />
                「1年間ポイント未更新の場合」<br />
                2031年12月9日23:59に所持ポイント1500ptが失効 <br />
                [所持ポイント]0pt <br /><br />

                「2031年9月8日に300pt獲得した場合」<br />
                [所持ポイント]1800pt(1800ptの有効期限:2032年9月7日23:59に更新)
              </template>
            </InformationMessage>
          </div>
        </section>
        <section class="point-history-section">
          <div class="point-history-section-title">
            履歴
            <InformationMessage
              class="mb20"
              dialog-title="ポイントの反映タイミング"
            >
              <template v-slot:message>
                ・ポイントの反映タイミングは、実店舗でのご購入と、オンラインストアでのご購入で異なります。<br /><br />
                「実店舗でのご購入 の場合」<br />
                →決済完了時に反映されます。<br /><br />
                「オンラインストアでのご購入の場合」<br />
                →ご注文商品の発送完了時に反映されます。<br /><br />
                ・ポイントは、反映されたタイミングからご利用可能です。
              </template>
            </InformationMessage>
          </div>
          <div class="point-history-section-content">
            <div class="point-history-list-wrapper">
              <ul class="point-history-list">
                <li
                  v-for="(pointHistory, index) in pointHistories"
                  :key="index"
                  class="point-history-list-item"
                >
                  <div class="point-history-item">
                    <div class="point-history-info">
                      <div class="point-history-date">
                        {{ pointHistory.issued_date | date }}
                      </div>
                      <div class="point-history-desc">
                        {{ pointHistory.point_adjustment_reason_description }}
                      </div>
                      <div v-if="pointHistory.shop" class="point-history-store">
                        店舗 : {{ pointHistory.shop.name }}
                      </div>
                    </div>
                    <div v-if="pointHistory.amount" class="point-history-point">
                      {{ pointHistory.amount > 0 ? "+" : "-" }}
                      {{ pointHistory.amount | numberFormat }}pt
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import InformationMessage from "@/components/molecules/InformationMessage";

export default {
  components: {
    PageTitle,
    Breadcrumb,
    SideMenu,
    InformationMessage,
  },
  async fetch({ store }) {
    await store.dispatch("point/fetch");
  },
  computed: {
    ...mapGetters({
      pointAmount: "point/amount",
      pointLimitDate: "point/limitDate",
      pointHistories: "point/histories",
    }),
  },
  head() {
    return {
      title: "ポイント履歴",
    };
  },
};
</script>

<style lang="scss" scoped>
.point-status-table-wrapper {
  margin-bottom: 30px;
  .point-status-table {
    margin-bottom: 20px;
    th {
      font-size: 10px;
      vertical-align: middle;
      font-weight: normal;
    }
    td {
      font-size: 16px;
      font-weight: 600;
      vertical-align: middle;
      padding: 0 12px;
    }
  }
}
.point-history-section {
  .point-history-section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 -5px 5px;
    padding: 0 5px;
    border-bottom: 1px solid $black;
  }
  .point-history-section-content {
    > .point-history-list-wrapper {
      .point-history-list {
        > .point-history-list-item {
          .point-history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 -5px;
            padding: 16px 5px;
            border-bottom: 1px solid $middle-gray;
            > .point-history-info {
              > .point-history-date {
                font-size: 10px;
                margin-bottom: 5px;
              }
              > .point-history-desc {
                font-size: 12px;
              }
              > .point-history-store {
                font-size: 12px;
              }
            }
            > .point-history-point {
              font-size: 14px;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
.mb30 {
  margin-bottom: 30px;
}
</style>

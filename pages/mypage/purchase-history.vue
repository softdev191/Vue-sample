<template>
  <div class="fixed-container">
    <Breadcrumb text="HOME > マイページ > 購入履歴・発送状況・キャンセル" />
    <div class="mypage-layout">
      <SideMenu />
      <div class="mypage-main">
        <PageTitle>購入履歴・発送状況・キャンセル</PageTitle>
        <InformationMessage
          dialog-title="お客さま都合の注文キャンセルについて"
          class="point-message"
        >
          <template v-slot:message>
            ・ご注文完了後１時間以内は、ご注文のキャンセルが可能です。<br />
            ・ご希望の場合は購入履歴・発送状況・キャンセルページの「注文をキャンセルする」からお手続きください。<br />
            ※キャンセルは注文単位です。<br />
            ※複数点ご注文の場合の一部商品キャンセルは出来ません。ご注文をキャンセル後、再度ご注文をし直してください。（キャンセルした商品分の在庫はショップに戻りますが、人気商品は直ぐに売り切れてしまう場合がございます。予めご了承ください。）<br /><br />
            ・１時間経過したご注文のキャンセルはお受けしておりません。
          </template>
        </InformationMessage>
        <section class="purchase-history-section">
          <div class="purchase-history-section-content">
            <div class="purchase-history-list-wrapper">
              <ul class="purchase-history-list">
                <li
                  v-for="(order, index) in orders"
                  :key="index"
                  class="purchase-history-list-item"
                >
                  <div class="purchase-history-item">
                    <div class="fixed-container">
                      <div class="purchase-history-header">
                        <div class="purchase-history-date">
                          購入日：{{ order.order_date }}
                        </div>
                        <div class="purchase-history-uuid">
                          伝票番号：{{ order.code }}
                        </div>
                        <div class="purchase-history-status">
                          {{ order.order_type | enumOrderType }}
                        </div>
                        <div class="purchase-history-store">
                          ヤマダヤオンラインストア
                        </div>
                      </div>
                      <div class="purchase-history-content">
                        <div class="purchase-history-product-list-wrapper">
                          <ul class="purchase-history-product-list">
                            <li
                              v-for="(orderDetail, key) in order.order_details"
                              :key="key"
                              class="purchase-history-product-list-item"
                            >
                              <div class="purchase-history-product-item">
                                <div
                                  class="purchase-history-product-image-wrapper"
                                >
                                  <img
                                    :src="orderDetail.item.image_url"
                                    alt=""
                                  />
                                  <div
                                    class="purchase-history-product-transport-status"
                                  >
                                    {{ order.status.label }}
                                  </div>
                                </div>
                                <div
                                  class="purchase-history-product-info-wrapper"
                                >
                                  <p class="purchase-history-product-title">
                                    {{ orderDetail.item.name }}
                                  </p>
                                  <p class="purchase-history-product-cost">
                                    {{ yen(orderDetail.item.price) }}
                                    <span class="unit">(税込)</span>
                                  </p>
                                  <p class="purchase-history-product-color">
                                    色：{{
                                      `${orderDetail.item.color.code} ${orderDetail.item.color.display_name}`
                                    }}
                                  </p>
                                  <p class="purchase-history-product-size">
                                    サイズ：{{ orderDetail.item.size.name }}
                                  </p>
                                  <p
                                    v-if="order.invoice_number"
                                    class="purchase-history-product-invoice-number"
                                  >
                                    <span class="invoice-number">
                                      送り状番号：{{ order.delivery_number }}
                                    </span>
                                    <span class="copy">タップしてコピー</span>
                                  </p>
                                  <p
                                    v-if="order.transport_company"
                                    class="purchase-history-product-transport-company"
                                  >
                                    運送会社：{{ order.delivery_company.label }}
                                    <NuxtLink
                                      :to="order.delivery_company.link"
                                      class="contact"
                                    >
                                      お問い合わせ
                                      <fa :icon="faChevronRight" />
                                    </NuxtLink>
                                  </p>
                                </div>
                              </div>
                              <div class="order-detail-table">
                                <table class="order-detail-table__inner">
                                  <tbody class="order-detail-table__body">
                                    <tr
                                      v-if="order.coupon_discount > 0"
                                      class="tr"
                                    >
                                      <th class="th">クーポン利用</th>
                                      <td class="td">
                                        -{{
                                          order.coupon_discount | numberFormat
                                        }}円
                                      </td>
                                    </tr>
                                    <tr v-if="order.use_point > 0" class="tr">
                                      <th class="th">ポイント利用</th>
                                      <td class="td">
                                        -{{ order.use_point | numberFormat }}円
                                      </td>
                                    </tr>
                                  </tbody>
                                  <tfoot class="order-detail-table__foot">
                                    <tr class="tr">
                                      <td colspan="2" class="td">
                                        <table
                                          class="order-detail-table__total"
                                        >
                                          <tr>
                                            <th class="th fs14 fwn">合計</th>
                                            <td class="td fs14">
                                              {{ order.price | numberFormat }}円
                                              <span class="fs10">(税込)</span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <th class="th fs10 fwn">
                                              付与ポイント
                                            </th>
                                            <td class="td fs14">
                                              {{
                                                (order.price * 0.1)
                                                  | numberFormat
                                              }}pt
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                              <div class="order-delivery-info">
                                <p class="order-delivery-info__header">
                                  発送情報
                                </p>
                                <p class="order-delivery-info__normal">
                                  送り状番号：{{ order.delivery_number }}
                                </p>
                                <p
                                  v-if="order.delivery_company"
                                  class="order-delivery-info__normal"
                                >
                                  運送会社：{{ order.delivery_company.label }}
                                </p>
                                <p class="order-delivery-info__ex">
                                  ※送り状Noをタップすると、各運送会社のお問い合わせサイトに遷移します
                                </p>
                                <p class="order-delivery-info__normal">
                                  お届け予定：{{ order.expected_arrival_date }}
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div
                          v-if="order.order"
                          class="purchase-history-order-info"
                        >
                          <div
                            class="purchase-history-order-detail-table-wrapper"
                          >
                            <div
                              class="purchase-history-order-detail-table-title"
                            >
                              注文内容
                            </div>
                            <table class="purchase-history-order-detail-table">
                              <tbody>
                                <tr v-if="order.items_total">
                                  <th>商品合計</th>
                                  <td>{{ yen(order.items_total) }}</td>
                                </tr>
                                <tr v-if="order.coupon_discount">
                                  <th>クーポン利用</th>
                                  <td>-{{ yen(order.coupon_discount) }}</td>
                                </tr>
                                <tr v-if="order.use_point">
                                  <th>ポイント利用</th>
                                  <td>-{{ yen(order.use_point) }}</td>
                                </tr>
                                <tr v-if="order.employee_discount">
                                  <th>社割</th>
                                  <td>-{{ yen(order.employee_discount) }}</td>
                                </tr>
                                <tr v-if="order.campaign_discount">
                                  <th>キャンペーン割引</th>
                                  <td>-{{ yen(order.campaign_discount) }}</td>
                                </tr>
                                <tr v-if="order.postage">
                                  <th>手数料</th>
                                  <td>{{ yen(order.postage) }}</td>
                                </tr>
                                <tr v-if="order.delivery_fee">
                                  <th>送料</th>
                                  <td>{{ yen(order.delivery_fee) }}</td>
                                </tr>
                              </tbody>
                              <tfoot>
                                <th>
                                  合計<span class="unit02">（税込）</span>
                                </th>
                                <td class="sum">{{ yen(order.price) }}</td>
                              </tfoot>
                            </table>
                          </div>
                          <div class="purchase-history-order-return">
                            <span class="return">還元</span>
                            <span class="points">
                              {{ order.add_point }}ポイント
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button v-if="order.can_cancel" @click="cancel(order)">
                        キャンセル
                      </Button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
    <BaseDialog
      ref="orderCancelDialog"
      title="キャンセルする商品にお間違えはありませんか？"
      title-class="normal"
      :has-ok="false"
      cancel-text="キャンセル"
      @cancel="onCancel"
    >
      <div v-if="cancelOrder" class="dialog-section">
        <ErrorBox v-if="error" :title="error.title">
          {{ error.message }}
        </ErrorBox>
        <div class="dialog-section-title">キャンセルする商品</div>
        <div class="dialog-section-content">
          <div
            v-for="(cancelOrderDetail, key) in cancelOrder.order_details"
            :key="key"
            class="dialog-product-item"
          >
            <div class="dialog-product-image-wrapper">
              <img :src="cancelOrderDetail.item.image_url" alt="" />
            </div>
            <div class="dialog-product-info-wrapper">
              <p class="dialog-product-brand">
                {{ cancelOrderDetail.item.brand.name }}
              </p>
              <p class="dialog-product-title">
                {{ cancelOrderDetail.item.name }}
              </p>
              <p class="dialog-product-title">
                {{ cancelOrderDetail.item.product_number }}
              </p>
              <p class="dialog-product-color">
                カラー：{{
                  `${cancelOrderDetail.item.color.code} ${cancelOrderDetail.item.color.display_name}`
                }}
              </p>
              <p class="dialog-product-size">
                サイズ：{{ cancelOrderDetail.item.size.name }}
              </p>
              <p class="dialog-product-purchase-date">
                購入日：{{ cancelOrder.order_date }}
              </p>
              <p class="dialog-product-purchase-date">
                購入場所：オンラインストア
              </p>
            </div>
          </div>
          <div class="dialog-product-cost">
            <span class="label">返金額</span>
            <span class="cost">{{ yen(cancelOrder.price) }}</span>
          </div>
          <div class="dialog-attention">
            <p class="dialog-attention-title">キャンセルに関する注意</p>
            <p class="dialog-attention-detail">
              ・キャンセルが確定した後に、キャンセルを取消すことは出来ません。<br />
              ・キャンセルは注文単位です。<br />
              ・ご注文内容の変更や、複数点ご注文の場合の一部商品キャンセルは出来ません。ご注文をキャンセル後、再度ご注文をし直してください。（キャンセルした商品分の在庫はショップに戻りますが、人気商品は直ぐに売り切れてしまう場合がございます。予めご了承ください。）<br />
              ・注文日時から１時間経過したご注文のキャンセルはお受けしておりません。<br />
            </p>
          </div>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      ref="completeDialog"
      title=""
      :has-ok="false"
      cancel-text="閉じる"
      @cancel="onCloseComplete"
    >
      <p class="complete">キャンセルが完了しました。</p>
    </BaseDialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PageTitle from "@/components/atoms/PageTitle";
import BaseDialog from "@/components/atoms/BaseDialog";
import Breadcrumb from "@/components/partials/Breadcrumb";
import SideMenu from "@/components/pages/mypage/SideMenu";
import ErrorBox from "@/components/atoms/ErrorBox";
import Button from "@/components/atoms/Button";
import InformationMessage from "@/components/molecules/InformationMessage";
import { extractFlatValidationError } from "@/plugins/vee-validate";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { yen } from "@/utils/format";

export default {
  components: {
    PageTitle,
    ErrorBox,
    BaseDialog,
    Breadcrumb,
    SideMenu,
    Button,
    InformationMessage,
  },
  async fetch({ store }) {
    await store.dispatch("purchase/fetch");
  },
  data() {
    return {
      error: null,
      cancelOrder: undefined,
    };
  },
  computed: {
    ...mapState({
      orders(state, getters) {
        return getters["purchase/orders"];
      },
    }),
    faChevronRight() {
      return faChevronRight;
    },
  },
  methods: {
    yen(...args) {
      return yen(...args);
    },
    cancel(order) {
      this.cancelOrder = order;
      this.$refs.orderCancelDialog.show();
    },
    async onCancel() {
      try {
        this.$store.commit("common/pending", true);
        await this.$store.dispatch("purchase/cancel", this.cancelOrder.code);
        this.error = null;
        this.$refs.orderCancelDialog.hide();
        this.$router.push("/mypage/canceled");
      } catch (error) {
        const messages = extractFlatValidationError(error);

        this.error = {
          title: "キャンセルに失敗しました。",
          message: messages[0],
        };
      } finally {
        this.$store.commit("common/pending", false);
      }
    },
    onCloseComplete() {
      this.$refs.completeDialog.hide();
    },
  },
  head() {
    return {
      title: "購入履歴・発送状況・キャンセル",
    };
  },
};
</script>

<style lang="scss" scoped>
.page-title {
  margin-bottom: 15px;
}
.help-component {
  margin-bottom: 30px;
}
.dialog-section {
  .dialog-section-title {
    font-size: 14px;
    border-bottom: 1px solid $black;
    margin-bottom: 15px;
  }
  .dialog-section-content {
    .dialog-product-item {
      display: flex;
      margin-bottom: 15px;
      .dialog-product-image-wrapper {
        display: flex;
        flex-direction: column;
        width: 120px;
        margin-right: 10px;
        .dialog-product-transport-status {
          color: $white;
          font-size: 10px;
          line-height: 14px;
          text-align: center;
          background-color: #6c6c6c;
          padding: 3px 10px;
          &.prepare {
            color: #6c6c6c;
            background-color: #f6f6f6;
          }
          &.backlog {
            color: #6c6c6c;
            background-color: $white;
            border-color: 1px solid #6c6c6c;
          }
        }
      }
      .dialog-product-info-wrapper {
        flex: 1;
        line-height: 1.4;
        .dialog-product-brand {
          font-size: 10px;
          margin-bottom: 5px;
        }
        .dialog-product-title {
          font-size: 12px;
          margin-bottom: 10px;
        }
        .dialog-product-uuid {
          font-size: 10px;
          margin-bottom: 5px;
        }
        .dialog-product-color {
          font-size: 10px;
        }
        .dialog-product-size {
          font-size: 10px;
        }
        .dialog-product-purchase-date {
          font-size: 10px;
        }
        .dialog-product-purchase-store {
          font-size: 10px;
          margin-bottom: 6px;
        }
      }
    }
    .dialog-product-cost {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      .label {
        font-size: 14px;
      }
      .cost {
        font-size: 14px;
        font-weight: 600;
      }
    }
    .dialog-attention {
      .dialog-attention-title {
        font-size: 10px;
        font-weight: 600;
      }
      .dialog-attention-detail {
        font-size: 10px;
        line-height: 1.4;
      }
    }
  }
}
.purchase-history-section {
  @include touch {
    margin: 0 -10px;
  }
  .purchase-history-section-content {
    .purchase-history-list-wrapper {
      .purchase-history-list {
        .purchase-history-list-item {
          .purchase-history-item {
            .purchase-history-header {
              position: relative;
              background-color: #f6f6f6;
              padding: 13px 15px 11px;
              .purchase-history-date {
                font-size: 10px;
              }
              .purchase-history-uuid {
                font-size: 10px;
                margin-top: 1px;
              }
              .purchase-history-status {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 9px;
                background-color: #fff;
                padding: 1px 10px;
              }
              .purchase-history-store {
                position: absolute;
                top: 31px;
                right: 15px;
                font-size: 9px;
              }
            }
            .purchase-history-content {
              padding-top: 10px;
              .purchase-history-product-list-wrapper {
                .purchase-history-product-list {
                  .purchase-history-product-list-item {
                    margin-bottom: 28px;
                    .purchase-history-product-item {
                      display: flex;
                      .purchase-history-product-image-wrapper {
                        display: flex;
                        flex-direction: column;
                        width: 120px;
                        margin-right: 10px;
                        .purchase-history-product-transport-status {
                          color: $white;
                          font-size: 10px;
                          line-height: 14px;
                          text-align: center;
                          background-color: #6c6c6c;
                          padding: 3px 10px;
                        }
                      }
                      .purchase-history-product-info-wrapper {
                        flex: 1;
                        line-height: 1.4;
                        .purchase-history-product-brand {
                          font-size: 10px;
                          margin-bottom: 5px;
                        }
                        .purchase-history-product-title {
                          font-size: 12px;
                          margin-bottom: 10px;
                        }
                        .purchase-history-product-uuid {
                          font-size: 10px;
                          margin-bottom: 5px;
                        }
                        .purchase-history-product-color {
                          font-size: 10px;
                        }
                        .purchase-history-product-size {
                          font-size: 10px;
                        }
                        .purchase-history-product-purchase-date {
                          font-size: 10px;
                        }
                        .purchase-history-product-purchase-store {
                          font-size: 10px;
                          margin-bottom: 6px;
                        }
                        .purchase-history-product-invoice-number {
                          font-size: 10px;
                          margin-bottom: 6px;
                          .invoice-number {
                            border-bottom: 1px solid $black;
                          }
                          .copy {
                            color: #6c6c6c;
                            margin-left: 8px;
                          }
                        }
                        .purchase-history-product-transport-company {
                          font-size: 10px;
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          .contact {
                            color: $black;
                            border-bottom: 1px solid $black;
                          }
                        }
                        .purchase-history-product-cost {
                          font-size: 12px;
                          margin: 10px 0 20px;
                          .unit {
                            font-size: 10px;
                          }
                        }
                      }
                    }
                    .order-detail-table {
                      margin: 11.5px -5px 7.5px;
                      .order-detail-table__inner {
                        width: 100%;
                        .tr {
                          border-top: 1px solid #dbdbdb;
                          &:last-child {
                            border-bottom: 1px solid #dbdbdb;
                          }
                        }
                        .th,
                        .td {
                          font-size: 10px;
                          font-weight: normal;
                          padding: 8.5px 5px;
                          vertical-align: middle;
                        }
                        .th {
                          text-align: left;
                        }
                        .td {
                          text-align: right;
                        }
                      }
                      .order-detail-table__total {
                        width: 45%;
                        margin-left: auto;
                        vertical-align: middle;
                        .th,
                        .td {
                          padding: 0;
                        }
                      }
                    }
                    .order-delivery-info {
                      .order-delivery-info__header {
                        font-size: 14px;
                        margin-bottom: 8px;
                      }
                      .order-delivery-info__normal {
                        font-size: 12px;
                        margin-bottom: 4px;
                      }
                      .order-delivery-info__ex {
                        font-size: 10px;
                        margin-bottom: 4px;
                      }
                    }
                  }
                }
              }
              .purchase-history-order-info {
                .purchase-history-order-detail-table-wrapper {
                  border-top: 1px solid #dbdbdb;
                  border-bottom: 1px solid #dbdbdb;
                  padding-top: 10px;
                  .purchase-history-order-detail-table-title {
                    font-size: 14px;
                    padding: 0 5px;
                  }
                  .purchase-history-order-detail-table {
                    width: 100%;
                    font-size: 12px;
                    th {
                      color: $black;
                      font-weight: normal;
                      padding-left: 5px;
                    }
                    td {
                      text-align: right;
                      padding-right: 5px;
                    }
                    tfoot {
                      border-top: 1px solid #dbdbdb;
                      th {
                        padding: 10px 5px;
                        font-size: 14px;
                        .unit02 {
                          font-size: 10px;
                        }
                      }
                      td {
                        color: $error;
                        font-size: 14px;
                        font-weight: 600;
                        padding: 10px 5px;
                      }
                    }
                  }
                }
                .purchase-history-order-return {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 10px 5px;
                  .return {
                    font-size: 10px;
                  }
                  .points {
                    font-size: 14px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.complete {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
.mb30 {
  margin-bottom: 30px;
}
</style>

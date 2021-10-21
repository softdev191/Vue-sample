export const createFormParams = (
  state,
  user,
  cart,
  paymentTypeKv,
  usePointTypeKv,
  usablePoints
) => {
  const params = {};

  params.member = {
    lname: user.lname,
    fname: user.fname,
    lkana: user.lkana,
    fkana: user.fkana,
    tel: user.tel,
    zip: user.zip,
    pref_id: user.pref_id,
    city: user.city,
    town: user.town,
    address: user.address,
    building: user.building,
  };

  params.cart_id = cart.id;

  if (
    ![paymentTypeKv.AmazonPay, paymentTypeKv.Cod, paymentTypeKv.NP].includes(
      state.paymentType
    )
  ) {
    params.destination_id = state.destinationId;
  }

  params.use_point_type =
    state.pointUsage.use_point_type || usePointTypeKv.None;

  if (state.pointUsage.use_point_type === usePointTypeKv.Part) {
    params.use_point = state.pointUsage.use_point;
  } else if (state.pointUsage.use_point_type === usePointTypeKv.All) {
    params.use_point = usablePoints;
  } else {
    params.use_point = 0;
  }

  params.delivery_type = state.transport.delivery_type;
  params.delivery_has_time = Number(state.transport.delivery_has_time);

  if (state.transport.delivery_has_time) {
    params.delivery_hope_date = state.transport.delivery_hope_date;
    params.delivery_hope_time = state.transport.delivery_hope_time;
  }

  params.has_message = state.message.hasMessage;

  if (state.message.hasMessage) {
    params.message = {
      type: state.message.type,
      content: state.message.content,
    };
  }

  params.payment_type = state.paymentType;

  if (state.paymentType === paymentTypeKv.CreditCard) {
    if (!state.cardInfo.useSavedCardInfo) {
      params.card = {
        masked_pan: state.cardInfo.cardMaskedPan,
        token: state.cardInfo.cardToken,
        validity: state.cardInfo.cardValidity,
        payment_method: state.cardInfo.method,
        is_save_card_info: state.cardInfo.isSaveCardInfo,
        masked_security_code: state.cardInfo.maskedSecurityCode,
        use_saved_card_info: Number(state.cardInfo.useSavedCardInfo),
      };
    } else {
      params.card = {
        use_saved_card_info: Number(state.cardInfo.useSavedCardInfo),
        member_credit_card_id: state.cardInfo.memberCreditCardId,
        payment_method: state.cardInfo.method,
      };
    }

    params.billing_address = {
      lname: state.billingAddress.lname,
      fname: state.billingAddress.fname,
      lkana: state.billingAddress.lkana,
      fkana: state.billingAddress.fkana,
      tel: state.billingAddress.tel,
      zip: state.billingAddress.zip,
      pref_id: state.billingAddress.pref_id,
      city: state.billingAddress.city,
      town: state.billingAddress.town,
      address: state.billingAddress.address,
      building: state.billingAddress.building,
    };
  } else if (state.paymentType === paymentTypeKv.AmazonPay) {
    params.amazon_order_reference_id =
      state.amazonPayInfo.amazonOrderReferenceId;
    params.amazon_access_token = state.amazonPayInfo.amazonAccessToken;
  }

  return params;
};

export const createGuestPurchaseFormParams = (state, getters) => {
  const cart = getters["cart/cart"];
  const memberToken = getters.sessionData.memberToken;
  const params = {};

  params.member_token = memberToken;

  params.shipping_address = {
    lname: state.shippingAddress.lname,
    fname: state.shippingAddress.fname,
    lkana: state.shippingAddress.lkana,
    fkana: state.shippingAddress.fkana,
    tel: state.shippingAddress.tel,
    zip: state.shippingAddress.zip,
    pref_id: state.shippingAddress.pref_id,
    city: state.shippingAddress.city,
    town: state.shippingAddress.town,
    address: state.shippingAddress.address,
    building: state.shippingAddress.building,
  };

  params.cart_id = cart.id;
  params.cart_token = cart.token;
  params.delivery_type = state.transport.delivery_type;
  params.delivery_has_time = Number(state.transport.delivery_has_time);

  if (state.transport.delivery_has_time) {
    params.delivery_hope_date = state.transport.delivery_hope_date;
    params.delivery_hope_time = state.transport.delivery_hope_time;
  }

  params.has_message = state.message.hasMessage;

  if (state.message.hasMessage) {
    params.message = {
      type: state.message.type,
      content: state.message.content,
    };
  }

  params.payment_type = state.paymentType;

  params.card = {
    masked_pan: state.cardInfo.cardMaskedPan,
    token: state.cardInfo.cardToken,
    validity: state.cardInfo.cardValidity,
    payment_method: state.cardInfo.method,
    is_save_card_info: state.cardInfo.isSaveCardInfo,
    masked_security_code: state.cardInfo.maskedSecurityCode,
  };

  return params;
};

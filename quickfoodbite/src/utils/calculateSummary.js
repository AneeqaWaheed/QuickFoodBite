const round = (num) => Math.round(num);

const calculateSummary = (cart, charges, settings) => {
  let subtotal = 0;
  let itemDiscount = 0;
  let liquid = 0;
  let solid = 0;

  cart.forEach((item) => {
    const total = item.price * item.quantity;

    subtotal += total;

    if (item.discount) {
      itemDiscount += (total * item.discount) / 100;
    }

    if (item.type === "Liquid") {
      liquid += item.quantity;
    } else {
      solid += item.quantity;
    }
  });

  const deliveryLiquid =
    charges.find(
      (c) =>
        c.type === "delivery" &&
        c.category === "Liquid"
    )?.amount || 0;

  const deliverySolid =
    charges.find(
      (c) =>
        c.type === "delivery" &&
        c.category === "Solid"
    )?.amount || 0;

  const packagingLiquid =
    charges.find(
      (c) =>
        c.type === "packaging" &&
        c.category === "Liquid"
    )?.amount || 0;

  const packagingSolid =
    charges.find(
      (c) =>
        c.type === "packaging" &&
        c.category === "Solid"
    )?.amount || 0;

  const packagingCharge = packagingSolid;

  const liquidDeliveryTotal =
    liquid > 0 ? liquid * deliveryLiquid : 0;

  const solidDeliveryTotal =
    solid > 0 ? deliverySolid : 0;

  const calculatedDelivery = settings?.minOrderPrice
    ? liquid > solid
      ? liquidDeliveryTotal + solidDeliveryTotal * 0.5
      : liquidDeliveryTotal + solidDeliveryTotal
    : liquidDeliveryTotal + solidDeliveryTotal;

  const minDelivery = subtotal * 0.17;

  const isMinApplied =
    calculatedDelivery < minDelivery;

  const deliveryCharge = round(
    isMinApplied
      ? minDelivery
      : calculatedDelivery
  );

  const globalDiscount =
    settings.globalDiscount || 0;

  const globalDiscountAmount =
    (subtotal * globalDiscount) / 100;

  const beforeTotal =
    subtotal -
    itemDiscount -
    globalDiscountAmount;

  const grandTotal = round(
    beforeTotal +
      deliveryCharge +
      packagingCharge
  );

  return {
    subtotal: round(subtotal),
    itemDiscount: round(itemDiscount),
    globalDiscountAmount: round(
      globalDiscountAmount
    ),
    deliveryCharge,
    packagingCharge: round(packagingCharge),
    grandTotal,
    liquid,
    solid,
    finalTotal: round(subtotal),
    itemsCount: cart.length,
    isMinDeliveryApplied: isMinApplied,
    deliveryLiquid,
  };
};

export default calculateSummary;
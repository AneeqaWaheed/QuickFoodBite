import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

const requestPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BKQwpiRumTxDEg0Sdsjw_RTT_KI7y76DW5lupgextS8rkmrKb5Ze2zOaIVNqyxO4Xd3K4e0dADN5lpgKGtW2Grc",
    });

    console.log(token);

    // Save token in DB
  }
};
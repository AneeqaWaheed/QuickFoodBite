import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../firebase";
import axios from "axios";
import { useAuth } from "../../context/auth";
import pickUp from "../../assets/pickUp.png";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import ModeratorMenu from "../../Components/Layout/ModeratorMenu";
import SimpleLayout from "../../Components/Layout/SimpleLayout";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ModeratorNavbar from "../../Components/Layout/ModeratorNavbar";

const ModeratorDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // LOGOUT
  const handleLogout = () => {
    toast.success("Logout Successfully");

    setAuth({
      ...auth,
      user: null,
      token: "",
    });

    localStorage.removeItem("auth");

    navigate("/login");

    console.log("LOCATION STATE:", location.state);
  };


  // =========================
  // GET SAVED ONLINE STATUS
  // =========================
  useEffect(() => {
    const getModeratorStatus = async () => {
    
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/moderator/status/${auth?.user?._id}`
        );

        if (data.success) {
          setIsOnline(data.isOnline);
        }
      } catch (error) {
        console.log("Error getting moderator status:", error);
      }
    };

    if (auth?.user?._id) {
      getModeratorStatus();
    }
  }, [auth?.user?._id]);

// =========================
// FCM SETUP
// =========================
useEffect(() => {
  if (!auth?.user?._id) return;

  let interval;

  const initFCM = async () => {
    try {
      console.log("=================================");
      console.log("Starting FCM setup...");
      console.log("=================================");

      if (!("Notification" in window)) {
        console.log("Browser does not support notifications.");
        return;
      }

      if (!("serviceWorker" in navigator)) {
        console.log("Browser does not support service workers.");
        return;
      }

      let permission = Notification.permission;

      if (permission !== "granted") {
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        console.log("Notification permission not granted.");
        return;
      }

      const registration =
        await navigator.serviceWorker.ready;

      console.log("Using service worker:", registration);
      console.log("SW scope:", registration.scope);

      const fcmToken = await getToken(messaging, {
        vapidKey:
          "BKQwpiRumTxDEg0Sdsjw_RTT_KI7y76DW5lupgextS8rkmrKb5Ze2zOaIVNqyxO4Xd3K4e0dADN5lpgKGtW2Grc",

        serviceWorkerRegistration: registration,
      });

      console.log("CURRENT FCM TOKEN:", fcmToken);

      if (!fcmToken) {
        console.log("Firebase did not return an FCM token.");
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/save-fcm-token`,
        {
          userId: auth?.user?._id,
          fcmToken,
        }
      );

      console.log("✅ FCM token saved successfully");
    } catch (error) {
      console.error("❌ FCM SETUP ERROR:", error);
    }
  };

  // Initial setup
  initFCM();

  // Check token periodically
  interval = setInterval(() => {
    console.log("🔄 Checking FCM token...");
    initFCM();
  }, 2 * 60 * 1000); // every 2 minutes

  return () => {
    clearInterval(interval);
  };
}, [auth?.user?._id]);
  // =========================
  // GO ONLINE / OFFLINE
  // =========================
  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/moderator/status`,
        {
          userId: auth?.user?._id,
          isOnline: newStatus,
        }
      );

      if (data.success) {
        setIsOnline(data.isOnline);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to update status");
    }
  };


  // =========================
  // GO OFFLINE WHEN WEBSITE CLOSES
  // =========================
  // useEffect(() => {
  //   const handleClose = () => {
  //     if (!auth?.user?._id || !isOnline) return;

  //     const data = JSON.stringify({
  //       userId: auth.user._id,
  //       isOnline: false,
  //     });

  //     navigator.sendBeacon(
  //       `${process.env.REACT_APP_API}/api/v1/moderator/status`,
  //       new Blob([data], {
  //         type: "application/json",
  //       })
  //     );
  //   };

  //   window.addEventListener("beforeunload", handleClose);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleClose);
  //   };
  // }, [auth?.user?._id, isOnline]);


  // =========================
  // FOREGROUND NOTIFICATIONS
  // =========================
useEffect(() => {
  const unsubscribe = onMessage(messaging, async (payload) => {
    console.log("Foreground notification:", payload);

    const title =
      payload.notification?.title ||
      payload.data?.title ||
      "QuickFoodBite";

    const body =
      payload.notification?.body ||
      payload.data?.body ||
      "You have a new order.";

    const orderId = payload.data?.orderId;

    const url =
      payload.data?.url ||
      `/dashboard/moderator/claim/${orderId}`;

    try {
      if (Notification.permission !== "granted") {
        console.log("Notification permission is not granted.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      console.log("Showing foreground notification...");

      await registration.showNotification(title, {
        body,
        icon: "/FleentLogo.png",
        badge: "/FleentLogo.png",
        requireInteraction: true,

        data: {
          url,
          orderId,
        },

        tag: orderId
          ? `quickfoodbite-order-${orderId}`
          : "quickfoodbite-notification",

        renotify: true,
      });

      console.log("Foreground notification shown.");
    } catch (error) {
      console.error(
        "Failed to show foreground notification:",
        error
      );
    }
  });

  return unsubscribe;
}, []);

  return (
    <SimpleLayout title="Moderator - Profile">

      <ModeratorNavbar handleLogout={handleLogout} />

      {/* MAIN SECTION */}
      <div
        className="container-fluid"
        style={{
          backgroundImage: `url(${pickUp})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          height: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            height: "100vh",
            width: "100%",
            margin: "0px",
            padding: "20px",
            overflowY: "auto",
          }}
        >

          {/* SIDEBAR */}
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="bg-black p-3 rounded shadow">
              <ModeratorMenu />
            </div>
          </div>


          {/* MAIN CONTENT */}
          <div className="col-lg-9 col-md-8 rounded">

            <h3 className="text-white m-3 mt-5">
              WELCOME "
              {auth?.user?.firstName} {auth?.user?.lastName}
              " TO MODERATOR DASHBOARD
            </h3>

            <p className="text-white mx-4">
              We really appreciate your contribution to the Application
            </p>

            <p className="mx-4">
              <Button
                variant={isOnline ? "danger" : "success"}
                onClick={toggleOnlineStatus}
              >
                {isOnline ? "Go Offline" : "Go Online"}
              </Button>
            </p>

          </div>

        </div>
      </div>

    </SimpleLayout>
  );
};

export default ModeratorDashboard;
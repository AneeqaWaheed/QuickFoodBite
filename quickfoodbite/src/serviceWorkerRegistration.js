const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const publicUrl = new URL(
    process.env.PUBLIC_URL,
    window.location.href
  );

  if (publicUrl.origin !== window.location.origin) {
    return;
  }

  window.addEventListener("load", () => {

    const swUrl =
      `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {

      checkValidServiceWorker(swUrl, config);

      navigator.serviceWorker.ready.then(() => {
        console.log("[SW] Ready");
      });

    } else {

      registerValidSW(swUrl, config);

    }
  });
}


function registerValidSW(swUrl, config) {

  return navigator.serviceWorker
    .register(swUrl)

    .then((registration) => {

      console.log(
        "[SW] Registered:",
        registration
      );

      registration.onupdatefound = () => {

        const installingWorker =
          registration.installing;

        if (!installingWorker) {
          return;
        }

        installingWorker.onstatechange = () => {

          if (
            installingWorker.state === "installed"
          ) {

            if (navigator.serviceWorker.controller) {

              console.log(
                "[SW] New content available."
              );

            } else {

              console.log(
                "[SW] Content cached for offline use."
              );

            }
          }
        };
      };

      return registration;
    })

    .catch((error) => {

      console.error(
        "[SW] Registration error:",
        error
      );

      throw error;
    });
}


function checkValidServiceWorker(swUrl, config) {

  fetch(swUrl)

    .then((response) => {

      const contentType =
        response.headers.get("content-type");

      if (
        response.status === 404 ||
        (
          contentType != null &&
          contentType.indexOf("javascript") === -1
        )
      ) {

        navigator.serviceWorker.ready
          .then((registration) => {

            registration.unregister()
              .then(() => {

                window.location.reload();

              });

          });

      } else {

        registerValidSW(swUrl, config);

      }
    })

    .catch(() => {

      console.log(
        "[SW] No internet connection."
      );

    });
}


export function unregister() {

  if ("serviceWorker" in navigator) {

    navigator.serviceWorker.ready

      .then((registration) => {

        registration.unregister();

      })

      .catch((error) => {

        console.error(
          "[SW] Unregister error:",
          error.message
        );

      });
  }
}
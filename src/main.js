/**
 * Author: Lasitha Weligampola Gedara
 * Date: 2023/11/10
 */

window.onload = () => {
  handlePermission();
};

function handlePermission() {
  if (Notification.permission === "granted") {
    document.getElementById("btnRequest").style.display = "none";
    document.getElementById("newNotificationsForm").style.display = "block";
  } else {
    document.getElementById("btnRequest").style.display = "block";
    document.getElementById("newNotificationsForm").style.display = "none";
  }
}

document.getElementById("btnRequest").addEventListener("click", () => {
  Notification.requestPermission((result) => {
    handlePermission(result);
    if (result === "denied") {
      alert("Notifications blocked. Please enable them in your browser.");
    }
  });
});

document.getElementById("newNotificationsForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const { target } = event;

  const title = target.title.value;
  const body = target.body.value;
  if (title === "") {
    document.querySelector(".noti-title small").className = "active";
    return;
  } else {
    document.querySelector(".noti-title small").className = "";
  }

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      body,
      icon: "/images/icons/app-icon.png",
      badge: "/images/icons/apple-touch-icon.png",
      actions: [
        {
          action: "agree",
          type: "button",
          title: "Agree",
        },
        {
          action: "disagree",
          type: "button",
          title: "Disagree",
        },
      ],
    });
  });
});

navigator.serviceWorker.addEventListener('message', function (event) {
  document.querySelector('.message').innerText = event.data 
  document.querySelector('.message').style.display = "block" 
});
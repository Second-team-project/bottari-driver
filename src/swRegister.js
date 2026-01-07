const swRegister = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", { scope: '/' })
      .then((registration) => {
        console.log("서비스워커 등록 성공", registration);
      })
      .catch((error) => {
        console.error("서비스워커 등록 실패: ", error);
      });
  }
}

export default swRegister;
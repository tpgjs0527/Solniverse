export function checkMobile() {
  let UA = navigator.userAgent.toLowerCase();
  // console.log(UA);
  if (UA.indexOf("android") > -1) {
    //안드로이드
    return "android";
  } else if (
    UA.indexOf("iphone") > -1 ||
    UA.indexOf("ipad") > -1 ||
    UA.indexOf("ipod") > -1
  ) {
    //IOS
    return "ios";
  } else {
    //아이폰, 안드로이드 외
    return "other";
  }
}

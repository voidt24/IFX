export const getRunTime = (runtimeParam) => {
  let time;

  if (runtimeParam < 60) {
    time = runtimeParam + "m";
  } else {
    const hrs = Math.floor(runtimeParam / 60);
    let remainingMins = runtimeParam % 60;
    let strHrs = "h";
    let strMin = "m";

    if (remainingMins == 0) {
      strMin = "";
      remainingMins = "";
    }

    time = hrs + strHrs + " " + remainingMins + strMin;
  }

  return time;
};
export default function getCookie(cookieName: string) {
  const allCookies = document.cookie; // Obtiene todas las cookies como una string
  const myCookie = allCookies
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];

  return myCookie;
}

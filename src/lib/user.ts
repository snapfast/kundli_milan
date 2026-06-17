import { v4 as uuidv4 } from 'uuid';

export function getOrSetUserId() {
  if (typeof window === 'undefined') return null;

  let userId = getCookie('user_id');
  if (!userId) {
    userId = uuidv4();
    setCookie('user_id', userId, 365);
  }
  return userId;
}

export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
}

export function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
}

export function clearUserData() {
  deleteCookie('user_id');
  deleteCookie('user_details');
  localStorage.removeItem('user_details');
}

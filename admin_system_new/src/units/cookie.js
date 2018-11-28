import Cookies from 'js-cookie'

const Tokenkey = 'Admin-Token';

export function setToken(token) {
  return Cookies.set(Tokenkey,token);
}

export function getToken() {
  return Cookies.get(Tokenkey);
}

export function removeRoken() {
  return Cookies.remove(Tokenkey);
}

export default class Sha1 {
  static hexcase = 0;
  static b64pad = '';
  static chrsz = 8;

  hexSha1 (s) {
    return Sha1.binb2hex(Sha1.coreSha1(Sha1.str2binb(s), s.length * Sha1.chrsz));
  }

  static b64Sha1 (s) {
    return Sha1.binb2b64(Sha1.coreSha1(Sha1.str2binb(s), s.length * Sha1.chrsz));
  }

  static strSha1 (s) {
    return Sha1.binb2str(Sha1.coreSha1(Sha1.str2binb(s), s.length * Sha1.chrsz));
  }

  static hexHmacSha1 (key, data) {
    return Sha1.binb2hex(Sha1.coreHmacSha1(key, data));
  }

  static b64HmacSha1 (key, data) {
    return Sha1.binb2b64(Sha1.coreHmacSha1(key, data));
  }

  static strHmacSha1 (key, data) {
    return Sha1.binb2str(Sha1.coreHmacSha1(key, data));
  }

  static sha1VmTest () {
    return Sha1.hexSha1('abc') === 'a9993e364706816aba3e25717850c26c9cd0d89d';
  }

  static coreSha1 (x, len) {
     /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;
    let w = Array(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;
    for (let i = 0; i < x.length; i += 16) {
      let olda = a;
      let oldb = b;
      let oldc = c;
      let oldd = d;
      let olde = e;
      for (let j = 0; j < 80; j++) {
        if (j < 16) w[j] = x[i + j];
        else w[j] = Sha1.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        let t = Sha1.safeAdd(
          Sha1.safeAdd(Sha1.rol(a, 5), Sha1.sha1Ft(j, b, c, d)),
          Sha1.safeAdd(Sha1.safeAdd(e, w[j]), Sha1.sha1Kt(j)),
        );
        e = d;
        d = c;
        c = Sha1.rol(b, 30);
        b = a;
        a = t;
      }
      a = Sha1.safeAdd(a, olda);
      b = Sha1.safeAdd(b, oldb);
      c = Sha1.safeAdd(c, oldc);
      d = Sha1.safeAdd(d, oldd);
      e = Sha1.safeAdd(e, olde);
    }
    return [a, b, c, d, e];
  }

  static sha1Ft (t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }

  static sha1Kt (t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
  }

  static coreHmacSha1 (key, data) {
    let bkey = Sha1.str2binb(key);
    if (bkey.length > 16) bkey = Sha1.coreSha1(bkey, key.length * Sha1.chrsz);
    let ipad = Array(16);
    let opad = Array(16);
    for (let i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    let hash = Sha1.coreSha1(ipad.concat(Sha1.str2binb(data)), 512 + data.length * Sha1.chrsz);
    return Sha1.coreSha1(opad.concat(hash), 512 + 160);
  }

  static safeAdd (x, y) {
    let lsw = (x & 0xFFFF) + (y & 0xFFFF);
    let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  static rol (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  static str2binb (str) {
    let bin = [];
    let mask = (1 << Sha1.chrsz) - 1;
    for (let i = 0; i < str.length * Sha1.chrsz; i += Sha1.chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / Sha1.chrsz) & mask) << (24 - i % 32);
    }
    return bin;
  }

  static binb2str (bin) {
    let str = '';
    let mask = (1 << Sha1.chrsz) - 1;
    for (let i = 0; i < bin.length * 32; i += Sha1.chrsz) {
      str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
    }
    return str;
  }

  static binb2hex (binarray) {
    let hexTab = Sha1.hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
        hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
  }

  static binb2b64 (binarray) {
    let tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i += 3) {
      let triplet =
        (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) |
        (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) |
        ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) str += Sha1.b64pad;
        else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
      }
    }
    return str;
  }
}

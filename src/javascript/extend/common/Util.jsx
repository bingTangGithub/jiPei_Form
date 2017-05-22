import CookieUtil from 'extend/common/CookieUtil';
import UrlUtil from 'extend/common/UrlUtil';
import urlConfig from '../../config/config.json';
/**
 * This class is used for defining tool methods such as isType, deepClone, flatten, etc...
 */
let obj2str = Object.prototype.toString;

export default class Util {
  // 获取用户的Openid
  static fetchOpenid () {
    return UrlUtil.fetchParamValueByCurrentURL('openId');
  }

    // 获取用户的token
  static fetchToken () {
    // return 'a8342d065174474286b40bdaccf11f19';
    return Util.fetchCookie('token');
  }

  static fetchCookie (name) {
    return CookieUtil.getCookie(name);
  }

  /**
   * [getCurrentUserId 从cookie中获取用户userid]
   * @Author   JohnNong
   * @Email    overkazaf@gmail.com
   * @Github   https://github.com/overkazaf
   * @DateTime 2016-09-02T16:21:48+0800
   * @return   {Boolean}                    [description]
   */
  static getCurrentUserId () {
    if (urlConfig['current'] === 'dev') {
      return 767;
    } else {
      return CookieUtil.getCookie('user');
    }
  }

  static px2rem ($px) {
    return $px / parseFloat(document.documentElement.style.fontSize);
  }

  static deepClone (obj) {
    if (obj === null || typeof obj !== 'object') return obj;

    let ret = new obj.constructor();

    if (Util.isArray(obj)) {
      ret = [];
      for (let i = 0, l = obj.length; i < l; i++) {
        ret[i] = Util.deepClone(obj[i]);
      }
    } else {
      if (obj instanceof Date) {
        return new Date(obj.valueOf());
      }

      if (obj instanceof RegExp) {
        var pattern = obj.valueOf();
        var flags = '';
        flags += pattern.global ? 'g' : '';
        flags += pattern.ignoreCase ? 'i' : '';
        flags += pattern.multiline ? 'm' : '';
        return new RegExp(pattern.source, flags);
      }

      if (obj instanceof Function) {
        // 函数的话直接指向相对的内存地址
        return obj;
      }

      for (let attr in obj) {
        if (Object.hasOwnProperty.call(obj, attr)) {
          ret[attr] = Util.deepClone(obj[attr]);
        }
      }
    }
    return ret;
  }

  /**
   * [flatten Flatten an array, eg below:
   *           input: var array = [[1, 2, 3], [4, 5, 6], 7, [8]]]
   *           call: Util.flatten(array);
   *           output: [1, 2, 3, 4, 5, 6, 7, 8]
   *
   * @Author   JohnNong
   * @Email    overkazaf@gmail.com
   * @Github   https://github.com/overkazaf
   * @DateTime 2016-11-02T16:47:20+0800
   * @param    {[type]}                     array [description]
   * @return   {[type]}                           [description]
   */
  static flatten (array) {
    let ret = [];

    array.forEach(function (item) {
      if (Util.isArray(item)) {
        ret = ret.concat(Util.flatten(item));
      } else {
        ret.push(item);
      }
    });

    return ret;
  }

  /**
   * [uuid A tiny seed uuid generator]
   * @Author   JohnNong
   * @Email    overkazaf@gmail.com
   * @Github   https://github.com/overkazaf
   * @DateTime 2016-11-03T23:37:15+0800
   * @param    {Number}                     len    [description]
   * @param    {[type]}                     radix  [description]
   * @param    {[type]}                     prefix [description]
   * @param    {[type]}                     subfix [description]
   * @return   {[type]}                            [description]
   */
  static uuid (radix, prefix, subfix, len = 32) {
    let targetId = '';
    let uuid = [];
    let i;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    len = len || 32;
    radix = radix || chars.length;
    prefix = prefix || '';
    prefix = prefix === '' ? '' : prefix + '_';
    subfix = subfix || '';
    subfix = subfix === '' ? '' : '_' + subfix;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    targetId = uuid.join('');

    return prefix + targetId + subfix;
  }

  // ============== Is 类似的工具函数，用于环境检测或是布尔判断 ==================== //

  static isGroupBuy () {
    return Util.isExisty(UrlUtil.fetchParamValueByCurrentURL('poSkuId'));
  }

  /**
   * [isExisty Check if a given var is existy]
   * @Author   JohnNong
   * @Email    overkazaf@gmail.com
   * @Github   https://github.com/overkazaf
   * @DateTime 2016-11-09T11:49:03+0800
   * @param    {[type]}                     obj [description]
   * @return   {Boolean}                        [description]
   */
  static isExisty (obj) {
    return obj != null;
  }

  static isEmptyObject (options) {
    return options != null && Object.keys(options).length === 0;
  }

  static isAos () {
    let __userAgent = navigator.userAgent;
    return !!__userAgent.match(/Android/i);
  }

  static isIOS () {
    let __userAgent = navigator.userAgent;
    return !!__userAgent.match(/(iPhone|iPod|iPad)/i);
  }

  static webSource () {
    if (Util.isAos()) {
      return 3;
    } else if (Util.isIOS()) {
      return 2;
    } else {
      return 1;
    }
  }

  static isEnv (env) {
    let userAgent = window.navigator.userAgent;
    return function () {
      return Util.isExisty(userAgent.match(/(env.toString())/i));
    };
  }

  static __isWeChat = Util.isEnv('MicroMessenger');

  static isType (obj, type) {
    return obj2str.call(obj) === '[object ' + type + ']';
  }

  static isArray (obj) {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(obj);
    } else {
      return Util.isType(obj, 'Array');
    }
  }

  static throttle (method, context, delay = 200) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
      method.call(context);
    },
    delay);
  }

  static throttleV2 (fn, delay, mustRunDelay, context) {
    let timer = null;
    let tStart;

    return function () {
      let args = arguments;
      let tCurr = +new Date();
      clearTimeout(timer);

      if (!tStart) {
        tStart = tCurr;
      }

      if (tCurr - tStart >= mustRunDelay) {
        fn.apply(context, args);
        tStart = tCurr;
      } else {
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      }
    };
  }

  // ============================ 图片懒加载工具 ========================== //
  static getLoadingImageSRC () {
    return 'http://yougo.xinguang.com/fightgroup-web/public/res/imgs/loading@3x.png';
  }

  /**
   * [lazyLoadeImages 图片懒加载函数]
   * @param  {[type]} $images [description]
   * @return {[type]}         [description]
   */
  static lazyLoadImages ($images, size = 8, timeout = 200) {
    let chunks = [];
    let tmp = [];
    $images = $images.filter(function (index, item) {
      // 加载过的不处理
      return typeof $(item).attr('data-src') !== 'undefined';
    });

    // 从上到下进行排序，后边这个优先级算法可以放进algorithm里处理
    $images.sort(function (a, b) {
      if ($(a).offset().top === $(b).offset().top) {
        return $(a).offset().left - $(b).offset().left;
      } else {
        return $(a).offset().top - $(b).offset().top;
      }
    });

    $images.each(function (index, item) {
      if (tmp.length < size) {
        tmp.push($(item));
      } else {
        chunks.push([...tmp]);
        tmp = [item];
      }
    });
    if (tmp.length) chunks.push(tmp);

    $.each(chunks, function (index, chk) {
      setTimeout(function () {
        $.each(chk, function (idx, img) {
          let $img = $(img);
          let src = $img.attr('data-src');
          if (src) {
            // 先把占位用的 default loading image放进去，图片加载完成再替换掉
            let $loadingImage = $('<div></div>').css({
              width: $img.width() + 'px',
              height: $img.height() + 'px',
              backgroundImage: 'url(' + Util.getLoadingImageSRC() + ')',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '50%',
              backgroundPosition: '50% 50%',
            });

            $loadingImage.insertAfter($img);

            $img.hide();
            $img.attr('src', src).on('load', function () {
              $loadingImage.remove();
              $img.show().removeAttr('data-src');
            });
          }
        });
      }, index * timeout);
    });
  }

  static makeChunks (arr, chunkSize) {
    let target = [];
    let tmp = [];
    arr.map((item, index) => {
      if (tmp.length < chunkSize) {
        tmp.push(Util.deepClone(item));
      } else {
        target.push(Util.deepClone(tmp));
        tmp = [];
      }
    });

    if (tmp.length) {
      target.push([...tmp]);
    }

    return target;
  }

  static cloneObjExceptParam (obj, paramName) {
    let newObj = {};
    for (let key in obj) {
      if (key !== paramName) { newObj[key] = obj[key]; }
    }
    return newObj;
  }

  static deleteProperty (obj, paramName) {
    return Reflect.deleteProperty(obj, name);
  }

  static dislodge (arr1, arr2) {
    for (let i = 0, len = arr2.length; i < len; i++) {
      let index = arr1.indexOf(arr2[i]);
      if (index >= 0) {
        arr1.splice(index, 1);
      }
    }
  }

  static merge (arr1, arr2) {
    let ret = [];
    for (let i = 0, len1 = arr1.length; i < len1; i++) {
      ret.push(arr1[i]);
    }
    for (let j = 0, len2 = arr2.length; j < len2; j++) {
      if (!(ret.indexOf(arr2[j]) > -1)) {
        ret.push(arr2[j]);
      }
    }
    return ret;
  }

  static ArrEveEleInAnother (arr1, arr2) {
    if (!arr1.length || !arr2.length) {
      return false;
    }
    let ret = true;
    for (let i = 0, len = arr1.length; i < len; i++) {
      if (arr2.indexOf(arr1[i]) === -1) {
        ret = false;
        break;
      }
    }
    return ret;
  }

  /**
   * [priceFormat 将价格如19.9拆分成数组['19','.9']]
   * @param {[type]} price [判断的字符串]
   * @return {[type]}    [数字要求长度]
   */
  static priceFormat (price) {
    Util.isType(price, String) || (price = String(price));
    let inte = '0';
    let deci = '.00';
    if (price) {
      if (price.indexOf('.') !== -1) {
        let arr = price.split('.');
        inte = arr[0];
        deci = '.' + arr[1];
      } else {
        inte = price;
      }
    }
    return [inte, deci];
  }

  /**
   * [OnlyInt 仅能输入数字]
   * @param {[type]} text [判断的字符串]
   * @param {[type]} text [数字要求长度]
   */
  static OnlyInt (text, len) {
    let rtn = text.replace(/[^0-9]/g, '');
    if (rtn.length > len) {
      rtn = rtn.substring(0, len);
    }
    return rtn;
  }

  static DomInView (el) {
    var rule = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    let bcr = el.getBoundingClientRect();
    let mw = el.offsetWidth;
    let mh = el.offsetHeight;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let boolX = (
      !((bcr.right - rule.left) <= 0 && ((bcr.left + mw) - rule.left) <= 0) &&
      !((bcr.left + rule.right) >= w && (bcr.right + rule.right) >= (mw + w))
    );
    let boolY = (
      !((bcr.bottom - rule.top) <= 0 && ((bcr.top + mh) - rule.top) <= 0) &&
      !((bcr.top + rule.bottom) >= h && (bcr.bottom + rule.bottom) >= (mh + h))
    );
    if (el.width !== 0 && el.height !== 0 && boolX && boolY) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * [limitStrLen 限制字数]
   * @param  {[type]} string [description]
   * @param  {[type]} num    [字数限制]
   * @return {[type]}        [description]
   */
  static limitStrLen (string, num) {
    if (string) {
      if (string.length > num) {
        string = string.substring(0, num);
        string += '...';
      };
    }
    return string;
  };
}

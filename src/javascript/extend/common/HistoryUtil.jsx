export default
class HistoryUtil {
  static goBack () {
    history.go(-1);
  }

  static goForward () {

  }

  static pushHistory () {

  }

  static popHistory () {

  }

  static listHistory () {

  }

  static addHistoryBackListener (backFn) {
    var state = {
      title: document.title,
      url: location.href,
    };
    let pushHistory = () => {
      window.history.pushState(state, state.title, state.href);
    };

    pushHistory();

    let eventHandler = function (e) {
      backFn && backFn();
      window.removeEventListener('popstate', eventHandler);
    };
    window.addEventListener('popstate', eventHandler, false);
  }
}

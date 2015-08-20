/*global self, Element, window, document*/
(function() {

  // using self instead of window enables this polyfill to work for Workers too
  var addEventListener = self.addEventListener;
  var removeEventListener = self.removeEventListener;

  function EventListenerList() {}
  EventListenerList.prototype = [];
  EventListenerList.prototype.constructor = EventListenerList;

  _nonEnumerable(self, 'eventListenerList', {});
  self.addEventListener = modifiedAddEventListener;
  self.removeEventListener = modifiedRemoveEventListener;
  if (typeof document !== "undefined") {
    _nonEnumerable(document, 'eventListenerList', {});
    _nonEnumerable(document.body, 'eventListenerList', {});
    _nonEnumerable(Element.prototype, 'eventListenerList', {});

    document.addEventListener = modifiedAddEventListener;
    document.removeEventListener = modifiedRemoveEventListener;

    document.body.addEventListener = modifiedAddEventListener;
    document.body.removeEventListener = modifiedRemoveEventListener;

    Element.prototype.addEventListener = modifiedAddEventListener;
    Element.prototype.removeEventListener = modifiedRemoveEventListener;
  }

  function _nonEnumerable(obj, prop, initialValue) {
    Object.defineProperty(
      obj,
      prop,
      {
        writable: true,
        configurable: true,
        enumerable: false,
        value: initialValue
      });
  }

  function modifiedAddEventListener(event, handler, useCapture) {
    this.eventListenerList[event] = this.eventListenerList[event] || [];
    this.eventListenerList[event].push({
      handler: handler,
      name: handler.name || 'anonymous',
      useCapture: useCapture || false
    });
    addEventListener.call(this, event, handler, useCapture);
  }

  function modifiedRemoveEventListener(event, handler, useCapture) {
    if (this.eventListenerList[event]) {
      removeHandlerFromList(this.eventListenerList[event], handler, useCapture)
    }
    removeEventListener.call(this, event, handler, useCapture);
  }

  function removeHandlerFromList(list, handler, useCapture) {
    useCapture = !!useCapture;
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.handler === handler && item.useCapture === useCapture) {
        list.splice(i, 1);
        break;
      }
    }
  }

})();

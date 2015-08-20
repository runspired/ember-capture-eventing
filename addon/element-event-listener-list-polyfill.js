/*global self, Element, window, document*/
var addEventListener = self.addEventListener;
var removeEventListener = self.removeEventListener;

function EventListenerList() {}
EventListenerList.prototype = [];
EventListenerList.prototype.constructor = EventListenerList;

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

_nonEnumerable(self, 'eventListenerList', {});
if (typeof document !== "undefined") {
  _nonEnumerable(document, 'eventListenerList', {});
  _nonEnumerable(document.body, 'eventListenerList', {});
  _nonEnumerable(Element.prototype, 'eventListenerList', {});
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

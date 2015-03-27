//------------------------------
// Constants
//------------------------------

var RE_SELECTOR = /(?:^|,\s+)(\w+)\s?([^,]+)?/gi;
var RE_POINTER = /pointer(\w+)/gi;

//------------------------------
// Pointer
//------------------------------

Pointer = {

  /*
   * A map relating pointer event names to native event names. A placeholder
   * for selectors is provided in the native event strings for any DOM
   * selectors that follow the original pointer event name to be copied into.
   */

  EVENT_MAP: {
    'pointerenter': 'mouseenter {{selector}}',
    'pointerleave': 'mouseleave {{selector}}',
    'pointerclick': 'click {{selector}}',
    'pointerdown': 'mousedown {{selector}}, touchstart {{selector}}',
    'pointermove': 'mousemove {{selector}}, touchmove {{selector}}',
    'pointerup': 'mouseup {{selector}}, touchend {{selector}}'
  },

  /*
   * Searches the provided event object for a populated TouchList and returns
   * the result.
   */

  getTouches: function(e) {

    e = e.originalEvent || e;

    return (
      e.touches && e.touches.length ? e.touches :
      e.targetTouches && e.targetTouches.length ? e.targetTouches :
      e.changedTouches && e.changedTouches.length ? e.changedTouches :
      null
    );
  },

  /*
   * Populates `x` and `y` properties on an event from either mouse or touch
   * inputs.
   */

  normalize: function(e) {

    if (_.isNumber(e.clientX)) {

      e.x = e.x || e.clientX;
      e.y = e.y || e.clientY;

    } else {

      var touches = Pointer.getTouches(e);
      e.x = touches[0].clientX;
      e.y = touches[0].clientY;
    }

    return e;
  }

};

//------------------------------
// Helpers
//------------------------------

/*
 * Parses a Meteor eventMap key string and returns a dictionary where the keys
 * are event types and the values are Arrays of DOM selectors for that event.
 */

function parseSelector(selector) {

  RE_SELECTOR.lastIndex = 0;

  var map = {};
  var match = RE_SELECTOR.exec(selector);

  while (match) {
    var eventType = match[1];
    var domSelector = match[2] || '';
    map[eventType] = map[eventType] || [];
    map[eventType].push(domSelector);
    match = RE_SELECTOR.exec(selector);
  }

  return map;
}

/*
 * Replaces event names in a Meteor eventMap string using the provided map.
 * Either a raw or parsed string (using parseSelector) can be passed.
 */

function remapSelector(selector, map) {

  if (_.isString(selector)) {
    selector = parseSelector(selector);
  }

  var result = [];

  _.each(selector, function(selectors, eventType) {
    if (map[eventType]) {
      _.each(selectors, function(selector) {
        result.push(map[eventType].replace(/{{selector}}/gi, selector));
      });
    }
  });

  return result.join(', ');
}

/*
 * Wraps an event handler such that the events input is normalized before the
 * original handler is called.
 */

function normalizeHandler(handler, context) {

  var originalHandler = $.proxy(handler, context);

  return function(event) {
    Pointer.normalize(event);
    originalHandler.apply(context, arguments);
  };
}

/*
 * Extends `methodName` on the given prototype with the method provided. The
 * original method will be called after the new one has executed.
 */

function extendPrototypeMethod(object, methodName, method) {

  var parent = object.prototype[methodName];

  object.prototype[methodName] = function() {
    method.apply(this, arguments);
    parent.apply(this, arguments);
  };
}

//------------------------------
// Augment Template
//------------------------------

extendPrototypeMethod(Template, 'events', function(eventMap) {

  // Traverse the event map to see if it contains pointer events
  _.each(eventMap, function(handler, selector) {

    // Reset regex since they're flagged as global and will advance
    RE_POINTER.lastIndex = 0;

    var parsed = parseSelector(selector);

    // Process any pointer events
    if (RE_POINTER.test(selector)) {

      // Remove the current selector from the event map
      delete eventMap[selector];

      // Map the pointer event names to native
      selector = remapSelector(parsed, Pointer.EVENT_MAP);

      // Insert a new handler for the native events
      eventMap[selector] = normalizeHandler(handler, this);
    }

  }, this);

});
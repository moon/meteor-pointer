# Meteor Pointer Events

Provides a unified way to handle touch and mouse events in Meteor via Template evenMaps.

## Example

Instead of binding to mouse and touch events, you can use the pointer equivalents.

    Template.MyTemplate.events({
      pointermove: function( event, template ) {
        console.log('pointermove', event.x, event.y);
      }
    });

The event parameter passed to a handler will contain `x` and `y` properties, which represent the `clientX` and `clientY` values of either the mouse or first touch.

## Events

The following pointer events are supported:

- `pointerenter`
- `pointerleave`
- `pointerclick`
- `pointermove`
- `pointerdown`
- `pointerup`
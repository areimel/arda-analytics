# Code Examples

## Old code from previous version of the project

These are examples of code from a previous version of this plugin. It was written using jQuery, as that was common at the time, and will need to be rewritten in vanilla JS.

### Main Event Push Code

This is the original code for pushing custom events - it is the core functionality of the original plugin. It listens for a click event on any element with `[data-event='GAEvent']`, grabs the tracking event variables from the element's inline data-attributes, then does a datalayer push that gets picked up by a Google Tag Manager tag.

```js
$("[data-event='GAEvent']").click(function() {
    //Set vars
    var evCat = $(this).attr('data-category') 	? $(this).attr('data-category') : '';
    var evAct = $(this).attr('data-action') 		? $(this).attr('data-action') : '';
    var evLab = $(this).attr('data-label') 		? $(this).attr('data-label') : '';
    var evVal = $(this).attr('data-value') 		? $(this).attr('data-value') : '';

    try {
        //Fire event
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            'event': 			'GAEvent',
            'eventCategory': 	evCat,
            'eventAction': 		evAct,
            'eventLabel': 		evLab,
            'eventValue': 		evVal,
        });

        console.log("GA Event fired - Event Category: ["+evCat+"], Event Label: ["+evLab+"], Event Action: ["+evAct+"]");

    } catch (e) {
        console.log("GA Event Error");
    }
});
```

Critical: the formatting of the following section is critical for the plugin to function correctly. Since the datalayer push is picked up by Google Tag Manager, the variables have to be correctly named. Unexpected variable names will not be picked up.

```js
dataLayer.push({
    'event': 'GAEvent',
    'eventCategory': evCat,
    'eventAction': evAct,
    'eventLabel': evLab,
    'eventValue': evVal,
});
```
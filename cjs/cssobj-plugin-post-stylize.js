'use strict';

/**
 * @fileOverview cssobj plugin for apply style into browser head
 * @name cssobj-plugin-post-stylize.js • src
 * @author James Yang [jamesyang999@gmail.com]
 * @license MIT
 * @usage
cssobj(obj, {
  post:[cssobj_plugin_post_stylize({name:'gaga', attrs: {media: 'screen'}})]
})
 */

function escapeHTML (str) {
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function stylize (element, sheet) {
  if(element.cachedCSS===sheet) return
  element.cachedCSS = sheet
  if (element.styleSheet) {
    element.styleSheet.cssText = sheet
  } else {
    // empty all style when re-apply new style
    while(element.firstChild) element.removeChild(element.firstChild)
    element.appendChild(document.createTextNode(sheet))
  }
  return element
}

function addStyleToHead (option) {
  option = option || {}
  if (!option.name) option.name = +new Date() + '_'
  return function (sheet) {
    var id = 'style_cssobj_' + escapeHTML(option.name)
    var styleDom = document.getElementById(id)
    if (!styleDom) {
      var el = document.createElement('style')
      document.head.appendChild(el)
      styleDom = el
    }
    styleDom.setAttribute('id', id)
    styleDom.setAttribute('type', 'text/css')
    if (option && typeof option == 'object' && option.attrs)
      for (var i in option.attrs) {
        styleDom.setAttribute(i, option.attrs[i])
    }
    return stylize(styleDom, sheet.css)
  }
}

module.exports = addStyleToHead;
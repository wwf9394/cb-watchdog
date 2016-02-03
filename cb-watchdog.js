// ==UserScript==
// @name         CB Watchdog
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       zero
// @match        *://chaturbate.com/*
// @require 	 https://code.jquery.com/jquery-2.2.0.min.js
// @grant        nonea
// ==/UserScript==
/* jshint -W097 */
'use strict';
$(document).ready(function () {
    var backup;
    var style = "<style type='text/css'>" +
        ".chatname { color:white; padding: 2px 3px; display: block; border-radius: 0 4px 4px 0; }" +
        ".histname { color:white; padding: 2px 3px; border-radius: 0 4px 4px 0; }" +
        ".chatname:hover { text-decoration: underline; }" +
        ".pfbutton { color: white; background-color: green; width: 100%; }" +
        ".pfbutton:hover { text-decoration: underline; }" +
        "#pfinput { border: 3px solid grey; background-color: #BCF5A9; width: 100%; height: 100%; padding: 0; margin: 0; font-size: 1.5em; }" +
        "#pfinput:focus { border-color: green; }" +
        ".zerobug, .cacheme { background-color: coral; }" +
        ".lvbgtts, .lvbgtts2 { background-color: #073f00; }" +
        ".depdepdep11 { background-color: #6F2DA8; }" +
        ".kurttheflirt24 { background-color: steelblue; }" +
        ".squeak2596 { background-color: #2A044A; }" +
        ".orangesoap { background-color: orange; }" +
        "</style>";
    $(style).appendTo("head");
    var defChat = $('.section');
    // CB Chat Input
    var chatInput = $('#chat_input').css({
        height: '100%',
        border: '3px solid grey',
        fontSize: '1.5em',
        margin: '0',
        padding: '0'
    }).addClass('cbinput');
    // CB Send Button
    $('.chat-form').submit(function () {
        if (backup != '') {
            chatInput.val(backup);
            backup = '';
        }
    });
    // Reset Button for occasional out-of-view PF elements
    var resetButton = $('<a href="#">_</a>').click(function (e) {
        defChat.css('height', '100%');
        e.preventDefault();
        e.returnValue = false;
    });
    $('.chat-form td').next().attr('width', '5').append(resetButton);
    //
    var tbody = $('tbody').has('#chat_input');
    //
    var tr = $('<tr>');
    tbody.append(tr);
    //
    var td1 = $('<td>');
    var td2 = $('<td width=1>');
    var td3 = $('<td width=20>');
    var td4 = $('<td width=30>');
    tr.append(td1).append(td2).append(td3).append(td4);
    //
    var pfText = $('<input type=text autocomplete=off maxlength=1024 id="pfinput">').keypress(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            e.returnValue = false;
            return false;
        }
    }).focusout(function () {
        backup = '';
    }).appendTo(td1);
    // Dummy button
    $('<button style="display: none;">Dummy</button>').appendTo(td3);
    // PF Button
    $('<button class="pfbutton">PF</button>').click(function (e) {
        if (pfText.val() == '') {
            e.preventDefault();
            e.stopPropagation();
        } else {
            if (chatInput.val() != '') {
                backup = chatInput.val();
            }
            chatInput.val('/pf ' + pfText.val()).focus();
            pfText.val('');
        }
    }).appendTo(td4);
    // Must calculate at the very end
    defChat.css('height', '100%');
    var target = document.querySelector('.chat-list');
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var newline = $(mutation.addedNodes[0]);
            var notice = newline.find('p>span');
            var noticeBColor = 'gray';
            if (notice.css('backgroundColor') == 'rgb(188, 245, 169)') {
                noticeBColor = 'green';
            }
            if (notice.css('backgroundColor') == 'rgb(248, 224, 247)') {
                noticeBColor = 'magenta';
            }
            if (notice.length > 0) { // Notice
                //                debugger;
                notice.html(notice.html().replace('Notice: ', ''));
                var msg = notice.parent();
                msg.html(msg.html().replace(/(\[(.+)\]\:)/, '<span class="histname $2">$2</span>'));
            } else {
                //                debugger;
                var chatline = newline.children('span');
                if (newline[0].lastChild.tagName == 'SPAN') { // Blank chat line
//                if (newline.children('*:last-child').is('span')) {
                    newline.hide();
                } else {
                    chatline.html(chatline.html().replace(/(.+):/, '<span class="chatname" style="background-color:' + chatline.css('color') + ';">$1</span>'));
                }
            }
        });
    });
    // configuration of the observer:
    var config = {
        childList: true
    };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
});

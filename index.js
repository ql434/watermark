/**
 * Created by qiankun on 17/3/7.
 */

'use strict';
var $ = require('jquery');

var _ns = "http://www.w3.org/2000/svg";
function stamp($root, stampText) {

    // 创建一个svg对象
    var svg = document.createElementNS(_ns, "svg");
    var width = 250, height = 100;
    $(svg).attr({
        width: width,
        height: height
    });

    // svg中绘制文本
    var svgText = document.createElementNS(_ns, "text");
    $(svgText).appendTo(svg).attr({
        fill: "black",
        "text-anchor": "middle",
        "font-family": "monospace",
        "transform": "translate(125, 50)rotate(-15)"
    }).css({
        "font-size": "12px",
        "-webkit-font-smoothing": "antialiased"
    }).text(stampText);

    var svgStr = new XMLSerializer().serializeToString(svg);
    var bgUrl = 'data:image/svg+xml;base64,' + $.encode(svgStr);
    var img = new Image();
    img.onload = function () {
        var canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        var canvasImgUrl = canvas.toDataURL("image/png");
        $root.css({
            "background-image": 'url("' + canvasImgUrl + '")'
        });
        document.body.removeChild(canvas);
    };
    img.src = bgUrl;
    $(svg).remove();
}


var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
// public method for encoding
$.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = $._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

    }

    return output;
}

$._utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
}

exports.fillStamp = function (root, stampText) {
    if ($(root).css("position") === "static") {
        $(root).css("position", "relative");
    }
    var $stamp = $("<div/>").appendTo($(root))
        .css({
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: .09,
            "pointer-events": "none",
            "z-index": 999
        });
    stamp($stamp, stampText);
}
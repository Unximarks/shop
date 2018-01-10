/**
 * Created by lizhenya on 2017/10/19.
 */

(function(win) {
        var remCalc = {};
        var docEl = win.document.documentElement, tid;
        function refreshRem() {
            var width = docEl.getBoundingClientRect().width;
            if (width > 640) {
                width = 640
            }
            var rem = width / 10;
            // docEl.style.color = rem + "px";
            // remCalc.rem = rem;
            // var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
            if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
                var remScaled = rem * rem / actualSize;
                docEl.style.fontSize = remScaled + "px"
            }
        }
        function dbcRefresh() {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 100)
        }
        win.addEventListener("resize", function() {
            dbcRefresh()
        }, false);
        win.addEventListener("pageshow", function(e) {
            if (e.persisted) {
                dbcRefresh()
            }
        }, false);
        refreshRem();
        remCalc.refreshRem = refreshRem;
        remCalc.rem2px = function(d) {
            var val = parseFloat(d) * this.rem;
            if (typeof d === "string" && d.match(/rem$/)) {
                val += "px"
            }
            return val
        }
        ;
        remCalc.px2rem = function(d) {
            var val = parseFloat(d) / this.rem;
            if (typeof d === "string" && d.match(/px$/)) {
                val += "rem"
            }
            return val
        }
        ;
        win.remCalc = remCalc
    }
)(window);

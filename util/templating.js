import {evalInContext, interpolateString} from "./interpolating.js";

export function compileElement ($item, scope) {

    function _eachSelf(el, selector, foo) {
        el.find(selector).each(foo);
        if (el.is(selector)) {
            foo.call(el[0]);
        }
    }

    //.addBack('selector')
    _eachSelf($item, "[data-onclick]", function () {
        let onClick = $(this).attr("data-onclick");
        $(this).removeAttr("data-onclick");
        $(this).click(function (event) {
            evalInContext(onClick, scope, {event: event});
        })
    })

    _eachSelf($item, "[data-onchange]", function () {
        let onChange = $(this).attr("data-onchange");
        $(this).removeAttr("data-onchange");
        $(this).change(function (event) {
            evalInContext(onChange, scope, {event: event});
        })
    });

    _eachSelf($item, "[data-checked]", function () {
        let _val = $(this).attr("data-checked");
        let val = evalInContext(_val, scope);
        if (val) {
            $(this).attr("checked", "checked");
        } else {
            $(this).removeAttr("checked");
        }

    });
    _eachSelf($item, "[data-src]", function () {
        let _val = $(this).attr("data-src");
        let val = evalInContext(_val, scope);
        if (val) {
            $(this).attr("src", val);
        }

    });
    _eachSelf($item, "[data-if]", function () {
        let _val = $(this).attr("data-if");
        if (_val === "false") {
            $(this).remove();
        }
        if (_val === "true") {

        } else {
            let val = evalInContext(_val, scope);
            if (!val) {
                $(this).remove();
            }
        }
    });
    _eachSelf($item, "[data-include]", function () {
        let _el = $(this);
        let _val = _el.attr("data-include");
        let val = evalInContext(_val, scope);
        _el.load(val);
    });
}

export function parseTemplate (tpl, scope) {
    let $item = $(interpolateString(tpl,scope));
    compileElement($item, scope);
    return $item;
}

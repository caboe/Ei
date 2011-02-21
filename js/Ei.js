var Ei = function() {
    //config
    var prefix = "ei";

    var eiArray = new Array();
    var mainEi = null;

    var parseDOM = function(baseEl) {
        /*is this final ei*/
        if (!baseEl.find('[eiId]').length && $.type(baseEl.attr('eiId')) != "undefined") {
            generateEi(0, baseEl);
        }
        else {
            var eiElements = baseEl.find('[eiId]');
            var filteredEiElements = new Array();
            for (var i = 0; i < eiElements.length; i++) {
                if ($(eiElements[i]).parent('[eiId]').length == 0) {
                    filteredEiElements.push(eiElements[i]);
                }
            }
            $.each(filteredEiElements, generateEi);
        }
    };

    var generateEi = function(idx, el) {
        var config = {data:[], id:'noname' + eiArray.length};
        var attributes = el.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var curAttribute = attributes[i];
            if (curAttribute.name.indexOf(prefix) === 0 && curAttribute.name.length > prefix.length) {
                var prop;
                try {
                    prop = eval("("+curAttribute.value+")");
                }
                catch (e) {
                    prop = curAttribute.value;
                }
                //prop = (curAttribute.value.indexOf("function") == 0)?eval(curAttribute.value):curAttribute.value;
                config[curAttribute.name.replace(/ei/, '').toLowerCase()] = prop;
            }
        }
        config.container = $(el);
        config.template = $(el).html().replace(/%7B/g, '{').replace(/%7D/g, "}"); //todo: replace only ei brackets
        mainEi = new EiObject(config);
        if (config.dataurl) {
            mainEi.load(config.dataurl);
        }
        else {
            mainEi.render();
        }
        eiArray.push(mainEi);
    };

    $(document).ready(function() {
        parseDOM($('body'))
    });

    var get = function(eiId) {
        for (var i = 0; i < eiArray.length; i++) {
            if (eiArray[i].id == eiId) {
                return eiArray[i];
            }
        }
    };

    return {
        get:get
    }
}();
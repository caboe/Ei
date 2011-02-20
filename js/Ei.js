var Ei = function() {

    var eiArray = new Array();
    var mainEi = null;

    var parseDOM = function(baseEl) {
        /*is this final ei*/
        if (!baseEl.find('[ei]').length && $.type(baseEl.attr('ei')) != "undefined") {
            generateEi(0, baseEl);
        }
        else {
            var eiElements = baseEl.find('[ei]');
            var filteredEiElements = new Array();
            for (var i = 0; i < eiElements.length; i++) {
                if ($(eiElements[i]).parent('[ei]').length == 0) {
                    filteredEiElements.push(eiElements[i]);
                }
            }
            $.each(filteredEiElements, generateEi);
        }
    };

    var generateEi = function(idx, el) {
        var config = {};
        config.id = $(el).attr('ei');
        config.container = $(el);
        config.template = $(el).html().replace(/%7B/g, '{').replace(/%7D/g, "}");
        mainEi = new EiObject(config);
        mainEi.load($(el).attr('dataUrl'));
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
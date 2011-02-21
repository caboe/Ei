var EiObject = function(config) {
    var id = config.id;
    var container = config.container;
    var mapping = (config.mapping) ? config.mapping.split('.') : [];
    var template = config.template;
    var data = config.data || new Array();
    var self = this;
    var eiArray = new Array();
    var eiTemplateArray = new Array();
    var subEis = container.find('[ei]');
    var refresh = config.refresh || 0;
    var dataUrl = config.dataurl;


    var saveSubEiTemplate = function(idx, el) {
        /*
         var config = {};
         config.id = $(el).attr('ei');
         config.container = $(el);
         config.data = ($(el).attr('eiData'))?eval($(el).attr('eiData')):[];
         config.template = $(el).html().replace(/%7B/g, '{').replace(/%7D/g, "}");
         eiTemplateArray.push(config);
         */

        var config = {};
        var attributes = el.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var curAttribute = attributes[i];
            if (curAttribute.name.indexOf(prefix) === 0 && curAttribute.name.length > prefix.length) {
                var prop;
                try {
                    prop = eval("(" + curAttribute.value + ")");
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
        eiTemplateArray.push(config);
    };

    var processSubEi = function(idx, el) {
        var config = {};
        config.id = $(el).ei;
        config.container = $(el);
        config.template = $(el).html().replace(/%7B/g, '{').replace(/%7D/g, "}");
        var mainEi = new EiObject(config);
        mainEi.load($(el).attr('dataurl'));
        eiArray.push(mainEi);
    };

    var initData = function(rawData) {
        for (var i = 0; i < mapping.length; i++) {
            rawData = rawData[mapping[i]];
        }
        data = ($.type(rawData) === 'array') ? rawData : [rawData];
    };

    var render = function(newData) {
        if (newData) {
            data = newData;
        }
        var jsonObj = {};
        var result = '';
        var tmpl = '';
        var i = 0;
        for (i = 0; i < data.length; i++) {
            jsonObj = data[i];
            tmpl = template;
            for (var prop in jsonObj) {
                var regEx = eval('/{' + prop + '}/g');
                tmpl = tmpl.replace(regEx, jsonObj[prop]);
            }
            result += tmpl;
        }
        container.html(result);
        //then replace SubEis
        var subEis = new Array();
        for (i = 0; i < eiTemplateArray.length; i++) {
            subEis = container.find('[ei=' + eiTemplateArray[i].id + ']');
            subEis.html(eiTemplateArray[i].template);
            $.each(subEis, processSubEi);
        }
    };

    var callback = function() {
        return function(data) {
            initData(data);
            render();
        }
    };

    //show Loading
    var showLoading = config.loading || function() {
        container.html("loading...");
    };


    var load = function(url) {
        dataUrl = url;
        showLoading();
        $.getJSON(dataUrl, callback());
    };

    //save child Eis for later processing
    $.each(subEis, saveSubEiTemplate);

    if (parseInt(refresh)) {
        window.setInterval(function() {
            load(dataUrl)
        }, refresh * 1000);
    }

    return {
        load: load,
        render: render,
        id: id
    }
};

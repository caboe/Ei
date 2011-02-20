var EiObject = function(config) {
    this.id = config.id;
    var container = config.container;
    var mapping = container.attr('mapping').split('.') || '';
    var template = config.template;
    var data = new Array();
    var self = this;
    var eiArray = new Array();
    var eiTemplateArray = new Array();

    var saveSubEiTemplate = function(idx, el) {
        var config = {};
        config.id = $(el).attr('ei');
        config.container = $(el);
        config.template = $(el).html().replace(/%7B/g, '{').replace(/%7D/g, "}");
        eiTemplateArray.push(config);
    };

    var processSubEi = function(idx, el) {
        var config = {};
        config.id = $(el).ei;
        config.container = $(el);
        config.template = $(el).html().replace(/%7B/g, '{').replace(/%7D/g, "}");
        var mainEi = new EiObject(config);
        mainEi.load($(el).attr('dataUrl'));
        eiArray.push(mainEi);
    };

    var initData = function(rawData) {
        for (var i = 0; i < mapping.length; i++) {
            rawData = rawData[mapping[i]];
        }
        data = ($.type(rawData) === 'array') ? rawData : [rawData];
    };

    var render = function() {
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
    var loading = config.loading || function() {
        container.html("loading...");
    };

    //has subEis?
    var subEis = container.find('[ei]');
    $.each(subEis, saveSubEiTemplate);
    loading();

    this.load = function(url) {
        dataUrl = url
        $.getJSON(dataUrl, callback());
    }
};

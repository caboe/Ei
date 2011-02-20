var EiObject = function(config) {
    var id = config.id;
    var container = config.container;
    var dataUrl = container.attr('dataUrl');
    var mapping = container.attr('mapping').split('.') || '';
    var template = container.html().replace(/%7B/g, '{').replace(/%7D/g, "}");
    var data = new Array();
    var self = this;


    var initData = function(rawData){
       for (var i=0; i<mapping.length; i++){
           rawData = rawData[mapping[i]];
       }
       data = ($.type(rawData) === 'array')? rawData: [rawData];
    };

    var render = function(){
        var jsonObj = {};
        var result = '';
        var tmpl = '';
        for (var i=0; i<data.length; i++){
            jsonObj = data[i];
            tmpl = template;
            for (var prop in jsonObj){
                var regEx = eval('/{' + prop + '}/g');
                tmpl = tmpl.replace(regEx, jsonObj[prop]);
            }
            result += tmpl;
        }
        container.html(result);
    };

    var callback = function() {
        return function(data){
            initData(data);
            render();
        }
    };

    $.getJSON(dataUrl,callback());
};

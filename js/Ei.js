var Ei=function(){

    var eiArray = new Array();

    var parseDOM = function(baseEl){
        /*is this final ei*/
        if (!baseEl.find('[ei]').length && $.type(baseEl.attr('ei')) != "undefined"){
            generateEi(0, baseEl);
        }
        else{
            var eiElements = baseEl.find('[ei]');
            $.each(eiElements, generateEi);
        }
/*
       var eiElements = (baseEl.attr('ei'))?baseEl:baseEl.find('[ei]');
        $.each(eiElements, generateEi);
*/
    };

    var generateEi = function(idx, el){
        var config= {};
        config.id = $(el).ei;
        config.container = $(el);
        eiArray.push(new EiObject(config));
    };

    $(document).ready(function(){
            parseDOM($('#a'))});
}();
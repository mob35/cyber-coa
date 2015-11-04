(function (global) {
    var app = global.app = global.app || {};
    
    coa_dateTimeFormat = kendo.data.ObservableObject.extend({
        newDateTimeFormat: function (timestamp) {
            var datess = moment(timestamp / 1000, 'X').format("DD-MMMM-YYYY HH:mm:ss");
            return datess;
        }
        //----------------------------------------- end viewModel -----------------------------------------

    });
    
    app.coa_dateTimeFormatService = {
        init: function () {

        },
        show: function () {
            
        },
        hide: function () {
            
        },
        viewModel: new coa_dateTimeFormat()
        }
	
	
})(window);
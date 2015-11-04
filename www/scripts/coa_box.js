(function (global) {
    var app = global.app = global.app || {};

    boxViewModel = kendo.data.ObservableObject.extend({
        wText: "",
        wLink: "",
        setWarning: function (statusID, xhrText) {
            var that = app.coa_boxService.viewModel;
            kendo.bind($("#div_warning"), that);
            var errorText = "...";

            if (statusID != 0 || statusID != "0") {
                if (statusID == 1 || statusID == 200) {
                    errorText = xhrText;
                } else {
                    if (xhrText != "" && xhrText != null) {
                        if (JSON.parse(xhrText).RESPONSE_MSG != undefined) {
                            errorText = JSON.parse(xhrText).RESPONSE_MSG;
                            if (JSON.parse(xhrText).RESPONSE_CODE == "3004") {
                                app.loginService.viewModel.logout();
                            } else {
                            }
                        } else if (JSON.parse(xhrText).Message != undefined) {
                            errorText = JSON.parse(xhrText).Message;
                        } else {
                            errorText = '...' + xhrText;
                        }
                    } else {
                        errorText = 'none response.';
                    }
                }

            } else {
                errorText = 'Can not connect.';
            }
            that.set('wText', errorText);
            $("#div_warning").show();
        },
        setConfirm: function (text, link) {
            var that = app.coa_boxService.viewModel;
            kendo.bind($("#div_confirm"), that);
            that.set('cText', text);
            that.set('cLink', link);
            $("#div_confirm").show(); 
        },
        setComplete: function (text) {
            var that = app.coa_boxService.viewModel;
            kendo.bind($("#div_complete"), that);
            that.set('comText', text);
            $("#div_complete").show();
        },
        hideWarning: function () {
            $("#div_warning").hide();
        },
        hideConfirm: function () {
            $("#div_confirm").hide();
        },
        hideComplete: function () {
            $("#div_conplete").hide();
        }
        //----------------------------------------- end viewModel -----------------------------------------

    });

    app.coa_boxService = {
        init: function () {
            //app.coa_boxService.viewModel.setWarning();
            //app.coa_boxService.viewModel.setComplete();
            //app.coa_boxService.viewModel.setConfirm();
        },
        show: function () {

        },
        hide: function () {

        },
        viewModel: new boxViewModel()
    }


})(window);
var warningViewModel = kendo.observable({
            
        });



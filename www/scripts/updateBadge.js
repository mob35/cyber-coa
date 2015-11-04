(function (global) {
    var app = global.app = global.app || {};

    updateBadgeViewModel = kendo.data.ObservableObject.extend({
        toUserName: "",
        setBadge: function (badgeName, badgeCount) {
            //var tabstrip = $("#coa_tabstrip").data("kendoMobileTabStrip");
            //if (!tabstrip) {
            //    return;
            //}
            if (badgeCount < 0) {
                $("a#" + badgeName).find(".km-badge").html($("a#" + badgeName).find(".km-badge").html() - 1);
                //tabstrip.badge("#" + badgeName, +$("a#" + badgeName).find(".km-badge").html() - 1);
            } else {
                $("a#" + badgeName).find(".km-badge").html(badgeCount);
                //tabstrip.badge("#" + badgeName, badgeCount);
            }
            if ($("a#" + badgeName).find(".km-badge").html() <= 0) {
                $("a#" + badgeName).find(".km-badge").css('background', 'none');
                $("a#" + badgeName).find(".km-badge").css('color', 'black');
            } else {
                $("a#" + badgeName).find(".km-badge").css('background', '#da2228');
                $("a#" + badgeName).find(".km-badge").css('color', '#fff');
            }
        },
        loadData_badgeInform: function () {
            var that = app.updateBadgeService.viewModel;

            var dataValue = {
                "TRAN_TYPE": "I",
                "TOKEN": localStorage.getItem("TOKEN"),
                "USER_ID": localStorage.getItem("USER_ID"),
                "VERSION": localStorage.getItem("VERSION")
            };
            var source = new kendo.data.DataSource({
                transport: {
                    read: function (operation) {

                        $.ajax({
                            beforeSend: app.loginService.viewModel.checkOnline,
                            url: app.configService.serviceUrl + "api/GetApprovalTransaction",
                            type: "POST",
                            data: JSON.stringify(dataValue),
                            dataType: "json",
                            contentType: 'application/json; charset=UTF-8',
                            success: function (response) {
                                console.log("loadData_badgeInform :: success");
                                var countInform = 0;
                                
                                if (response.RESPONSE_CODE == "0000") {
                                    $.each(response.RESULTS, function (i, item) {
                                        if (item.PROCESSED_FLG == "WAIT") {
                                            
                                            countInform++;
                                            
                                        }
                                    });
                                    
                                    
                                    app.updateBadgeService.viewModel.setBadge("inform_badge", countInform);
                                    

                                } else {
                                    app.coa_boxService.viewModel.setWarning(1, response.RESPONSE_MSG);
                                }
                            },
                            error: function (xhr, error) {
                                console.log(error + ' :code[' + xhr.status + '] ' + xhr.statusText + ' :: ' + xhr.responseText);
                                app.coa_boxService.viewModel.setWarning(xhr.status, xhr.responseText);
                            }
                        });

                    }
                }
            });
            source.fetch();
        },
        loadData_badgeNeedApprove: function () {
            var that = app.updateBadgeService.viewModel;

            var dataValue = {
                "TRAN_TYPE": "N",
                "TOKEN": localStorage.getItem("TOKEN"),
                "USER_ID": localStorage.getItem("USER_ID"),
                "VERSION": localStorage.getItem("VERSION")
            };
            var source = new kendo.data.DataSource({
                transport: {
                    read: function (operation) {

                        $.ajax({
                            beforeSend: app.loginService.viewModel.checkOnline,
                            url: app.configService.serviceUrl + "api/GetApprovalTransaction",
                            type: "POST",
                            data: JSON.stringify(dataValue),
                            dataType: "json",
                            contentType: 'application/json; charset=UTF-8',
                            success: function (response) {
                                console.log("loadData_badgeInform :: success");
                                var countInform = 0;

                                if (response.RESPONSE_CODE == "0000") {
                                    app.updateBadgeService.viewModel.setBadge("needApprove_badge", countInform);
                                } else {
                                    app.coa_boxService.viewModel.setWarning(1, response.RESPONSE_MSG);
                                }
                            },
                            error: function (xhr, error) {
                                console.log(error + ' :code[' + xhr.status + '] ' + xhr.statusText + ' :: ' + xhr.responseText);
                                app.coa_boxService.viewModel.setWarning(xhr.status, xhr.responseText);
                            }
                        });

                    }
                }
            });
            source.fetch();
        }
        //----------------------------------------- end viewModel -----------------------------------------

    });

    app.updateBadgeService = {
        init: function () {

        },
        show: function () {

        },
        hide: function () {

        },
        viewModel: new updateBadgeViewModel()
    }


})(window);
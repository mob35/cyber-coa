(function (global) {
    var app = global.app = global.app || {};

    callAjaxViewModel = kendo.data.ObservableObject.extend({
        defaultFunction: function () {
        },
        getAjax: function (dataValue, attr) {
            var xx;
            $.ajax({
                beforeSend: app.loginService.viewModel.checkOnline,
                url: app.configService.serviceUrl + attr.serviceName,
                type: "POST",
                data: JSON.stringify(dataValue),
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                success: function (response) {
                    app.application.hideLoading();
                    //console.log(JSON.stringify(response));
                    var tx = "[" + JSON.stringify(response) + "]";
                    response = JSON.parse(tx);
                    console.log(JSON.stringify(response));
                    return response;
                },
                error: function (xhr, error) {
                    app.application.hideLoading();
                    console.log("ajax :: service fail! ::");
                    console.log(xhr.status + ' ' + xhr.statusText + ' :: ' + xhr.responseText);

                    navigator.notification.alert(xhr.status + ' ' + xhr.statusText,
                        function () { }, "Alert!", 'OK');
                }
            });
            
            
        },
        loadAjax: function (dataValue, attr) {
            
            console.log("dataValue ::: " + JSON.stringify(dataValue));
            console.log("attr ::: " + JSON.stringify(attr));
            console.log("isPage ::: " + attr.isPage);
            console.log("autoRead ::: " + attr.autoRead);
            var dataSource = null;
            if (attr.isPage) {
                //    dataSource = new kendo.data.DataSource({
                //    transport: {
                //        read: function (operation) {
                //            $.ajax({
                //                beforeSend: app.loginService.viewModel.checkOnline,
                //                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJob.json',
                //                type: "POST",
                //                data: JSON.stringify(dataValue),
                //                dataType: "json",
                //                contentType: 'application/json; charset=UTF-8',
                //                success: function (response) {
                //                    //alert(JSON.stringify(response.jobs));
                //                    operation.success(response.jobs);
                //                },
                //                error: function (xhr, error) {
                //                    app.application.hideLoading();
                //                    if (!app.ajaxHandlerService.error(xhr, error)) {
                //                        console.log("ajax :: load service fail! ::");
                //                        console.log(xhr);
                //                        console.log(error);

                //                        navigator.notification.alert(xhr.status + ' ' + error,
                //                            function () { }, "Alert!", 'OK');
                //                    }
                //                }
                //            });

                //        }
                //    }
                //    , pageSize: a_pageSize
                //    , page: a_page
                //});
            } else {
                dataSource = new kendo.data.DataSource({
                    transport: {
                        read: function (operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + attr.serviceName,
                                type: "POST",
                                data: JSON.stringify(dataValue),
                                dataType: "json",
                                contentType: 'application/json; charset=UTF-8',
                                success: function (response) {
                                    app.application.hideLoading();
                                    //console.log(JSON.stringify(response));
                                    var tx = "[" + JSON.stringify(response) + "]";
                                    response = JSON.parse(tx);
                                    console.log(JSON.stringify(response));
                                    operation.success(response);
                                },
                                error: function (xhr, error) {
                                    app.application.hideLoading();
                                    console.log("ajax :: service fail! ::");
                                    console.log(xhr);
                                    console.log(error);

                                    navigator.notification.alert(xhr.status + ' ' + error,
                                        function () { }, "Alert!", 'OK');
                                }
                            });

                        }
                    }
                });
                if (attr.autoRead) {
                    dataSource.read();
                    return dataSource;
                } else {
                    return dataSource;
                }
            }
            
        }
        //----------------------------------------- end viewModel -----------------------------------------

    });

    app.callAjaxService = {

        viewModel: new callAjaxViewModel()
    }


})(window);
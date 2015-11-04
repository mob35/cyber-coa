(function (global) {
    var app = global.app = global.app || {};

    coa_inform = kendo.data.ObservableObject.extend({
        dataInform: [],
        dataInformDetail: null,
        SLA: [],
        fontSize: [],
        dataVisible: [],
        dataFileName: [],
        submittedImage: "",
        _pageSize: 10,
        isInform: false,

        defaultFunction: function () {
        },
        createUI: function (e) {
            $("#ul_inform").kendoMobileListView({
                dataSource: this.dataInform,
                template: $("#inform-template").text(),
                filterable: {
                    field: "TEXT_SEARCH_ALL",
                    operator: "contains"
                },
                pullToRefresh: true,
                //loadMore: true,
                click: app.coa_informService.viewModel.informDetail
            });
        },
        setInformViewed: function () {
            app.updateBadgeService.viewModel.setBadge("inform_badge", -1);
            var that = app.coa_informService.viewModel;
            that.dataInformDetail.PROCESSED_ACCESS_TYPE = "MOBILE";
            var dataValue = {
                "SELECTED_ITEM": that.dataInformDetail,
                "TOKEN": localStorage.getItem("TOKEN"),
                "USER_ID": localStorage.getItem("USER_ID"),
                "VERSION": localStorage.getItem("VERSION")
            };

            $.ajax({
                beforeSend: app.loginService.viewModel.checkOnline,
                url: app.configService.serviceUrl + "api/InformViewed",
                type: "POST",
                data: JSON.stringify(dataValue),
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                success: function (response) {
                    app.application.hideLoading();
                    console.log(JSON.stringify(response.RESULTS));
                    if (response.RESPONSE_CODE == "0000") {
                        //that.dataInform.data(response.RESULTS);
                        //operation.success(response.RESULTS);
                    } else {
                        app.coa_boxService.viewModel.setWarning(1, response.RESPONSE_MSG);
                    }
                },
                error: function (xhr, error) {
                    app.application.hideLoading();
                    console.log("ERROR : ajax :: service fail! ::");
                    console.log(xhr.status + ' ' + xhr.statusText + ' :: ' + xhr.responseText);
                    app.coa_boxService.viewModel.setWarning(xhr.status, xhr.responseText);
                }
            });
        },
        checkV: function (fileName) {
            if (fileName != null) {
                return true;
            } else {
                return false
            }
        },
        checkF: function (fileName, id) {
            if (fileName !== null) {
                var arr = fileName.split("/");
                var fName = arr[arr.length - 1];
                if (fName.search(".doc") >= 0) {
                    $("#" + id).attr('src', 'images/icon_doc44.png');
                } else if (fName.search(".pdf") >= 0) {
                    $("#" + id).attr('src', 'images/icon_pdf44.png');
                } else if (fName.search(".xls") >= 0) {
                    $("#" + id).attr('src', 'images/icon_xls44.png');
                } else {
                    $("#" + id).attr('src', 'images/none.png');
                }
                return fName;
            } else {
                return "";
            }
        },
        showDetail: function () {
            var that = app.coa_informService.viewModel;
            if (that.get("dataInformDetail") == null) {
                var that = app.coa_informService.viewModel;
                var dataItem = JSON.parse( localStorage.getItem('dataInformDetail'));
                that.set("dataInformDetail", dataItem);
                that.set("fontSize", {
                    "header": app.coa_settingService.viewModel.fontSize + 6 + "px",
                    "dateTime": app.coa_settingService.viewModel.fontSize - 2 + "px",
                    "detail": app.coa_settingService.viewModel.fontSize + "px"
                });
                console.log(that.get("dataInformDetail"));


                that.set('dataVisible', {
                    file1: that.checkV(dataItem.ATTACHED_FILE_NAME1),
                    file2: that.checkV(dataItem.ATTACHED_FILE_NAME2),
                    file3: that.checkV(dataItem.ATTACHED_FILE_NAME3)
                });
                that.set('dataFileName', {
                    fileName1: that.checkF(dataItem.ATTACHED_FILE_NAME1, "I_FileIcon1"),
                    fileName2: that.checkF(dataItem.ATTACHED_FILE_NAME2, "I_FileIcon2"),
                    fileName3: that.checkF(dataItem.ATTACHED_FILE_NAME3, "I_FileIcon3")
                });

                var start = moment(dataItem.CREATED, "YYYY-MM-DD HH:mm:ss").calendar();
                var end = moment(dataItem.SLA_END_DT, "YYYY-MM-DD HH:mm:ss").calendar();

                that.set("SLA", {
                    "start": start,
                    "end": end
                });

                that.set('submittedImage', app.configService.imageUrl + '' + dataItem.PROFILE_IMAGE_NAME);
                //location = '#tbs-inform';
            }
        },
        informDetail: function (e) {
            var that = app.coa_informService.viewModel;
            var dataItem = e.dataItem;
            if (typeof e.dataItem === "undefined") {
            } else {

                that.set("dataInformDetail", e.dataItem);
                that.set("fontSize", {
                    "header": app.coa_settingService.viewModel.fontSize + 6 + "px",
                    "dateTime": app.coa_settingService.viewModel.fontSize - 2 + "px",
                    "detail": app.coa_settingService.viewModel.fontSize + "px"
                });
                console.log(that.get("dataInformDetail"));
                if (e.dataItem.PROCESSED_FLG != "READ") {
                    that.setInformViewed();// call api/InformViewed
                }

                that.set('dataVisible', {
                    file1: that.checkV(dataItem.ATTACHED_FILE_NAME1),
                    file2: that.checkV(dataItem.ATTACHED_FILE_NAME2),
                    file3: that.checkV(dataItem.ATTACHED_FILE_NAME3)
                });
                that.set('dataFileName', {
                    fileName1: that.checkF(dataItem.ATTACHED_FILE_NAME1, "I_FileIcon1"),
                    fileName2: that.checkF(dataItem.ATTACHED_FILE_NAME2, "I_FileIcon2"),
                    fileName3: that.checkF(dataItem.ATTACHED_FILE_NAME3, "I_FileIcon3")
                });

                var start = moment(e.dataItem.CREATED, "YYYY-MM-DD HH:mm:ss").calendar();
                var end = moment(e.dataItem.SLA_END_DT, "YYYY-MM-DD HH:mm:ss").calendar();

                that.set("SLA", {
                    "start": start,
                    "end": end
                });

                that.set('submittedImage', app.configService.imageUrl + '' + dataItem.PROFILE_IMAGE_NAME);

                localStorage.setItem("dataInformDetail", JSON.stringify(that.get("dataInformDetail")));
                console.log(localStorage.getItem('dataInformDetail'));
                app.application.navigate(
                                    '#inform_detail'
                                );
            }
        },
        onLoadmore: function () {

        },
        loadData: function () {
            app.application.showLoading();
            var that = app.coa_informService.viewModel;

            var dsSort = [];
            //dsSort.push({ field: "PROCESSED_FLG", dir: "desc" });
            //dsSort.push({ field: "SLA_END_DT", dir: "asc" });
            //dsSort.push({ field: "CREATED", dir: "desc" });
            that.dataInform = new kendo.data.DataSource({
                transport: {
                    read: function (operation) {
                        var dataValue = {
                            "TRAN_TYPE": "I",
                            "TOKEN": localStorage.getItem("TOKEN"),
                            "USER_ID": localStorage.getItem("USER_ID"),
                            "VERSION": localStorage.getItem("VERSION")
                        };
                        $.ajax({
                            beforeSend: app.loginService.viewModel.checkOnline,
                            url: app.configService.serviceUrl + "api/GetApprovalTransaction",
                            type: "POST",
                            data: JSON.stringify(dataValue),
                            dataType: "json",
                            contentType: 'application/json; charset=UTF-8',
                            success: function (response) {
                                
                                app.application.hideLoading();
                                console.log(JSON.stringify(response.RESULTS));
                                var countInform = 0;
                                if (response.RESPONSE_CODE == "0000") {
                                    if (response.RESULTS.length <= 0) {
                                        $(".km-filter-form").hide();
                                        $("#div_inform_noItem").show();
                                    } else {
                                        $("#div_inform_noItem").hide();
                                        //$(".km-filter-form").show();
                                    }

                                    $.each(response.RESULTS, function (i, item) {
                                        if (item.PROCESSED_FLG == "WAIT") {
                                            countInform++;
                                        }
                                    });
                                    setTimeout(function () {
                                        app.updateBadgeService.viewModel.setBadge("inform_badge", countInform);
                                    }, 200);

                                    //that.dataInform.data(response.RESULTS);
                                    operation.success(response.RESULTS);
                                } else {
                                    app.coa_boxService.viewModel.setWarning(1, response.RESPONSE_MSG);
                                }
                                //$("#div_inform_scroller").data("kendoMobileScroller").reset();
                                $(".km-filter-form").hide();
                            },
                            error: function (xhr, error) {
                                app.application.hideLoading();
                                console.log("ajax :: service fail! ::");
                                console.log(xhr);
                                console.log(error);
                                app.coa_boxService.viewModel.setWarning(xhr.status, xhr.responseText);
                            }
                        });

                    }
                }
            });
            $("#ul_inform").data("kendoMobileListView").setDataSource(that.dataInform);
        }
        //----------------------------------------- end viewModel -----------------------------------------

    });

    app.coa_informService = {
        init: function () {
            app.coa_informService.viewModel.createUI();

            

            var scroller = $("#div_inform_scroller").data("kendoMobileScroller");
            scroller.bind("scroll", function (e) {
                if (e.scrollTop <= 10) {
                    var total = app.coa_informService.viewModel.dataInform.total();
                    var valSearch = $('#div_inform_scroller').find('input[type=search]').val();
                    console.log('valSearch: ' + valSearch);
                    if (total == 0 && valSearch == "") {
                        $(".km-filter-form").hide();
                    } else {
                        $(".km-filter-form").show();
                    }
                    $("#div_show_noneFilter_inform").hide();
                } else {
                    $(".km-filter-form").hide();
                    $("#div_show_noneFilter_inform").show();

                }
                //console.log(e.scrollTop);
            });
        },
        show: function () {
            $(".km-filter-form").hide();
            $("#div_show_noneFilter_inform").hide();

            var tabstrip = app.application.view().footer.find(".km-tabstrip").data("kendoMobileTabStrip");
            tabstrip.switchTo("#tbs-inform"); //activate "bar" tab
            

            //----------------------------กำหนด ความสูง ทุกครั้งที่เปลี่ยนหน้าจอ 
            window.onresize = function (event) {
                $("#div_inform_scroller").css('height', $(window).height() - 70);
                //$("#mapJob_content").kendoMobileScroller();
            };
            $("#div_inform_scroller").css("height", $(window).height() - 70); // กำหนดค่าเริ่มต้น ความสูง

            

            app.coa_informService.viewModel.loadData();
            app.coa_informService.viewModel.isInform = true;

            


        },
        hide: function () {

        },
        viewModel: new coa_inform()
    }


})(window);
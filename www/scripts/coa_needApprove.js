(function (global) {
    var app = global.app = global.app || {};

    coa_needApprove = kendo.data.ObservableObject.extend({
        priority_select: "",
        dataApproveDetail: null,
        dataApprove: [],
        needApprove_M: [],

        dataVisible: [],
        dataFileName: [],

        fontSize: [],
        SLA: [],
        toUserName: "",
        submittedImage: "",

        txFilter: "",
        maxLengthCheck: function (object) {
            if (object.value.length > object.maxLength)
                object.value = object.value.slice(0, object.maxLength);
        },
        checkNumberOnly: function (e) {
            //console.log(($('#input_amt').val() + "").length);
            if (($('#input_amt').val() + "").length >= 9) {
                e.preventDefault();
                return false;
            }
            var key = e.which || e.keyCode;
            if (!(key >= 48 && key <= 57)) {
                e.preventDefault();
                return false;
            }

            return false;
            //app.coa_needApproveService.viewModel.checkNumberOnly
        },
        createUI: function () {
            console.log('createUI');
            var that = app.coa_needApproveService.viewModel;

            that.needApprove_M = new kendo.data.DataSource({
                transport: {
                    read: function (operation) {
                        //alert('DataSource :: needApprove_M :: reading...');
                        //app.application.showLoading();
                        var dataValue = {
                            "TRAN_TYPE": "N",
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
                                console.log("response.RESULTS :: " + JSON.stringify(response.RESULTS));
                                if (response.RESPONSE_CODE == "0000") {
                                    operation.success(response.RESULTS);

                                    that.dataApprove.data(that.needApprove_M.data());

                                    app.updateBadgeService.viewModel.setBadge("needApprove_badge", that.dataApprove.total());
                                    if (response.RESULTS.length > 0) {
                                        $("#ul_needApprove").show();
                                        app.coa_needApproveService.viewModel.needApprove_setDataSource();

                                        var toUserName_add = "";
                                        if (response.RESULTS[0].TO_USER_LNAME != null)
                                            toUserName_add = response.RESULTS[0].TO_USER_FNAME + " " + response.RESULTS[0].TO_USER_LNAME.substring(0, 1) + ".";
                                        that.set("toUserName", toUserName_add);
                                        //alert(toUserName_add);
                                    } else {
                                        $("#ul_needApprove").hide();
                                        $("#div_needApprove_noItem").show();
                                    }
                                } else {
                                    app.coa_boxService.viewModel.setWarning(1, response.RESPONSE_MSG);
                                }
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
                },
                sort: {
                    field: "SLA_END_DT",
                    dir: "asc"
                }
            });
            $("#ul_needApprove").kendoMobileListView({
                dataSource: that.needApprove_M,
                autoBind: false,
                template: $("#inform-template").text(),
                filterable: {
                    field: "TEXT_SEARCH_ALL",
                    operator: "contains"
                },
                pullToRefresh: true,
                click: app.coa_needApproveService.viewModel.approveDetail
            });
        },
        selectPriority: function (e) {
            var index = this.current().index();
            if (index == 0) index = "";
            if (index == 1) index = "H";
            if (index == 2) index = "M";
            if (index == 3) index = "L";

            app.coa_needApproveService.viewModel.priority_select = index;
            app.coa_needApproveService.viewModel.loadData();
            $("#div_needApprove_scroller").data("kendoMobileScroller").reset();

            app.coa_needApproveService.viewModel.clearSearch();
        },
        clearSearch: function () {
            var listview = $("#ul_needApprove").data('kendoMobileListView');
            listview.dataSource.filter({});
            $('input[type=search]').val('');
        },
        setDataSource_listView: function () {
            //var that = app.coa_needApproveService.viewModel;
            ////$("#ul_needApprove").data("kendoMobileListView").setDataSource(this.dataApprove);
            //if (app.coa_needApproveService.viewModel.dataApprove.total() == 0) {
            //    that.needApprove_M.data([]);
            //} else {
            //    that.needApprove_M.data(that.dataApprove.view());
            //}

        },
        showHide_search: function () {
            var total = app.coa_needApproveService.viewModel.dataApprove.total();
            if (total == 0) {
                $("#ul_needApprove").hide();
                $("#div_needApprove_noItem").show();
                $(".km-filter-form").hide();
            } else {
                $("#ul_needApprove").show();
                $("#div_needApprove_noItem").hide();
                //$(".km-filter-form").show();
            }
        },
        onReasonSelect: function (e) {
            var that = app.coa_needApproveService.viewModel;
            var dataItem = this.dataItem(e.item.index());
            if (dataItem.REASON_CD == "") {
                that.dataApproveDetail.RETURN_REASON_CD = "";
                that.dataApproveDetail.RETURN_REASON_DESC = "";
            } else {
                that.dataApproveDetail.RETURN_REASON_CD = dataItem.REASON_CD;
                that.dataApproveDetail.RETURN_REASON_DESC = dataItem.REASON_DESC;
            }

            console.log("event :: select (" + that.dataApproveDetail.RETURN_REASON_CD + " : " + that.dataApproveDetail.RETURN_REASON_DESC + ")");
            //console.log(e.dataItem);
        },
        onApprove: function () {
            app.coa_boxService.viewModel.hideConfirm();

            
            var that = app.coa_needApproveService.viewModel;

            //reset dropdown
            var dropdownlist = $("#dw_reason").data("kendoDropDownList");

            dropdownlist.select(dropdownlist.ul.children().eq(0));


            that.dataApproveDetail.PROCESSED_FLG = "APPROVED";
            that.dataApproveDetail.PROCESSED_ACCESS_TYPE = "MOBILE";
            that.dataApproveDetail.RETURN_REASON_CD = "";
            that.dataApproveDetail.RETURN_REASON_DESC = "";
            //that.dataApproveDetail.PROCESSED_FLG = "WAIT";

            //if (that.dataApproveDetail.RETURN_AMT > 999999999) {
            //    app.coa_boxService.viewModel.setWarning(1, 'Description #2 is no longer than 9 digits');
            //    return false;
            //}

            app.application.showLoading();
            var dataValue = {
                "SELECTED_ITEM": that.dataApproveDetail,
                "TOKEN": localStorage.getItem("TOKEN"),
                "USER_ID": localStorage.getItem("USER_ID"),
                "VERSION": localStorage.getItem("VERSION")
            };
            console.log(that.dataApproveDetail);
            $.ajax({
                beforeSend: app.loginService.viewModel.checkOnline,
                url: app.configService.serviceUrl + "api/SetApproveResult",
                type: "POST",
                data: JSON.stringify(dataValue),
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                success: function (response) {

                    app.application.hideLoading();
                    console.log(JSON.stringify(response));
                    if (response.RESPONSE_CODE == "0000") {
                        //that.dataInform.data(response.RESULTS);
                        //operation.success(response.RESULTS);
                        app.coa_boxService.viewModel.setComplete('APPROVED :: success');
                        location = "#tbs-needApprove";
                        //if (typeof (navigator.app) !== "undefined") {
                        //    navigator.app.backHistory();
                        //} else {
                        //    window.history.back();
                        //}
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
        onReject: function () {
            app.coa_boxService.viewModel.hideConfirm();
            var that = app.coa_needApproveService.viewModel;
            console.log(that.dataApproveDetail.RETURN_REASON_CD);
            //if (that.dataApproveDetail.RETURN_REASON_CD != null && that.dataApproveDetail.RETURN_REASON_CD != "") {
                app.application.showLoading();
                console.log("send");
                that.dataApproveDetail.PROCESSED_FLG = "REJECTED";
                that.dataApproveDetail.PROCESSED_ACCESS_TYPE = "MOBILE";
                var dataValue = {
                    "SELECTED_ITEM": that.dataApproveDetail,
                    "TOKEN": localStorage.getItem("TOKEN"),
                    "USER_ID": localStorage.getItem("USER_ID"),
                    "VERSION": localStorage.getItem("VERSION")
                };
                console.log(that.dataApproveDetail);
                $.ajax({
                    beforeSend: app.loginService.viewModel.checkOnline,
                    url: app.configService.serviceUrl + "api/SetApproveResult",
                    type: "POST",
                    data: JSON.stringify(dataValue),
                    dataType: "json",
                    contentType: 'application/json; charset=UTF-8',
                    success: function (response) {
                        app.application.hideLoading();
                        console.log(JSON.stringify(response));
                        if (response.RESPONSE_CODE == "0000") {
                            //that.dataInform.data(response.RESULTS);
                            //operation.success(response.RESULTS);
                            app.coa_boxService.viewModel.setComplete('REJECTED :: success');
                            location = "#tbs-needApprove";
                            //if (typeof (navigator.app) !== "undefined") {
                            //    navigator.app.backHistory();
                            //} else {
                            //    window.history.back();
                            //}
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
            //} else {
                //app.coa_boxService.viewModel.setWarning(200,"กรุณาระบุ Reason");
                //console.log("warning");

            //}

        },
        IsJson: function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
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
            var that = app.coa_needApproveService.viewModel;
            if (that.get("dataApproveDetail") == null) {
                var that = app.coa_needApproveService.viewModel;
                var dataItem = JSON.parse(localStorage.getItem('dataApproveDetail'));
                that.set("dataApproveDetail", dataItem);
                that.set("fontSize", {
                    "header": app.coa_settingService.viewModel.fontSize + 6 + "px",
                    "dateTime": app.coa_settingService.viewModel.fontSize - 2 + "px",
                    "detail": app.coa_settingService.viewModel.fontSize + "px"
                });
                console.log(that.get("dataApproveDetail"));


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

                var start = moment(dataItem.SLA_START_DT, "YYYY-MM-DD HH:mm:ss").calendar();
                var end = moment(dataItem.SLA_END_DT, "YYYY-MM-DD HH:mm:ss").calendar();

                that.set("SLA", {
                    "start": start,
                    "end": end
                });
                if (that.IsJson(dataItem.REJECT_REASON_CD)) {
                    dataSource = dataItem.REJECT_REASON_CD;
                } else {
                    dataSource = "[]";
                }
                console.log(dataSource);
                $("#dw_reason").kendoDropDownList({
                    dataTextField: "REASON_DESC",
                    dataValueField: "REASON_CD",
                    dataSource: JSON.parse(dataSource),
                    select: that.onReasonSelect,
                    optionLabel: "Select Reason...",
                    value: '',
                });

                that.set('submittedImage', app.configService.imageUrl + '' + dataItem.PROFILE_IMAGE_NAME);
                //location = '#tbs-inform';
            }
        },
        approveDetail: function (e) {
            var that = app.coa_needApproveService.viewModel;
            var dataItem = e.dataItem;
            var dataSource;
            console.log(dataItem);
            console.log(dataItem.REJECT_REASON_CD);
            //console.log(JSON.parse(dataItem.REJECT_REASON_CD));

            that.set('dataVisible', {
                file1: that.checkV(dataItem.ATTACHED_FILE_NAME1),
                file2: that.checkV(dataItem.ATTACHED_FILE_NAME2),
                file3: that.checkV(dataItem.ATTACHED_FILE_NAME3)
            });
            that.set('dataFileName', {
                fileName1: that.checkF(dataItem.ATTACHED_FILE_NAME1, "N_FileIcon1"),
                fileName2: that.checkF(dataItem.ATTACHED_FILE_NAME2, "N_FileIcon2"),
                fileName3: that.checkF(dataItem.ATTACHED_FILE_NAME3, "N_FileIcon3")
            });


            if (that.IsJson(dataItem.REJECT_REASON_CD)) {
                dataSource = dataItem.REJECT_REASON_CD;
            } else {
                dataSource = "[]";
            }
            console.log(dataSource);
            $("#dw_reason").kendoDropDownList({
                dataTextField: "REASON_DESC",
                dataValueField: "REASON_CD",
                dataSource: JSON.parse(dataSource),
                select: that.onReasonSelect,
                optionLabel: "Select Reason...",
                value: '',
            });


            var start = moment(dataItem.SLA_START_DT, "YYYY-MM-DD HH:mm:ss").calendar();
            var end = moment(dataItem.SLA_END_DT, "YYYY-MM-DD HH:mm:ss").calendar();

            that.set("SLA", {
                "start": start,
                "end": end
            });

            that.set("dataApproveDetail", dataItem);
            that.set("fontSize", {
                "header": app.coa_settingService.viewModel.fontSize + 6 + "px",
                "dateTime": app.coa_settingService.viewModel.fontSize - 2 + "px",
                "detail": app.coa_settingService.viewModel.fontSize + "px"
            });

            that.set('submittedImage', app.configService.imageUrl + '' + dataItem.PROFILE_IMAGE_NAME);
            

            console.log(that.get("dataApproveDetail"));
            localStorage.setItem("dataApproveDetail", JSON.stringify(that.get("dataApproveDetail")));

            location = "#needApprove_detail";
        },
        loadData: function () {
            console.log('loadData');
            app.application.showLoading();
            var that = app.coa_needApproveService.viewModel;
            var dataValue = {
                "TRAN_TYPE": "N",
                "TOKEN": localStorage.getItem("TOKEN"),
                "USER_ID": localStorage.getItem("USER_ID"),
                "VERSION": localStorage.getItem("VERSION")
            };
            that.dataApprove = new kendo.data.DataSource({
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
                                app.application.hideLoading();
                                console.log("loadData :: response.RESULTS :: " + JSON.stringify(response.RESULTS));
                                if (response.RESPONSE_CODE == "0000") {
                                    //that.dataInform.data(response.RESULTS);
                                    operation.success(response.RESULTS);
                                    app.updateBadgeService.viewModel.setBadge("needApprove_badge", that.dataApprove.total());

                                    if (response.RESULTS.length > 0) {
                                        $("#ul_needApprove").show();
                                        app.coa_needApproveService.viewModel.needApprove_setDataSource();

                                        var toUserName_add = "";
                                        if (response.RESULTS[0].TO_USER_LNAME != null)
                                            toUserName_add = response.RESULTS[0].TO_USER_FNAME + " " + response.RESULTS[0].TO_USER_LNAME.substring(0, 1) + ".";
                                        that.set("toUserName", toUserName_add);
                                        //alert(toUserName_add);
                                    } else {
                                        $("#ul_needApprove").hide();
                                        $("#div_needApprove_noItem").show();
                                        $(".km-filter-form").hide();
                                    }
                                } else {
                                    app.coa_boxService.viewModel.setWarning(1, response.RESPONSE_MSG);
                                }
                            },
                            error: function (xhr, error) {
                                app.application.hideLoading();
                                console.log("ajax :: service fail! ::");
                                console.log(error + ' ' + xhr.status + ' ' + xhr.statusText + ' :: ' + xhr.responseText);
                                app.coa_boxService.viewModel.setWarning(xhr.status, xhr.responseText);
                            }
                        });

                    }
                },
                sort: {
                    field: "SLA_END_DT",
                    dir: "asc"
                }
            });
            that.dataApprove.read();
        },
        needApprove_setDataSource: function () {
            var that = app.coa_needApproveService.viewModel;
            if (that.priority_select != null && that.priority_select != "") {
                that.dataApprove.filter(
                    {
                        field: "PRIORITY_FLG",
                        operator: "eq",
                        value: that.priority_select
                    });

                that.needApprove_M.data(that.dataApprove.view());
                console.log(kendo.stringify(that.dataApprove.data()));
                $("#ul_needApprove").data("kendoMobileListView").setDataSource(that.needApprove_M);
            } else {
                console.log(kendo.stringify(that.dataApprove));
                that.needApprove_M.data(that.dataApprove.data());
                console.log(kendo.stringify(that.dataApprove.data()));
                $("#ul_needApprove").data("kendoMobileListView").setDataSource(that.needApprove_M);
            }
            that.showHide_search();
        }
        //----------------------------------------- end viewModel -----------------------------------------
    });

    app.coa_needApproveService = {
        init: function () {
            app.coa_needApproveService.viewModel.createUI();

            var scroller = $("#div_needApprove_scroller").data("kendoMobileScroller");
            scroller.bind("scroll", function (e) {
                
                if (e.scrollTop <= 10) {
                    var total = app.coa_needApproveService.viewModel.dataApprove.total();
                    if (total == 0) {
                        $("#ul_needApprove").hide();
                        $("#div_needApprove_noItem").show();
                        $(".km-filter-form").hide();
                    } else {
                        $("#ul_needApprove").show();
                        $("#div_needApprove_noItem").hide();
                        $(".km-filter-form").show();
                    }

                    $("#div_show_noneFilter_needApprove").hide();
                } else {
                    $(".km-filter-form").hide();
                    $("#div_show_noneFilter_needApprove").show();

                }
                //console.log(e.scrollTop);
            });
            
        },
        show: function () {
            

            $(".km-filter-form").hide();
            $("#div_show_noneFilter_needApprove").hide();

            

            //----------------------------กำหนด ความสูง ทุกครั้งที่เปลี่ยนหน้าจอ 
            window.onresize = function (event) {
                $("#div_needApprove_scroller").css('height', $(window).height() - 140);
                //$("#mapJob_content").kendoMobileScroller();
            };
            $("#div_needApprove_scroller").css("height", $(window).height() - 140); // กำหนดค่าเริ่มต้น ความสูง

            app.updateBadgeService.viewModel.loadData_badgeInform();
            app.coa_needApproveService.viewModel.loadData();
            
            app.coa_needApproveService.viewModel.clearSearch();

            $("#div_needApprove_scroller").data("kendoMobileScroller").reset();

           

            var tabstrip = app.application.view().footer.find(".km-tabstrip").data("kendoMobileTabStrip");
            tabstrip.switchTo("#tbs-needApprove"); //activate "bar" tab

        },
        hide: function () {

        },
        viewModel: new coa_needApprove()
    }


})(window);
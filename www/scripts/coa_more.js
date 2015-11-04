(function (global) {
    var app = global.app = global.app || {};

    coa_moreViewModel = kendo.data.ObservableObject.extend({
        model1: null,
        SUBJECT: "",
        TRAN_TYPE: "",
        TEXT_DISPLAY1 :"",
        PRIORITY_FLG: "",
        SLA_HOUR: 5,
        version: app.configService.version,

        fontSize: [],
        CreateTransaction: function () {
            app.application.showLoading();
            var that = app.coa_moreService.viewModel;
            var sla = moment().format('YYYY/MM/DD HH:mm:ss');;
            var submitted_user_id = "B2",
                fname_sub = "Anan",
                lname_sub = "Saraburi",
                fname_to = "Somsak",
                lname_to = "Pingpong";
            if (localStorage.getItem("USER_ID") == "B2") {
                submitted_user_id = "B1";
                fname_sub = "Somsak";
                lname_sub = "Pingpong";
                fname_to = "Anan";
                lname_to = "Saraburi";
            }
            this.model1 = [{
                text1: ""
            }];
            var dataValue = {
                "SYSTEM_ID": "sys014",
                "REF_ID": ""+Math.random() * (9000 - 1000) + 1000,
                "TRAN_TYPE": that.TRAN_TYPE,
                "SLA_START_DT": sla,
                "SLA_HOUR": that.SLA_HOUR,
                "PRIORITY_FLG": "L",// default = L
                "SUBJECT": that.model1.text1,
                "TEXT_DISPLAY1": that.TEXT_DISPLAY1,
                "TEXT_DISPLAY2": "sample string 9",
                "TEXT_DISPLAY3": "sample string 10",
                "ATTACHED_FILE_NAME1": "xx",
                "ATTACHED_FILE_NAME2": "aa",
                "ATTACHED_FILE_NAME3": "as",
                "TO_USER_ID": localStorage.getItem("USER_ID"),
                "TO_USER_FNAME": fname_to,
                "TO_USER_LNAME": lname_to,
                "SUBMITTED_USER_ID": submitted_user_id,
                "SUBMITTED_USER_FNAME": fname_sub,
                "SUBMITTED_USER_LNAME": lname_sub,
                "REJECT_REASON_CD": "[{ \"REASON_CD\": \"01\", \"REASON_DESC\": \"ข้อมูลไม่ครบ5\" }, { \"REASON_CD\": \"02\", \"REASON_DESC\": \"ผิดเงื่อนไขในสัญญา\" }]"
            };
            $.ajax({
                beforeSend: app.loginService.viewModel.checkOnline,
                url: app.configService.serviceUrl + "api/CreateTransaction",
                type: "POST",
                data: JSON.stringify(dataValue),
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                success: function (response) {
                    app.application.hideLoading();
                    console.log("response.RESULTS :: " + JSON.stringify(response.RESULTS));
                    if (response.RESPONSE_CODE == "0000") {
                        //that.dataInform.data(response.RESULTS);
                        alert("success");
                    } else {
                        app.coa_boxService.viewModel.setWarning(1, response.RESPONSE_MSG);
                    }
                },
                error: function (xhr, error) {
                    alert("error : " + xhr.status);
                    app.application.hideLoading();
                    console.log("ajax :: service fail! ::");
                    console.log(xhr);
                    console.log(error);
                    app.coa_boxService.viewModel.setWarning(xhr.status, xhr.responseText);
                }
            });
        },
        setFontSize: function () {
            var that = app.coa_moreService.viewModel;
            that.set("fontSize", {
                "header": app.coa_settingService.viewModel.fontSize + 6 + "px",
                "dateTime": app.coa_settingService.viewModel.fontSize - 2 + "px",
                "detail": app.coa_settingService.viewModel.fontSize + "px"
            });
        }
        //----------------------------------------- end viewModel -----------------------------------------

    });

    app.coa_moreService = {
        init: function () {

        },
        show: function () {
            var tabstrip = app.application.view().footer.find(".km-tabstrip").data("kendoMobileTabStrip");
            tabstrip.switchTo("#tbs-more"); //activate "bar" tab

            app.coa_moreService.viewModel.setFontSize();

            window.onresize = function (event) {
                $("#div_moreHeight").css('height', $(window).height() - 280);
                //$("#mapJob_content").kendoMobileScroller();
            };
            $("#div_moreHeight").css("height", $(window).height() - 280); // กำหนดค่าเริ่มต้น ความสูง
        },
        hide: function () {

        },
        viewModel: new coa_moreViewModel()
    }


})(window);
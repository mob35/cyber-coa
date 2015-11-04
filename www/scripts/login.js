(function (global) {
    var LoginViewModel,
		app = global.app = global.app || {};


    LoginViewModel = kendo.data.ObservableObject.extend({
        username: "",
        password: "",
        token: "",
        phoneNumber: "",
        connectionType: "...",
        NETWORK_TYPE: "WIFI",
        MOBILE_NO: "",
        OTP: "",
        TOKEN_OTP: "",
        profile: [],

        runCheck: null,

        version: app.configService.version,
        checkToken: function () {
            var token = localStorage.getItem("TOKEN");
            console.log(token);
            if (token != null) {
                //app.application.navigate(
                //                    '#tbs-needApprove'
                //                );
                //location = "#tbs-needApprove";// ถ้าเคย Login แล้ว
            }
        },
        newLogin: function () {
            var that = app.loginService.viewModel;
            that.set("OTP", "");
            that.set("TOKEN_OTP", "");
        },
        logout: function () {
            var that = app.loginService.viewModel;

            app.coa_boxService.viewModel.hideConfirm();

            if (app.coa_informService.viewModel.isInform) {
                $("#div_inform_scroller").data("kendoMobileScroller").reset();
            }

            console.log('logoutOK');

            that.newLogin();
            localStorage.clear();

            app.application.navigate(
                                    '#login'
                                );
            //location.reload();
        },
        onCancelOTP: function () {
            var that = app.loginService.viewModel;
            that.newLogin();
        },
        onNewOTP: function () {
            var that = app.loginService.viewModel;
            that.newLogin();
            that.onLogin();
        },
        onLogin: function () {
            
            var that = app.loginService.viewModel;

            if (that.TOKEN_OTP != "" && that.OTP == "") {
                app.coa_boxService.viewModel.setWarning(1, "OTP is required.");
            } else if (that.username == "") {
                app.coa_boxService.viewModel.setWarning(1, "Username is required.");
            } else if (that.password == "") {
                app.coa_boxService.viewModel.setWarning(1, "Password is required.");
            } else {
                app.application.showLoading();
                var dataValue = {
                    "USERNAME": that.username.toUpperCase(),
                    "PASSWORD": that.password,
                    "NETWORK_TYPE": that.NETWORK_TYPE,
                    "MOBILE_NO": that.MOBILE_NO,
                    "OTP": that.OTP,
                    "TOKEN_OTP": that.TOKEN_OTP,
                    "USER_ID": "",
                    "VERSION": that.version,
                };

                console.log('dataValue:: ' + JSON.stringify(dataValue));
                $.ajax({
                    beforeSend: app.loginService.viewModel.checkOnline,
                    url: app.configService.serviceUrl + "api/Authen",
                    type: "POST",
                    data: JSON.stringify(dataValue),
                    dataType: "json",
                    contentType: 'application/json; charset=UTF-8',
                    success: function (response) {
                        app.application.hideLoading();
                        console.log(JSON.stringify(response));
                        if (response.RESPONSE_CODE == "0000") {
                            if (response.RESULTS.TOKEN_ID == "") {// กรณีต้องกรอก OTP
                                that.TOKEN_OTP = response.RESULTS.TOKEN_OTP;
                                that.set('username', response.RESULTS.USERNAME);
                                that.set('password', response.RESULTS.PASSWORD);
                                app.application.navigate(
                                                '#div_loginOTP'
                                            );
                            } else {
                                localStorage.setItem("uTime", (new Date()).getTime());
                                localStorage.setItem("USERNAME", response.RESULTS.USERNAME);
                                localStorage.setItem("USER_ID", response.RESULTS.USER_ID);
                                localStorage.setItem("TOKEN", response.RESULTS.TOKEN_ID);
                                localStorage.setItem("VERSION", that.version);
                                localStorage.setItem("PROFILE_IMG", app.configService.imageUrl + '' + response.RESULTS.PROFILE_IMAGE);
                                localStorage.setItem("PROFILE_COVER", app.configService.imageUrl + '' + response.RESULTS.PROFILE_COVER);

                                app.application.navigate(
                                                '#tbs-needApprove'
                                            );
                            }
                        } else {
                            app.coa_boxService.viewModel.setWarning(1, response.RESPONSE_MSG);
                        }
                    },
                    error: function (xhr, error) {
                        app.application.hideLoading();
                        console.log("ERROR : ajax :: service fail! ::");
                        console.log(xhr.status + ' ' + xhr.statusText + ' :: ' + xhr.responseText);
                        console.log(xhr);
                        app.coa_boxService.viewModel.setWarning(xhr.status, xhr.responseText);

                    }
                });
            }
        },
        onLogout: function () {
        },
        clearForm: function () {
            var that = this;
            that.set("username", "");
            that.set("password", "");
            that.set("OTP", "");
        },
        checkEnter: function (e) {
            var that = this;
            if (e.keyCode == 13) {
                $(e.target).blur();
                //that.onLogin();
            }
        },
        clearCache: function (userId) {
        },
        checkOnline: function () {
            document.addEventListener('deviceready', function () {
                var networkState = navigator.connection.type;
                var states = {};
                states[Connection.UNKNOWN] = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI] = 'WiFi connection';
                states[Connection.CELL_2G] = 'Cell 2G connection';
                states[Connection.CELL_3G] = 'Cell 3G connection';
                states[Connection.CELL_4G] = 'Cell 4G connection';
                states[Connection.NONE] = 'No network connection';
                states[Connection.CELLULAR] = 'CELLULAR connection';

                if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
                    app.application.hideLoading();
                    //alert('Offline mode.');
                    //return false;
                    console.log('Connection type: ' + networkState);
                } else {
                    console.log('Connection type: ' + networkState);
                }
            });

            setTimeout(function () {
                $('input[type="search"]').attr('maxlength', '100');
                $('.km-badge').css('font-size', '12px');
            }, 2000);

        },
        onBackKeyDown: function (e) {
            //if (app.application.view().id == "#login") {
            //navigator.notification.confirm(
            //	'Exit Application!', // message

            //	function (buttonIndex) {
            //	    if (buttonIndex == 2) {
            //	        navigator.app.exitApp();
            //	    }
            //	}, // callback to invoke with index of button pressed
            //	'TTSM', // title
            //	'Cancel,Exit' // buttonLabels
            //);
            //}
            e.preventDefault();
            //else {
            //    e.preventDefault();
            //}
        },
        setTmp: function () {
            // ferdinandr
            var that = this;
            that.set("username", ""),
			that.set("password", "");
            that.set("OTP", "");

            that.set("version", that.version);
        },
        checkConnection: function () {
            var that = app.loginService.viewModel;
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.NONE] = 'No network connection';
            if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
                that.set("connectionType", 'Offline mode.');
            } else {
                if (networkState == Connection.WIFI) {
                    that.NETWORK_TYPE = "WIFI";
                } else {
                    that.NETWORK_TYPE = "3G";
                }
                that.set("connectionType", networkState);
            }
            //console.log('connectionType :: ' + networkState);

            
        }
        /*-------------------------------------------------end viewModel----------------*/
    });

    app.loginService = {
        viewModel: new LoginViewModel(),
        init: function () {
            // document.addEventListener('deviceready', function () {
            //     app.loginService.viewModel.runCheck = setInterval(function () {
            //         app.loginService.viewModel.checkConnection();
            //     }, 1000);
            // });

            //app.loginService.viewModel.setTmp();
            console.log('loading Login');
            //app.loginService.viewModel.checkToken();
        },
        show: function () {
            var that = app.loginService.viewModel;
            that.set('OTP', '');
            that.set("connectionType", '');
        },
        hide: function () {
            clearInterval(app.loginService.viewModel.runCheck);
        },
    };
})(window);

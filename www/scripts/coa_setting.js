(function (global) {
    var app = global.app = global.app || {};

    coa_settingViewModel = kendo.data.ObservableObject.extend({
        imageClick: "",
        imageSrc_cover: "",
        imageSrc_user: "",
        newImage: "",
        to_userName: "",
        fontSize: 16,
        fontSize_demo: "16px",
        fontSize_time: "",
        selectFont: function () {
            var that = app.coa_settingService.viewModel;
            var index = this.current().index();
            var fontSize;

            if (index == 0) fontSize = 14;
            if (index == 1) fontSize = 16;
            if (index == 2) fontSize = 18;
            that.set("fontSize", fontSize);
            that.set("fontSize_demo", fontSize + "px");
        },
        selectMax: 100,
        loadData: function () {
            var times = (new Date()).getTime();
            this.set("to_userName", localStorage.getItem("USERNAME"));
            this.set("imageSrc_cover", localStorage.getItem("PROFILE_COVER") + "?" + times);
            this.set("imageSrc_user", localStorage.getItem("PROFILE_IMG") + "?" + times);
            localStorage.setItem("PROFILE_COVER", localStorage.getItem("PROFILE_COVER") + "?" + times);
            localStorage.setItem("PROFILE_IMG", localStorage.getItem("PROFILE_IMG") + "?" + times);
            console.log(this.imageSrc_cover);
            console.log(this.imageSrc_user);
        },
        onSuccess: function (imageURI) {
            var that = app.coa_settingService.viewModel;
            var options = new FileUploadOptions();
            that.newImage = imageURI;

            options.fileKey = "file";
            if (that.imageClick == "PHOTO") {
                options.fileName = localStorage.getItem("USER_ID") + '.png';
            } else {
                options.fileName = localStorage.getItem("USER_ID") + '_cover.png';
            }
            options.mimeType = "text/plain";
            options.httpMethod = "POST";

            var params = new Object();
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(imageURI, encodeURI(app.configService.serviceUrl + "api/FileUpload"), that.win, that.fail, options);
        },
        onFail: function (message) {
            app.application.hideLoading();
            if (message != "Selection cancelled.") {
                alert('Failed because: ' + message);
            }
        },
        onChooseLibrary: function (e) {
            var that = app.coa_settingService.viewModel;
            var img = e.context;
            that.set('imageClick', img);
            //alert('Choose ' + img + ' from Library');
            app.application.showLoading();
            navigator.camera.getPicture(that.onSuccess, that.onFail, {
                quality: 10,
                //targetWidth: 100,
                //targetHeight: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
        },

        uploadPhoto: function (imageURI) {

        },

        win: function (r) {
            var that = app.coa_settingService.viewModel;
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            app.application.hideLoading();
            app.coa_boxService.viewModel.setComplete('success');

            if (that.imageClick == "PHOTO") {
                //var newN = that.newImage;
                var newN = app.configService.imageUrl + '/usr/user_image/' + localStorage.getItem("USER_ID") + '.png?' + (new Date()).getTime();
                that.set("imageSrc_user", newN);
                localStorage.setItem("PROFILE_IMG", newN);
                console.log('newN: ' + newN);
            } else {
                //var newN = that.newImage;
                var newN = app.configService.imageUrl + '/usr/user_image/' + localStorage.getItem("USER_ID") + '_cover.png?' + (new Date()).getTime();
                that.set("imageSrc_cover", newN);
                localStorage.setItem("PROFILE_COVER", newN);
                console.log('newN: ' + newN);
            }
        },

        fail: function (error) {
            app.application.hideLoading();
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        },
        onDelete: function (e) {
            var that = app.coa_settingService.viewModel;
            var pType = "";
            if (e.context == "PHOTO") {
                pType = "IMAGE";
            } else {
                pType = "COVER";
            }
            //call service setDefault_image
            var dataValue = {
                "DELETE_TYPE": pType,
                "TOKEN": localStorage.getItem("TOKEN"),
                "USER_ID": localStorage.getItem("USER_ID"),
                "VERSION": localStorage.getItem("VERSION")
            };
            $.ajax({
                beforeSend: app.loginService.viewModel.checkOnline,
                url: app.configService.serviceUrl + "api/SetDefaultImage",
                type: "POST",
                data: JSON.stringify(dataValue),
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                success: function (response) {
                    if (response.RESPONSE_CODE == "0000") {
                        if (e.context == "PHOTO") {
                            var url = app.configService.defaultImage_url +  'user_image.png';
                            that.set("imageSrc_user", url);
                            localStorage.setItem("PROFILE_IMG", url);
                        } else {
                            var url = app.configService.defaultImage_url + 'cover_image.png';
                            that.set("imageSrc_cover", url);
                            localStorage.setItem("PROFILE_COVER", url);
                        }
                        app.coa_boxService.viewModel.setComplete('success');
                    
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
        //----------------------------------------- end viewModel -----------------------------------------

    });

    app.coa_settingService = {
        init: function () {

        },
        show: function () {
            app.coa_settingService.viewModel.set("fontSize_demo", 16 + "px");
            app.coa_settingService.viewModel.loadData();
        },
        hide: function () {

        },
        viewModel: new coa_settingViewModel()
    }


})(window);
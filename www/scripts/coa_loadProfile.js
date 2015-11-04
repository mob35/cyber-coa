(function (global) {
    var app = global.app = global.app || {};

    coa_loadProfileViewModel = kendo.data.ObservableObject.extend({
        loadData: function () {

        },
        openFile: function (fileId, view) {
            var dataDetail = null;
            if (view == "N") {
                dataDetail = app.coa_needApproveService.viewModel.get('dataApproveDetail');
            }
            if (view == "I") {
                dataDetail = app.coa_informService.viewModel.get('dataInformDetail');
            }
            if (view == "H") {
                dataDetail = app.coa_historyService.viewModel.get('dataHistoryDetail');
            }

            console.log('os version:' + localStorage.getItem("OS"));
            if (localStorage.getItem("OS") == "ios") {
                if (fileId == "1") {
                    window.open(dataDetail.ATTACHED_FILE_NAME1, '_blank', 'location=no,EnableViewPortScale=yes');
                }
                if (fileId == "2") {
                    window.open(dataDetail.ATTACHED_FILE_NAME2, '_blank', 'location=no,EnableViewPortScale=yes');
                }
                if (fileId == "3") {
                    window.open(dataDetail.ATTACHED_FILE_NAME3, '_blank', 'location=no,EnableViewPortScale=yes');
                }
            } else {
                if (fileId == "1") {
                    window.open(dataDetail.ATTACHED_FILE_NAME1, '_system', 'location=no,EnableViewPortScale=yes');
                }
                if (fileId == "2") {
                    window.open(dataDetail.ATTACHED_FILE_NAME2, '_system', 'location=no,EnableViewPortScale=yes');
                }
                if (fileId == "3") {
                    window.open(dataDetail.ATTACHED_FILE_NAME3, '_system', 'location=no,EnableViewPortScale=yes');
                }
            }
            
        },
        setVisible: function (fileId, view) {
            return false;
        }
        //----------------------------------------- end viewModel -----------------------------------------

    });

    app.coa_loadProfileService = {
        init: function () {

        },
        show: function () {
            app.coa_loadProfileService.viewModel.loadData();
        },
        hide: function () {

        },
        viewModel: new coa_loadProfileViewModel()
    }


})(window);
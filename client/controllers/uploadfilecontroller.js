// uploadFileController
TopApp.controller('uploadFileController', function ($scope, $location, userFactory, messageFactory) {
	  //console.log("uploadFileController");
	  $scope.sessionProgress = false;

	  $scope.uploadBtnClick = function () {
        var files = $('#upload-input').get(0).files;
        if (files.length > 0){
            // One or more files selected, process the file upload
            $('#uploadText').css('visibility', 'visible');
            $('#uploadProgress').css('visibility', 'visible');
            console.log("making messageFactory call");
            messageFactory.uploadFiles(files, function () {
                console.log("files uploaded successfully");
                $('#uploadText').css('visibility', 'visible');
                $('#uploadProgress').css('visibility', 'visible');
                $('#fileUploadBtn').css('visibility', 'hidden');
                $('#sendUploadBtn').css('visibility', 'hidden');
                $('#fileMessage').css('visibility', 'hidden');

            });
        } else {
            console.log("no files selected.");
        }
	  };

    $('#upload-input').on('change', function(){
        var files = $(this).get(0).files;
        if (files.length > 0){
            $('#fileMessage').html(files.length + " file(s) are selected. Press SEND to upload files.")
        }

    });
    var checkSession = function () {
  		userFactory.sessionState( function (data) {
  			$scope.currentSession = data;
  			if ( $scope.currentSession.name == undefined ) {
  				// no user logged in
  				userFactory.inSession(function (response) {
  					$scope.currentSession = response;
  					if ($scope.currentSession.name == undefined) {
  						// reroute to HOME
  						//console.log("no user logged in.");
  						location.replace("/");
  					}
  					//console.log("uploadFileController->",$scope.sessionProgress,$scope.currentSession.name);
  				});
  			}
  			$scope.sessionProgress = true;
  		})
  	};
	  checkSession();
});

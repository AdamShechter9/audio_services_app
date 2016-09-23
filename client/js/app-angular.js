// Angular Application
// Warp9 Mixing and Mastering Services
// adam.s.develop@gmail.com

var TopApp = angular.module('TopApp', ['ui.materialize', 'ngRoute']);

var ADMIN = "warp9mixmaster@gmail.com";
var ADMINTITLE = "Warp9 Audio";


// -----------------------------------------------------------------
// CONFIG
TopApp.config( function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: "/partials/home.html"
		})
		.when('/about', {
			templateUrl: "/partials/about.html"
		})
		.when('/contact', {
			templateUrl: "/partials/contact.html"
		})
		.when('/uploadfile', {
			templateUrl: "/partials/uploadfile.html"
		})
		.when('/inbox', {
			templateUrl: "/partials/inbox.html"
		})
		.when('/usersboards', {
			templateUrl: "/partials/usersboards.html"
		})
		.otherwise({
			redirectTo: "/"
		});
})
// -----------------------------------------------------------------
// DIRECTIVES
TopApp.directive('navBar', function() {
	var directive = {
		restrict: 'E',
		scope: false,
		templateUrl: 'partials/navbar.html'
	};
	return directive;
})

// -----------------------------------------------------------------
// FACTORIES
// -----------------------------------------------------------------
// userFactory
TopApp.factory('userFactory', function ($http) {
	var factory = {};
	var sessionUser = {};

	factory.sessionState = function (callback) {
		//console.log("sessionState Check", sessionUser);
		callback (sessionUser);
	}

	factory.inSession = function (callback) {
		//console.log("inSession check");
		$http.get('/users/current').then(function(data) {
			//console.log(data);
			if (data.data.hasOwnProperty('error')) {
				//console.log(data.data.error);
				callback(data.data.error);
			} else {
				sessionUser = data.data.user;
				if (sessionUser.email === ADMIN) {
					sessionUser.name = ADMINTITLE;
				}
				callback(sessionUser);
			}
		})
	};

	factory.getAllUsers = function (callback) {
		//console.log("getAllUsers");
		$http.get('/users/admin').then(function(data) {
			//console.log("getAllUsers callback", data);
			if (data.data.hasOwnProperty('error')) {
				//console.log(data.data.error);
				callback(data.data.error);
			} else {
				if (sessionUser.email === ADMIN) {
					callback(data.data.users);
				}
			}
		})
	};

	factory.deleteUser = function (user, callback) {
		//console.log("deleteUser", user);
		$http.post('users/admin/remove', user).then(function(data) {
			if (data.data.hasOwnProperty('error')) {
				//console.log(data.data.error);
				callback(data.data.error);
			} else {
				callback();
			}
		})
	};

	factory.createUser = function (newUser, callback) {
		//console.log("createUser->",newUser);
		$http.get('/users/check/'+newUser.email).then(function(data) {
			if (data.data.result === "not found") {
				$http.post('/users/register', newUser).then(function(data) {
					//console.log("createUser->post->callback", data);
					if (data.data.hasOwnProperty('error')) {
						callback(data.data.error);
					} else {
						sessionUser = data.data.sessionuser;
						callback("success");
					}
				})
			} else if (data.data.result === "found"){
				callback("user exists");
			}	
		})
	};
	factory.loginUser = function (user, callback) {
		//console.log("loginUser", user);
		$http.post('/users/login', user).then(function(data) {
			//sign in user
			//console.log("loginUser->post->callback", data);
			if (data.data.hasOwnProperty('error')) {
				callback(data.data.error);
			} else {
				sessionUser = data.sessionuser;
				callback("success");
			}
		})
	};
	factory.logoutUser = function (user, callback) {
		//console.log("logoutUser", user);
		$http.get('/users/logout').then(function(data) {
			if (data.hasOwnProperty('error')) {
				callback(data.error);
			} else {
				sessionUser = {};
				callback("success");
			}
		})
	};
	return factory;
});
// -----------------------------------------------------------------
// messageFactory
TopApp.factory('messageFactory', function ($http) {
	var factory = {};
	var messages = {};


	factory.getMessages = function (callback) {
		//console.log("messageFactory->getMessages");
		$http.get('/messages').then(function(data) {
			//console.log("getMessages response", data.data);
			if (data.data.hasOwnProperty('error')) {
				callback(data.data);
			} else {
				messages = data.data.messages;
				callback(messages);
			}
		})
	};

	factory.markRead = function (message, callback) {
		//console.log("markRead");
		$http.post('/messages/read', message).then(function(data) {
			//console.log("markRead response", data.data);
			if (data.data.hasOwnProperty('error')) {
				callback(data.data);
			} else {
				callback();
			}
		})
	};

	factory.markArchived = function (message, callback) {
		//console.log("markArchived", message);
		$http.post('/messages/archive', message).then(function(data) {
			//console.log("markArchived response", data.data);
			if (data.data.hasOwnProperty('error')) {
				callback(data.data);
			} else {
				callback();
			}
		})
	};

	factory.getAllMessages = function (callback) {
		//console.log("messageFactory->getMessages");
		$http.get('/messages/admin').then(function(data) {
			//console.log("getMessages response", data.data);
			if (data.data.hasOwnProperty('error')) {
				callback(data.data);
			} else {
				messages = data.data.messages;
				callback(messages);
			}
		})
	};

	factory.createMessage = function (message, callback) {
		//console.log("messageFactory->createMessage", message);
		$http.post('/messages/send', message).then(function(data) {
			if (data.data.hasOwnProperty('error')) {
				callback(data.data);
			} else {
				callback();
			}
		})
	};

	factory.uploadFiles = function (files, callback) {

        // One or more files selected, process the file upload
        //console.log("in uploadFiles messagefactory");
        var formData1 = new FormData();

        for (var i = 0; i < files.length; i += 1) {
            var file = files[i];
            // console.log(file);
            // add the files to formData object for the data payload
            formData1.append('uploads', file, file.name);
        }
        //console.log("messageFactory->uploadFiles ajax call");
        $.ajax({
            url: '/uploads',
            type: 'POST',
            data: formData1,
            processData: false,
            contentType: false,
            success: function(data){
                //console.log('upload successful!');
                callback();
            },
            xhr: function() {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function(evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('#uploadText').text(percentComplete + '% done');
                        $('#uploadProgressBar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('#uploadText').html('All Done! Message has been sent to admin');
                        }

                    }

                }, false);

                return xhr;
            }
        });

    };

	return factory;
});


// -----------------------------------------------------------------
// CONTROLLERS
// registerController
TopApp.controller('registerController', function ($scope, userFactory) {
	//console.log("registerController");

	$scope.registerUser = function () {
		var inputValid = true;
		if (($scope.password != undefined)&&($scope.password != $scope.password_confirm)) {
			inputValid = false;
		}
		if ($scope.first_name === undefined || $scope.last_name === undefined || $scope.email === undefined) {
			inputValid = false;
		} else if ($scope.first_name.length < 2 || $scope.last_name.length < 2) {
			inputValid = false;
		}
		if (inputValid) {
			var user = {
				first_name: $scope.first_name,
				last_name: $scope.last_name,
				email: $scope.email,
				password: $scope.password
			};
			userFactory.createUser(user, function (response) {
				if (response == "success") {
					// created user
					//console.log("successfully created user!");
					// reload page?
					$('#modal2').closeModal();
					location.reload();
				} else {
					Materialize.toast('User exists!', 6000);
				} 
			});
		} else {
			Materialize.toast('Error in form input!', 6000);
		}
	}
});
// -----------------------------------------------------------------
// loginController
TopApp.controller('loginController', function ($scope, userFactory, $location) {
	//console.log("loginController");
	
	$scope.loginUser = function () {
		var user = {
			email: $scope.email,
			password: $scope.password
		};
		//console.log("loginController", user);
		userFactory.loginUser(user, function (response) {
			if (response === "success") {
				// logged in user
				//console.log("successfully logged in user!");
				$('#modal1').closeModal();
				location.reload();
			} else {
				Materialize.toast(response, 6000);
			} 
		})	
	}
});
// -----------------------------------------------------------------
// navbarController
TopApp.controller('navbarController', function ($scope, userFactory) {
	$scope.sessionProgress = false;
	$scope.sessionAdmin = false;

	var checkSession = function () {
		userFactory.sessionState( function (data) {
			$scope.currentSession = data;
			if ( $scope.currentSession.name == undefined ) {
				// no user logged in
				userFactory.inSession(function (response) {
					$scope.currentSession = response;
					if ($scope.currentSession.name != undefined) {
						$scope.sessionProgress = true;
						if ($scope.currentSession.email === ADMIN) {
							$scope.sessionAdmin = true;
						}
					}
					//console.log("navbarController->",$scope.sessionProgress,$scope.currentSession.name);
				});
			}
		})
	};
	checkSession();
});
// -----------------------------------------------------------------
// contactFormController
TopApp.controller('contactFormController', function ($scope, messageFactory) {
	$scope.contact = {};
	//console.log("contactFormController");

	$scope.sendContactMessage = function () {
		if ($scope.contact.title != undefined && $scope.contact.title != "") {
			if ($scope.contact.text != undefined && $scope.contact.text != "") {
				if ($scope.contact.text.length > 3) {
					var newMessage = {};
					newMessage.title = "WEBSITE CONTACT FORM: " + $scope.contact.title;
					newMessage.text = "From " + $scope.contact.email + "\n" + $scope.contact.text;
					newMessage.name = $scope.contact.first_name + " " + $scope.contact.last_name;
					newMessage.email = $scope.contact.email;
					newMessage.userid = "contactForm";
					newMessage.to = ADMINTITLE;
					//console.log(newMessage);
					messageFactory.createMessage(newMessage, function (){
					});
					$scope.contact = {};
					Materialize.toast('Contact Message Sent!', 6000);
				} else {
					Materialize.toast('Message needs to be longer', 6000);
				}
			} else {
				Materialize.toast('Missing Body Text', 6000);
			}
		} else {
			Materialize.toast('Missing Title', 6000);
		}
	}

});
// -----------------------------------------------------------------
// uploadFileController
TopApp.controller('uploadFileController', function ($scope, $location, userFactory, messageFactory) {
	//console.log("uploadFileController");
	$scope.sessionProgress = false;

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

	$scope.uploadBtnClick = function () {
        var files = $('#upload-input').get(0).files;
        if (files.length > 0){
            // One or more files selected, process the file upload
            $('#uploadText').css('visibility', 'visible');
            $('#uploadProgress').css('visibility', 'visible');
            //console.log("making messageFactory call");
            messageFactory.uploadFiles(files, function () {
                //console.log("files uploaded successfully");
                $('#uploadText').css('visibility', 'visible');
                $('#uploadProgress').css('visibility', 'visible');
                $('#fileUploadBtn').css('visibility', 'hidden');
                $('#sendUploadBtn').css('visibility', 'hidden');
                $('#fileMessage').css('visibility', 'hidden');

            });
        }
	};

    $('#upload-input').on('change', function(){
        var files = $(this).get(0).files;
        if (files.length > 0){
            $('#fileMessage').html(files.length + " file(s) are selected. Press SEND to upload files.");
        } else {
            $('#fileMessage').html("no files selected.");
        }

    });

	checkSession();
});
// -----------------------------------------------------------------
// messageController
TopApp.controller('messageController', function ($scope, $location, userFactory, messageFactory) {
	$scope.messages = [];
	$scope.adminTitle = ADMINTITLE;
	//console.log("messageController");
	$scope.sessionProgress = false;

	function getInboxMessages () {
		if ($scope.currentSession.email === ADMIN) {
			// admin logged in
			//console.log("admin logged in. get all messages.")
			messageFactory.getAllMessages(function (data) {
				if (!(data.hasOwnProperty('error'))) {
					//console.log("getInboxMessages->data", data);
					$scope.messages = data;
					//console.log($scope.messages)
				}
			})
		} else {
			messageFactory.getMessages(function (data) {
				if (!(data.hasOwnProperty('error'))) {
					//console.log("getInboxMessages->data", data);
					$scope.messages = data;
					//console.log($scope.messages)
				}
			})
		}
	}
	$scope.readMessage = function (message) {
        $scope.allowedReply = (message.name != $scope.currentSession.name);

		//console.log("readMessage", message);
		$scope.readMessage.from = message.name;
		$scope.readMessage.to = message.to;
		$scope.readMessage.date = message.createdAt;
		$scope.readMessage.text = message.text;
		$scope.readMessage.title = message.title;
		$scope.readMessage.userid = message.userid;
		$scope.readMessage.email = message.email;
		$scope.readMessage._id = message._id;
		$("#messageModal").openModal();
		if ($scope.currentSession.email !== ADMIN) {
			messageFactory.markRead(message, function () {
				getInboxMessages();
			})
		}
	};
	$scope.markArchived = function () {
		if ($scope.currentSession.email !== ADMIN) {
			var message = {};
			message._id = $scope.readMessage._id;
			messageFactory.markArchived(message, function () {
				getInboxMessages();
			})
		}
	};
	$scope.newMessage = function () {
		if ($scope.title != undefined && $scope.title != "") {
			if ($scope.new_text != undefined && $scope.new_text != "") {
				if ($scope.new_text.length > 3) {
					var newMessage = {};
					newMessage.title = $scope.title;
					newMessage.text = $scope.new_text;
					newMessage.name = $scope.currentSession.name;
					newMessage.email = $scope.currentSession.email;
					newMessage.userid = $scope.currentSession.userid;
					if ($scope.currentSession.email !== ADMIN) {
						newMessage.to = ADMINTITLE;
					}
					//console.log(newMessage);
					messageFactory.createMessage(newMessage, function (){
						getInboxMessages();
					});
					$scope.title = "";
					$scope.new_text = "";
				} else {
					Materialize.toast('Message needs to be longer', 6000);
				}
			} else {
				Materialize.toast('Missing Body Text', 6000);
			}	
		} else {
			Materialize.toast('Missing Title', 6000);
		}
	};
	$scope.messageReplyClick = function () {
		$scope.replyMessage = {};
		//console.log("messageReplyClick");
		//console.log($scope.readMessage.from);
		//console.log($scope.readMessage.to);
		$scope.replyMessage.to = $scope.readMessage.from;
		$scope.replyMessage.from = $scope.readMessage.to;
		$scope.replyMessage.text = "\n-----------------------\nPrevious Message:\n" +
									$scope.readMessage.text;
		$scope.replyMessage.title = "re: " +  $scope.readMessage.title;
		$scope.replyMessage.userid = $scope.readMessage.userid;
		$scope.replyMessage.email = $scope.readMessage.email;
		$('#reply_text').trigger('autoresize');
		$('#messageReplyModal').openModal();
	};
	$scope.newReplyMessage = function () {
		if ($scope.replyMessage.title != undefined && $scope.replyMessage.title != "") {
			if ($scope.replyMessage.text != undefined && $scope.replyMessage.text != "") {
				if ($scope.replyMessage.text.length > 3) {
					var newMessage = {};
					newMessage.title = $scope.replyMessage.title;
					newMessage.text = $scope.replyMessage.text;
					newMessage.name = $scope.replyMessage.from;
					newMessage.to = $scope.replyMessage.to;
					newMessage.email = $scope.replyMessage.email;
					newMessage.userid = $scope.replyMessage.userid;
					//console.log("newReplyMessage",newMessage);
					messageFactory.createMessage(newMessage, function (){
						setTimeout(function () {
							getInboxMessages();
						}, 1000);
						
					})
				} else {
					Materialize.toast('Message needs to be longer', 6000);
				}
			} else {
				Materialize.toast('Missing Body Text', 6000);
			}	
		} else {
			Materialize.toast('Missing Title', 6000);
		}
	};
	function checkSession () {
		userFactory.sessionState( function (data) {
			$scope.currentSession = data;
			if ( ($scope.currentSession.name == undefined) ) {
				// no user logged in
				//console.log("no user logged in");
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
			getInboxMessages();
		})
	}
	checkSession();
});
// -----------------------------------------------------------------
// settingsController
TopApp.controller('settingsController', function ($scope, userFactory) {
	//console.log("settingsController");
	function checkSession () {
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
	}
	checkSession();
});
// -----------------------------------------------------------------
// usersController
TopApp.controller('usersController', function ($scope, userFactory, messageFactory) {
	$scope.users = [];
	$scope.messageUser = {};

	//console.log("usersController");

	$scope.sessionProgress = false;

	var getAllUsers = function () {
		userFactory.getAllUsers(function (data) {
			//console.log("usersController=>getAllUsers->",data);
			$scope.users = data;
		});
	};
	$scope.deleteUser = function (user) {
		//console.log("deleteUser", user);
		if (user.email === ADMIN) {
			alert("can't delete administrator!");
		} else {
			var confirmed = confirm("this can't be undone!");
			if (confirmed) {
				userFactory.deleteUser(user, function(data) {
					if (data) {
						//console.log("error", data);
					} else {
						getAllUsers();
					}
					
				})
			}
		}
	};
	$scope.messageUserNew = function (user) {
		$scope.messageUser.from = ADMINTITLE;
		$scope.messageUser.name = user.first_name + " " + user.last_name;
		$scope.messageUser.userid = user.userid;
		$scope.messageUser.email = user.email;
		$("#messageNewModal").openModal();
	};

	$scope.newMessage = function () {
		if ($scope.title != undefined && $scope.title != "") {
			if ($scope.new_text != undefined && $scope.new_text != "") {
				if ($scope.new_text.length > 3) {
					var newMessage = {};
					newMessage.title = $scope.title;
					newMessage.text = $scope.new_text;
					newMessage.name = ADMINTITLE;
					newMessage.email = $scope.messageUser.email;
					newMessage.userid = $scope.messageUser.userid;
					newMessage.to = $scope.messageUser.name;
					//console.log(newMessage);
					messageFactory.createMessage(newMessage, function (){
					});
					$scope.title = "";
					$scope.new_text = "";
				} else {
					Materialize.toast('Message needs to be longer', 6000);
				}
			} else {
				Materialize.toast('Missing Body Text', 6000);
			}	
		} else {
			Materialize.toast('Missing Title', 6000);
		}
	}
	function checkSession () {
		userFactory.sessionState( function (data) {
			$scope.currentSession = data;
			if ( $scope.currentSession.name == undefined ) {
				// no user logged in
				userFactory.inSession(function (response) {
					$scope.currentSession = response;
					if ($scope.currentSession.name == undefined || $scope.currentSession.email != ADMIN) {
						// reroute to HOME
						//console.log("no user logged in.");
						location.replace("/");
					}
					//console.log("uploadFileController->",$scope.sessionProgress,$scope.currentSession.name);
				});
			} else if ($scope.currentSession.email != ADMIN) {
				//console.log("no user logged in.");
				location.replace("/");
			}
			$scope.sessionProgress = true;
			getAllUsers();
		})
	}
	checkSession();
});

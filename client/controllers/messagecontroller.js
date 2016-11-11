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

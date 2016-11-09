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

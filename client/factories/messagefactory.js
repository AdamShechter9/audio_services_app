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
        console.log("in uploadFiles messagefactory");
        var formData1 = new FormData();

        for (var i = 0; i < files.length; i += 1) {
            var file = files[i];
            // console.log(file);
            // add the files to formData object for the data payload
            formData1.append('uploads', file, file.name);
        }
        console.log("messageFactory->uploadFiles ajax call");
        $.ajax({
            url: '/uploads',
            type: 'POST',
            data: formData1,
            processData: false,
            contentType: false,
            success: function(data){
                console.log('upload successful!');
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

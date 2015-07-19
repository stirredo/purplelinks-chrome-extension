$(document).ready(function () {

        $('#login').submit(function (e) {
            var form = $(this);
            $.ajax('http://del.dev/login', {
                'dataType': 'json',
                'accepts': {
                    json: 'application/json'
                },
                'method': "POST",
                'context': form,
                'data': $(this).serialize(),
                'success': function (response) {
                    console.log(response);
                    if (response == true) {
                        location.reload();
                    } else {
                        $('.message').text("Couldn't login. Try again.")
                    }
                },
                'error': function (jqXHR, textStatus, errorThrown) {
                    $('.loginFormMessage').text('There was an error: ' + errorThrown);
                }
            });
            e.preventDefault();
        });

        $('#bookmarkForm').submit(function(e) {
            var submitURL = $(this).attr('action');
            var form = this;
            var $message = $('.message');
            $.ajax(submitURL, {
                method: 'POST',
                context: form,
                data: $(this).serialize(),
                dataType: 'json',
                accepts: {
                    'json': 'application/json'
                },
                success: function(response) {
                    if (response.result == true) {
                        console.log(response);
                        $message.text('Bookmark added successfully.');
                        $message.addClass('success');
                        $message.removeClass('hide');
                        $('#addBookmarkForm').addClass('hide');

                    } else {
                        $message.text('There was an error: ' + response.reason);
                    }

                },
                error: function(xhr, status, error) {
                    $message.text("Couldn't add bookmark: " + error);
                    $message.addClass('error');
                }




            });

            e.preventDefault();
        });

        function checkLogin() {
            var ajaxSettings = {
                url: 'http://del.dev/login/check',
                method: 'get',

            };

            return $.ajax(ajaxSettings);


        }

        function getTabDetails() {
            var tab = {};

            var query = {active: true, currentWindow: true};
            chrome.tabs.query(query, function (tabs) {
                var currentTab = tabs[0];
                tab.title = currentTab.title;
                tab.url = currentTab.url;


            });
            return tab;
        }

        function hideLoadingSign() {
            $('.loadingSign').addClass('hide');
        }

        function checkBookmarkExists(url) {
            var ajaxSettings = {
                url: 'http://del.dev/bookmark/check',
                'method': 'POST',
                'dataType': 'json',
                'data': {
                    "url": url
                }
            };
            return $.ajax(ajaxSettings);
        }

        function showBookmarkForm() {
            $('.message').addClass('hide');
            hideLoadingSign();
            $('#addBookmarkForm').removeClass('hide');
            $('#loginForm').addClass('hide');
        }

        function setFormFields(url, title, tags, description) {
            $('#title').val(title);
            $('#url').val(url);
            if (typeof tags != "undefined") {
                $('#tags').val(tags);
            }
            if (typeof description != undefined) {
                $('#comment').text(description);
            }
        }
        function showLoginForm() {
            $('.message').addClass('hide');
            hideLoadingSign();
            $('#addBookmarkForm').removeClass('hide');
            $('#loginForm').addClass('hide');
        }

        function setFormAsEdit(response) {

            var bookmark = response.bookmark;

            setFormFields(bookmark.url, bookmark.title, response.tags.join(), bookmark.comment);

            // Set form action to edit
            var $formElement = $('#addBookmarkForm').find('form').first();
            var editUrl = "http://del.dev/bookmarks/edit";
            $formElement.attr('action', 'http://del.dev/bookmarks/edit');

            //Set url input box as disabled
            var $urlInputBox = $formElement.find('#url');
            $urlInputBox.prop('disabled', 'disabled');

            showBookmarkForm();

        }

        function init() {
            var tab = getTabDetails();
            checkLogin()
                .done(function (response) {
                    if (response == "true") {
                        checkBookmarkExists(tab.url)
                            .done(function (response) {
                                if (response.result == true) {
                                    setFormAsEdit(response);
                                } else {
                                    setFormFields(tab.url, tab.title);
                                    showBookmarkForm();
                                }
                            });


                    } else {
                        showLoginForm();
                    }

                })
                .fail(function () {
                    hideLoadingSign();
                    $('.message').text("Couldn't connect to the server");
                });

        }

        init();


        /*


         function setFormFields(title, url, tags, description) {

         $('#title').val(title);
         $('#url').val(url);
         if (tags != null) {
         $('#tags').text(tags.join());
         }
         if (description != null) {
         $('#comment').text(description);
         }


         }
         /!*var query = {active: true, currentWindow: true};
         var currentTab = chrome.tabs.query(query, function (tabs) {
         var currentTab = tabs[0];

         });
         *!/

         checkBookmarkExists = function(url) {
         $.ajax('http://del.dev/bookmark/check', {
         'method': 'POST',
         'data': {
         "url": url
         },
         success: function(response) {
         console.log(response);
         ajaxResponse = response;
         },
         error: function(xhr, status, error) {
         ajaxResponse = false;
         }


         }

         );
         return ajaxResponse;
         }
         var setForm = function (bookmark) {
         var response = checkBookmarkExists(bookmark.url);
         console.log(response);
         if(response != null && response.result == true) {
         var $formDiv = $('#addBookmarkForm');
         var $header = $formDiv.find('h2');
         $header.text('PurpleLinks - Edit bookmark');
         var $urlTextBox = $formDiv.find('#url');
         $urlTextBox.prop('disabled', 'disabled');
         var $form = $formDiv.find('#bookmarkForm');
         $form.attr('method', 'http://del.dev/bookmarks/edit');
         bookmark = response.bookmark;
         setFormFields(bookmark.title, bookmark.url, bookmark.tags, bookmark.comment);
         }


         };

         function getBookmark() {
         var response = checkBookmarkExists(getTab().url);

         }

         $.get('http://del.dev/login/check', function (response) {
         if (response === "false") {
         $('.loadingSign').addClass('hide');
         $("#addBookmarkForm").addClass('hide');
         $("#loginForm").removeClass('hide');
         } else if (response === "true") {
         var bookmark = getBookmark();
         $('.loadingSign').addClass('hide');
         console.log(bookmark);
         //setForm(bookmark);
         setFormFields(bookmark);
         $("#addBookmarkForm").removeClass('hide');
         $("#loginForm").addClass('hide');
         }

         }
         );

         $('#login').submit(function (e) {
         var form = $(this);
         $.ajax('http://del.dev/login', {
         'dataType': 'json',
         'accepts': {
         json: 'application/json'
         },
         'method': "POST",
         'context': form,
         'data': $(this).serialize(),
         'success': function (response) {
         console.log(response);
         if (response == true) {
         location.reload();
         } else {
         $('.message').text("Couldn't login. Try again.")
         }
         },
         'error': function (jqXHR, textStatus, errorThrown) {
         $('.loginFormMessage').text('There was an error: ' + errorThrown);
         }
         });
         e.preventDefault();
         });

         $('#bookmarkForm').submit(function(e) {
         var submitURL = $(this).attr('action');
         var form = this;
         var $message = $('.message');
         $.ajax(submitURL, {
         method: 'POST',
         context: form,
         data: $(this).serialize(),
         dataType: 'json',
         accepts: {
         'json': 'application/json'
         },
         success: function(response) {
         if (response.result == true) {
         console.log(response);
         $message.text('Bookmark added successfully.');
         $message.addClass('success');
         $message.removeClass('hide');
         $('#addBookmarkForm').addClass('hide');

         } else {
         $message.text('There was an error: ' + response.reason);
         }

         },
         error: function(xhr, status, error) {
         $message.text("Couldn't add bookmark: " + error);
         $message.addClass('error');
         }




         });

         e.preventDefault();
         });
         */


    }
)
;



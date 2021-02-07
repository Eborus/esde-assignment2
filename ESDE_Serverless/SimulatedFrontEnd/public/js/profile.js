let $profileContainer = $('#profileContainer');
if ($profileContainer.length != 0) {
    console.log('Profile page is detected. Binding event handling logic to form elements.');
    $('#backButton').on("click", function(e){
        e.preventDefault();
        window.history.back();
    });

    function getOneUser() {

        const apiurl = 'https://1s2gkq0woe.execute-api.us-east-1.amazonaws.com/delta/user/';

        let userId = localStorage.getItem('user_id');
        axios({
            method: 'get',
            url: apiurl + userId,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically populate the elements with data.
                const data = response.data;
                $('#fullNameOutput').text(data.Item.fullname.S);
                $('#emailOutput').text(data.Item.email.S);
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable retrieve profile data',
                }).show();
            });

    } //End of getOneUser
    //Call getOneUser function to do a GET HTTP request on an API to retrieve one user record
    getOneUser();
} //End of checking for $profileContainer jQuery object
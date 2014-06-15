var foo = $.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'http://api.meetup.com/2/groups',
    data: {
        key: '5f2a61211f8735c1f612b661c263a18',
        group_urlname: 'NorfolkJS',
        fields: 'sponsors',
        sig_id: true,
    }
})
.done(function (json) {
    console.log(json);
});

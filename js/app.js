var db = new PouchDB('content_db');
var Delta = Quill.import('delta');
var options = {
    placeholder: 'Loading ...',
    readOnly: true,
    theme: 'snow'
};
var editor = new Quill('#editor', options);
var change = new Delta();
editor.on('text-change', function(delta) {
    db.get('content').then(function(doc) {
        doc.content = editor.getContents();
        db.put(doc);
    }).catch(function (err) {
        console.log(err);
    });
});
var remoteCouch = false;
db.get('content').then(function(doc) {
    editor.updateContents(doc.content);
    editor.enable();
}).catch(function (err) {
    if(err.name=="not_found"){
        var content = {
            _id: "content",
            content: {}
        };
        db.put(content);

        editor.enable();
    } else{
        console.log(err);
    }
});

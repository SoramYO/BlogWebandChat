// post.js
function Post() {
    function bindEvents() {
        $(".post_edit").click(function (e) {
            e.preventDefault(); // Prevent default form submission behavior

            var params = {
                id: $(".id").val(),
                title: $("#title").val(),
                content: tinymce.get("content").getContent(),
                author: $("#author").val()
            };

            var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            var editUrl = base_url + "/admin/post/edit"; // Adjust the URL according to your server setup

            $.ajax({
                url: editUrl,
                type: "PUT", // Assuming your server handles updates with PUT method
                data: params,
                dataType: "json",
                success: function (res) {
                    if (res && res.status === 200) {
                        alert("Update post success");
                        location.reload(); // Reload the page after successful update
                    }
                }
            });
        });

        $(".post_delete").click(function (e) {
            var id = $(this).attr("post_id");

            var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            var deleteUrl = base_url + "/admin/post/delete"; // Adjust the URL according to your server setup

            $.ajax({
                url: deleteUrl,
                type: "DELETE", // Assuming your server handles deletes with DELETE method
                data: { id: id },
                dataType: "json",
                success: function (res) {
                    if (res && res.status === 200) {
                        alert("Delete post success");
                        location.reload(); // Reload the page after successful delete
                    }
                }
            });
        });
    }

    bindEvents();
}

// Wait for the document to be fully loaded
$(document).ready(function () {
    new Post();
});

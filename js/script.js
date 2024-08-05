document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('auth-page')) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML('afterbegin', data);
            });
    }
});


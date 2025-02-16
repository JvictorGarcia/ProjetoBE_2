document.addEventListener("DOMContentLoaded", function () {
    const buyTicketBtn = document.getElementById("buy-ticket-btn");
    const myTicketsBtn = document.getElementById("my-tickets-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (buyTicketBtn) {
        buyTicketBtn.addEventListener("click", function () {
            window.location.href = "/tickets";
        });
    }

    if (myTicketsBtn) {
        myTicketsBtn.addEventListener("click", function () {
            window.location.href = "/history";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch('/users/logout', { method: 'GET' })
                .then(response => {
                    if (response.ok) {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    } else {
                        console.error("Erro ao fazer logout");
                    }
                })
                .catch(error => console.error("Erro ao sair:", error));
        });
    }
});
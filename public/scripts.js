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
            window.location.href = "/compras"; 
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch('/logout', { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    } else {
                        console.error("Erro ao fazer logout");
                    }
                })
                .catch(error => console.error("Erro ao sair:", error));
        });
    }
});

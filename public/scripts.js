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
            window.location.href = "/purchases/history"; // 🔥 Corrigido para a rota correta
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch('/users/logout', { method: 'GET' }) // 🔥 Corrigido para GET e rota correta
                .then(response => {
                    if (response.ok) {
                        localStorage.removeItem("token");
                        window.location.href = "/"; // 🔥 Agora redireciona para home.handlebars
                    } else {
                        console.error("Erro ao fazer logout");
                    }
                })
                .catch(error => console.error("Erro ao sair:", error));
        });
    }
});

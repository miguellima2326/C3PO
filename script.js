function scrollToLeft() {
    // Verifica se o elemento existe antes de tentar usá-lo
    const carousel = document.getElementById("carousel");
    if (carousel) {
        carousel.scrollBy({ left: -200, behavior: "smooth" });
    }
}

function scrollRight() {
    const carousel = document.getElementById("carousel");
    if (carousel) {
        carousel.scrollBy({ left: 200, behavior: "smooth" });
    }
}

document.querySelectorAll(".carousel").forEach((carousel) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse
    carousel.addEventListener("mousedown", (e) => {
        isDown = true;
        carousel.classList.add("active");
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("mouseleave", () => {
        isDown = false;
        carousel.classList.remove("active");
    });

    carousel.addEventListener("mouseup", () => {
        isDown = false;
        carousel.classList.remove("active");
    });

    carousel.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Multiplicador para acelerar o scroll
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch
    carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("touchmove", (e) => {
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
});

// Contador de cursos (se aplicável)
function updateAllCourseCounters() {
    const carousels = document.querySelectorAll(".carousel");
    carousels.forEach((carousel) => {
        const totalCourses = carousel.querySelectorAll(".course").length;
        const area = carousel.dataset.area || "Cursos";
        // Encontra o elemento contador - ajuste o seletor se necessário
        const counterElement = carousel.closest(".section")?.querySelector(".course-counter"); 
        if (counterElement) {
            const plural = totalCourses === 1 ? "disponível" : "disponíveis";
            counterElement.textContent = `${totalCourses} curso${totalCourses === 1 ? "" : "s"} de ${area} ${plural}`;
        }
    });
}

// Chama o contador quando o DOM estiver carregado (se a funcionalidade for usada)
// window.addEventListener("DOMContentLoaded", updateAllCourseCounters);

// --- Funções da Sidebar --- 

function mostrarPerfil(event) {
    event.preventDefault();
    const sidebar = document.getElementById("perfil-sidebar");
    if (sidebar) {
        sidebar.classList.add("show");
    }
}

function fecharPerfil() {
    const sidebar = document.getElementById("perfil-sidebar");
    if (sidebar) {
        sidebar.classList.remove("show");
        // Garante que os formulários também sejam fechados
        fecharFormularios(); 
    }
}

// Nova função para mostrar formulário específico e esconder opções
function mostrarFormulario(event, formIdToShow) {
    event.preventDefault();
    const sidebar = document.getElementById("perfil-sidebar");
    const opcoesPrincipais = sidebar?.querySelector(".perfil-opcoes");
    const loginForm = document.getElementById("login-form");
    const cadastroForm = document.getElementById("cadastro-form");
    const resetSenhaForm = document.getElementById("reset-senha-form"); // Adicionado

    if (!sidebar || !opcoesPrincipais || !loginForm || !cadastroForm || !resetSenhaForm) { // Adicionado resetSenhaForm na verificação
        console.error("Elementos da sidebar ou formulários não encontrados!");
        return;
    }

    // Esconde as opções principais
    opcoesPrincipais.style.display = "none";

    // Esconde todos os formulários primeiro
    loginForm.style.display = "none";
    cadastroForm.style.display = "none";
    resetSenhaForm.style.display = "none"; // Adicionado

    // Mostra o formulário solicitado
    const formToShow = document.getElementById(formIdToShow);
    if (formToShow) {
        formToShow.style.display = "block";
    }
}

// Nova função para fechar todos os formulários e mostrar opções
function fecharFormularios() {
    const sidebar = document.getElementById("perfil-sidebar");
    const opcoesPrincipais = sidebar?.querySelector(".perfil-opcoes");
    const loginForm = document.getElementById("login-form");
    const cadastroForm = document.getElementById("cadastro-form");
    const resetSenhaForm = document.getElementById("reset-senha-form"); // Adicionado

    // Verifica se os elementos essenciais existem
    if (!sidebar || !opcoesPrincipais) {
        return; 
    }

    // Esconde todos os formulários se existirem
    if (loginForm) loginForm.style.display = "none";
    if (cadastroForm) cadastroForm.style.display = "none";
    if (resetSenhaForm) resetSenhaForm.style.display = "none"; // Adicionado

    // Mostra as opções principais novamente
    opcoesPrincipais.style.display = "block"; 
}


// --- Funções de Submissão (Fetch para Backend PHP) ---

// Função para lidar com o envio do login
async function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (!usernameInput || !passwordInput) {
        console.error("Campos de login não encontrados!");
        alert("Erro no formulário de login. Tente recarregar.");
        return;
    }

    const username = usernameInput.value;
    const password = passwordInput.value;

    // *** AJUSTE A URL CONFORME SEU AMBIENTE LOCAL ***
    const backendUrl = "login.php"; // Ou http://localhost/seu_projeto/login.php

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        });

        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
            alert("Login bem-sucedido!");
            fecharFormularios(); // Fecha o formulário
            fecharPerfil(); // Fecha a sidebar
            // Adicionar lógica pós-login aqui (ex: atualizar interface)
        } else {
            alert(`Falha no login: ${result.message || "Usuário ou senha inválidos."}`);
            if (passwordInput) passwordInput.value = "";
        }
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
        if (error instanceof SyntaxError) {
            alert("Erro ao processar resposta do servidor (login). Verifique o PHP.");
        } else if (error.message.includes("Failed to fetch")) {
            alert("Não foi possível conectar ao servidor (login). Verifique a URL e se o servidor está rodando.");
        } else {
            alert("Erro inesperado ao tentar fazer login.");
        }
    }
}

// Função para lidar com o envio do cadastro (Primeiro Acesso)
async function handleCadastro(event) {
    event.preventDefault();
    // IDs conforme o HTML 
    const nomeInput = document.getElementById("cadastro-nome"); // ID do HTML
    const emailInput = document.getElementById("cadastro-email");
    const usernameInput = document.getElementById("cadastro-username");
    const passwordInput = document.getElementById("cadastro-password");
    const confirmPasswordInput = document.getElementById("cadastro-password-confirm");

    if (!nomeInput || !emailInput || !usernameInput || !passwordInput || !confirmPasswordInput) {
        console.error("Campos de cadastro não encontrados!");
        alert("Erro no formulário de cadastro. Tente recarregar.");
        return;
    }

    const nomeCompleto = nomeInput.value; // Pega o valor do campo nome
    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validação básica no cliente
    if (password !== confirmPassword) {
        alert("As senhas não coincidem!");
        if (passwordInput) passwordInput.value = "";
        if (confirmPasswordInput) confirmPasswordInput.value = "";
        return;
    }

    if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    // *** AJUSTE A URL CONFORME SEU AMBIENTE LOCAL ***
    const backendUrl = "cadastro.php"; // Ou http://localhost/seu_projeto/cadastro.php

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            // CORREÇÃO: Enviar 'nome_completo' como esperado pelo PHP
            body: `nome_completo=${encodeURIComponent(nomeCompleto)}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        });

        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
            alert("Cadastro realizado com sucesso! Você já pode fazer login.");
            fecharFormularios(); // Fecha o formulário de cadastro
            // Opcional: Abrir formulário de login automaticamente
            // mostrarFormulario(new Event('click'), 'login-form');
        } else {
            alert(`Falha no cadastro: ${result.message || "Não foi possível completar o cadastro."}`);
        }
    } catch (error) {
        console.error("Erro ao tentar fazer cadastro:", error);
        if (error instanceof SyntaxError) {
            alert("Erro ao processar resposta do servidor (cadastro). Verifique o PHP.");
        } else if (error.message.includes("Failed to fetch")) {
            alert("Não foi possível conectar ao servidor (cadastro). Verifique a URL e se o servidor está rodando.");
        } else {
            alert("Erro inesperado ao tentar fazer o cadastro.");
        }
    }
}


// --- Outras Funções (Popups, Navbar Active, etc.) ---

// Lightbox (se usado)
function openLightbox(src) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add("active");
    }
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.classList.remove("active");
    }
}

// Popups do Rodapé
document.addEventListener("DOMContentLoaded", function () {
    function configurarPopup(botaoAbrirId, popupId, botaoFecharId) {
        const botaoAbrir = document.getElementById(botaoAbrirId);
        const popup = document.getElementById(popupId);
        const botaoFechar = document.getElementById(botaoFecharId);

        if (botaoAbrir && popup && botaoFechar) {
            botaoAbrir.addEventListener("click", function (e) {
                e.preventDefault();
                popup.style.display = "flex";
                popup.classList.remove("hide");
                setTimeout(() => {
                    popup.classList.add("show");
                }, 10); // Pequeno delay para transição
            });

            botaoFechar.addEventListener("click", function () {
                popup.classList.remove("show");
                popup.classList.add("hide");
                setTimeout(() => {
                    popup.style.display = "none";
                }, 300); // Tempo da animação CSS
            });

            // Fechar ao clicar fora
            window.addEventListener("click", function (e) {
                if (e.target === popup) {
                    popup.classList.remove("show");
                    popup.classList.add("hide");
                    setTimeout(() => {
                        popup.style.display = "none";
                    }, 300);
                }
            });
        } else {
            // console.warn(`Elementos do popup não encontrados: ${botaoAbrirId}, ${popupId}, ${botaoFecharId}`);
        }
    }

    // Configurar todos os popups
    configurarPopup("abrirPopupTelefone", "popupTelefone", "fecharPopupTelefone");
    configurarPopup("abrirPopupFacebook", "popupFacebook", "fecharPopupFacebook");
    configurarPopup("abrirPopupGmail", "popupGmail", "fecharPopupGmail");

    // Navbar Active Link
    const links = document.querySelectorAll(".navbar ul li a");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    links.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();
        if (linkPage === currentPage || (currentPage === "index.html" && (linkPage === "" || linkPage === "index.html"))) {
            link.classList.add("active");
        }
    });
});

// Desabilitar arrastar imagens (opcional)
document.addEventListener("dragstart", function(e) {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});






// Função para lidar com o envio do formulário "Esqueci Minha Senha"
async function handleResetSenha(event) {
    event.preventDefault();
    const emailInput = document.getElementById("reset-email");
    // A div de feedback está dentro do mesmo container do formulário
    const feedbackDiv = event.target.closest(".formulario-container").querySelector("#reset-feedback"); 

    if (!emailInput || !feedbackDiv) {
        console.error("Campo de e-mail ou div de feedback não encontrados!");
        alert("Erro no formulário de recuperação. Tente recarregar.");
        return;
    }

    const email = emailInput.value;
    feedbackDiv.textContent = "Processando..."; // Feedback inicial
    feedbackDiv.style.color = "#ccc"; // Cor padrão ou de processamento

    // *** AJUSTE A URL CONFORME SEU AMBIENTE LOCAL ***
    const backendUrl = "reset_senha_request.php"; // Ou http://localhost/seu_projeto/reset_senha_request.php

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `email=${encodeURIComponent(email)}`,
        });

        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
            feedbackDiv.textContent = result.message;
            feedbackDiv.style.color = "#28a745"; // Verde para sucesso
            emailInput.value = ""; // Limpa o campo após sucesso
        } else {
            feedbackDiv.textContent = `Falha: ${result.message || "Não foi possível processar a solicitação."}`;
            feedbackDiv.style.color = "#dc3545"; // Vermelho para erro
        }
        
        // Opcional: Exibir o token de debug se ele existir na resposta (APENAS PARA DESENVOLVIMENTO)
        // if (result.debug_token) {
        //     console.log("Token de Reset (Debug):", result.debug_token);
        //     alert("Token de Reset (Debug): " + result.debug_token + "\nVerifique o console para copiar.");
        // }

    } catch (error) {
        console.error("Erro ao solicitar redefinição de senha:", error);
        feedbackDiv.textContent = "Erro ao conectar com o servidor. Tente novamente.";
        feedbackDiv.style.color = "#dc3545"; // Vermelho para erro
        if (error instanceof SyntaxError) {
            feedbackDiv.textContent = "Erro ao processar resposta do servidor (reset). Verifique o PHP.";
        } else if (error.message.includes("Failed to fetch")) {
            feedbackDiv.textContent = "Não foi possível conectar ao servidor (reset). Verifique a URL e se o servidor está rodando.";
        }
    }
}


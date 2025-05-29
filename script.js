function scrollToLeft() {
    document.getElementById('carousel').scrollBy({ left: -200, behavior: 'smooth' });
  }
  function scrollRight() {
    document.getElementById('carousel').scrollBy({ left: 200, behavior: 'smooth' });
  }
  
document.querySelectorAll('.carousel').forEach((carousel) => {
    let isDown = false;
    let startX;
    let scrollLeft;
  
// Mouse
carousel.addEventListener('mousedown', (e) => {
  isDown = true;
  carousel.classList.add('active');
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});
  
carousel.addEventListener('mouseleave', () => {
  isDown = false;
  carousel.classList.remove('active');
});
  
carousel.addEventListener('mouseup', () => {
  isDown = false;
  carousel.classList.remove('active');
});
  
carousel.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2;
  carousel.scrollLeft = scrollLeft - walk;
});
  
// Touch
carousel.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});
  
carousel.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2;
  carousel.scrollLeft = scrollLeft - walk;
});
});

// Contador de cursos
function updateAllCourseCounters() {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach((carousel) => {
    const totalCourses = carousel.querySelectorAll('.course').length;
    const area = carousel.dataset.area || 'Cursos';
    const counterElement = carousel.parentElement.nextElementSibling;

    const plural = totalCourses === 1 ? 'disponível' : 'disponíveis';
    counterElement.textContent = `${totalCourses} curso${totalCourses === 1 ? '' : 's'} de ${area} ${plural}`;
  });
}

window.addEventListener('DOMContentLoaded', updateAllCourseCounters);

//SideBar

// Note: There were two definitions of mostrarPerfil, keeping the second one which seems correct for the sidebar
function mostrarPerfil(event) {
  event.preventDefault();
  document.getElementById('perfil-sidebar').classList.add('show');
}

function fecharPerfil() {
  document.getElementById('perfil-sidebar').classList.remove('show');
}

// Lightbox

function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

// Popup Rodapé
document.addEventListener('DOMContentLoaded', function () {
  function configurarPopup(botaoAbrirId, popupId, botaoFecharId) {
    const botaoAbrir = document.getElementById(botaoAbrirId);
    const popup = document.getElementById(popupId);
    const botaoFechar = document.getElementById(botaoFecharId);

    if (botaoAbrir && popup && botaoFechar) { // Check if elements exist
      botaoAbrir.addEventListener('click', function (e) {
        e.preventDefault();
        popup.style.display = 'flex';
        popup.classList.remove('hide');
        setTimeout(() => {
          popup.classList.add('show');
        }, 10);
      });

      botaoFechar.addEventListener('click', function () {
        popup.classList.remove('show');
        popup.classList.add('hide');
        setTimeout(() => {
          popup.style.display = 'none';
        }, 300);
      });

      window.addEventListener('click', function (e) {
        if (e.target === popup) {
          popup.classList.remove('show');
          popup.classList.add('hide');
          setTimeout(() => {
            popup.style.display = 'none';
          }, 300);
        }
      });
    } else {
      console.warn(`Popup elements not found for IDs: ${botaoAbrirId}, ${popupId}, ${botaoFecharId}`);
    }
  }

// Configurar todos os popups com animação
  configurarPopup('abrirPopupTelefone', 'popupTelefone', 'fecharPopupTelefone');
  configurarPopup('abrirPopupFacebook', 'popupFacebook', 'fecharPopupFacebook');
  configurarPopup('abrirPopupGmail', 'popupGmail', 'fecharPopupGmail');
});

// Active pra mudar Pagina Atual na NavBar
document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.navbar ul li a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if path is root

  links.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    // Make comparison more robust (handle cases like '/' or 'index.html')
    if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === '')) {
      link.classList.add('active');
    }
  });
});

// Drag off
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
});


// Funções para mostrar/esconder o formulário de login
function mostrarFormularioLogin(event) {
  event.preventDefault();
  const sidebar = document.getElementById('perfil-sidebar');
  const loginForm = document.getElementById('login-form');
  
  if (sidebar && loginForm) { // Check if elements exist
    // Oculta as opções normais e mostra o formulário
    sidebar.classList.add('login-active'); 
    loginForm.classList.add('show');
  } else {
    console.error('Sidebar or Login Form element not found!');
  }
}

function fecharFormularioLogin() {
  const sidebar = document.getElementById('perfil-sidebar');
  const loginForm = document.getElementById('login-form');

  if (sidebar && loginForm) { // Check if elements exist
    // Mostra as opções normais e oculta o formulário
    sidebar.classList.remove('login-active');
    loginForm.classList.remove('show');
  } else {
    console.error('Sidebar or Login Form element not found!');
  }
}

// Função para lidar com o envio do login (com fetch para o backend)
async function handleLogin(event) {
  event.preventDefault(); // Impede o envio padrão do formulário
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  // Verifica se os inputs existem antes de pegar os valores
  if (!usernameInput || !passwordInput) {
    console.error('Username or Password input element not found!');
    alert('Erro no formulário. Tente recarregar a página.');
    return;
  }

  const username = usernameInput.value;
  const password = passwordInput.value;

  // *** IMPORTANTE: Substitua pela URL real onde seu login.php está hospedado no XAMPP ***
  // Exemplo: const backendUrl = 'http://localhost/C3PO/login.php';
  const backendUrl = 'URL_DO_SEU_LOGIN_PHP_AQUI'; 

  // Verifica se a URL foi definida
  if (backendUrl === 'URL_DO_SEU_LOGIN_PHP_AQUI') {
    alert('Erro: A URL do backend não foi configurada no script.js!');
    console.error('Backend URL not set in script.js');
    return;
  }

  try {
    const response = await fetch(backendUrl, {
      method: 'POST', // Método HTTP para enviar dados
      headers: {
        // Informa ao PHP que estamos enviando dados de formulário
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Codifica os dados para envio no corpo da requisição
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}` 
    });

    // Verifica se a resposta da rede foi bem-sucedida (status 2xx)
    if (!response.ok) {
        throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
    }

    // Tenta interpretar a resposta como JSON
    const result = await response.json(); 

    if (result.success) { // Supondo que seu PHP retorna {success: true} em caso de sucesso
      alert('Login bem-sucedido!');
      // Aqui você pode redirecionar o usuário ou atualizar a interface
      // Ex: window.location.href = 'pagina_do_usuario.html'; // Redireciona para página de sucesso
      fecharFormularioLogin(); // Fecha o formulário
    } else {
      // Supondo que seu PHP retorna {success: false, message: '...'} em caso de erro
      alert(`Falha no login: ${result.message || 'Usuário ou senha inválidos.'}`);
      if (passwordInput) passwordInput.value = ''; // Limpa o campo de senha se existir
    }
  } catch (error) {
    console.error('Erro ao tentar fazer login:', error);
    // Informa ao usuário sobre o erro
    if (error instanceof SyntaxError) {
        alert('Ocorreu um erro ao processar a resposta do servidor. Verifique se o PHP está retornando JSON corretamente.');
    } else if (error.message.includes('Failed to fetch')) {
        alert('Não foi possível conectar ao servidor. Verifique a URL do backend e se o XAMPP está rodando.');
    } else {
        alert('Ocorreu um erro inesperado ao tentar fazer login. Tente novamente.');
    }
  }
}


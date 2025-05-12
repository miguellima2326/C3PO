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

function mostrarPerfil(event) {
  event.preventDefault();

  const secaoPerfil = document.getElementById('meu-perfil');

  secaoPerfil.classList.toggle('show');
  
//SideBar
}
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
  }

// Configurar todos os popups com animação
  configurarPopup('abrirPopupTelefone', 'popupTelefone', 'fecharPopupTelefone');
  configurarPopup('abrirPopupFacebook', 'popupFacebook', 'fecharPopupFacebook');
  configurarPopup('abrirPopupGmail', 'popupGmail', 'fecharPopupGmail');
});

// Active pra mudar Pagina Atual na NavBar
document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.navbar ul li a');
  const currentPage = window.location.pathname.split('/').pop();

  links.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
});




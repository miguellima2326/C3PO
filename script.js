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

  // Alterna entre mostrar e esconder
  secaoPerfil.classList.toggle('show');

  // Se quiser esconder outras coisas (tipo o carrossel), descomenta isso:
  // document.querySelector('.carousel-container').style.display = secaoPerfil.classList.contains('show') ? 'none' : 'flex';
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
  const botaoAbrir = document.getElementById('abrirPopup');
  const popup = document.getElementById('popupTelefone');
  const botaoFechar = document.getElementById('fecharPopup');

  botaoAbrir.addEventListener('click', function (e) {
    e.preventDefault();
    popup.style.display = 'flex';
  });

  botaoFechar.addEventListener('click', function () {
    popup.style.display = 'none';
  });

  window.addEventListener('click', function (e) {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });
});


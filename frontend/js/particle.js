// Añadir esto justo antes del cierre del body
document.addEventListener('DOMContentLoaded', function() {
    // Crear contenedor de partículas
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles';
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.zIndex = '-1';
    particleContainer.style.pointerEvents = 'none';
    document.body.appendChild(particleContainer);
    
    // Número de partículas
    const numParticles = 50;
    
    // Crear partículas iniciales
    for (let i = 0; i < numParticles; i++) {
      createParticle();
    }
    
    // Función para crear una partícula
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Posición aleatoria
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Tamaño aleatorio
      const size = Math.random() * 5 + 2;
      
      // Tipo de partícula (roja, azul o blanca)
      const particleTypes = ['red', 'blue', 'white'];
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      
      // Establecer propiedades de la partícula
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Establecer color según el tipo
      if (type === 'red') {
        particle.style.backgroundColor = 'rgba(230, 57, 70, 0.7)';
      } else if (type === 'blue') {
        particle.style.backgroundColor = 'rgba(29, 53, 87, 0.7)';
      } else {
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      }
      
      // Duración aleatoria para la animación
      const duration = Math.random() * 4 + 3;
      particle.style.animation = `particle-animation ${duration}s ease-out`;
      
      // Añadir la partícula al contenedor
      particleContainer.appendChild(particle);
      
      // Eliminar la partícula después de que termine la animación
      particle.addEventListener('animationend', function() {
        particle.remove();
        createParticle(); // Crear una nueva partícula al terminar
      });
    }
    
    // Efecto de explosión al hacer clic
    document.addEventListener('click', function(event) {
      // Generar 8-12 partículas en el punto de clic
      const explosionParticles = Math.floor(Math.random() * 5) + 8;
      
      for (let i = 0; i < explosionParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición del clic
        const x = event.clientX;
        const y = event.clientY;
        
        // Tamaño aleatorio
        const size = Math.random() * 8 + 3;
        
        // Tipo de partícula (roja, azul o blanca)
        const colors = [
          'rgba(230, 57, 70, 0.8)', 
          'rgba(29, 53, 87, 0.8)',
          'rgba(255, 255, 255, 0.7)',
          'rgba(67, 97, 238, 0.8)',
          'rgba(74, 169, 242, 0.8)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Configurar propiedades
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        
        // Dirección aleatoria para la explosión
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 1.5 + 1;
        
        // Animación de explosión personalizada
        particle.style.animation = 'none';
        particle.style.transform = 'scale(0)';
        particle.style.opacity = '0';
        particle.style.transition = `all ${duration}s cubic-bezier(0.165, 0.84, 0.44, 1)`;
        
        // Añadir al DOM
        particleContainer.appendChild(particle);
        
        // Forzar un reflow
        void particle.offsetWidth;
        
        // Aplicar transformación para la explosión
        setTimeout(() => {
          particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`;
          particle.style.opacity = '1';
          
          // Desvanecer y eliminar después de la animación
          setTimeout(() => {
            particle.style.opacity = '0';
            setTimeout(() => {
              particle.remove();
            }, duration * 1000);
          }, duration * 500);
        }, 10);
      }
    });
    
    // Partículas flotantes adicionales en efecto parallax
    createFloatingParticles();
    
    function createFloatingParticles() {
      for (let i = 0; i < 20; i++) {
        const floater = document.createElement('div');
        
        // Posición aleatoria
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Tamaño aleatorio
        const size = Math.random() * 60 + 20;
        const opacity = Math.random() * 0.05 + 0.01;
        
        floater.style.position = 'fixed';
        floater.style.width = `${size}px`;
        floater.style.height = `${size}px`;
        floater.style.borderRadius = '50%';
        floater.style.left = `${x}px`;
        floater.style.top = `${y}px`;
        floater.style.backgroundColor = Math.random() > 0.5 ? 
          `rgba(230, 57, 70, ${opacity})` : 
          `rgba(29, 53, 87, ${opacity})`;
        floater.style.filter = 'blur(8px)';
        floater.style.pointerEvents = 'none';
        floater.style.zIndex = '-1';
        
        // Duración aleatoria para la animación
        const duration = Math.random() * 20 + 15;
        floater.style.animation = `float ${duration}s ease-in-out infinite`;
        floater.style.animationDelay = `${Math.random() * -20}s`;
        
        particleContainer.appendChild(floater);
      }
    }
    
    // Movimiento parallax de las partículas flotantes
    document.addEventListener('mousemove', function(e) {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const moveX = (mouseX - 0.5) * 20;
      const moveY = (mouseY - 0.5) * 20;
      
      document.querySelectorAll('#particles > div').forEach(particle => {
        if (!particle.classList.contains('particle')) {
          const depth = Math.random() * 0.5 + 0.3;
          particle.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
        }
      });
    });
  });
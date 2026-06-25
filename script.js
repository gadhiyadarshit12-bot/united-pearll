/* script.js - Interactive Elements for United Pearl Agency Website */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Header scroll effect
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loads scrolled

  // 2. Mobile navigation toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Scroll spy - Active link highlight on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollSpy = () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);

  // 4. Portfolio Tab Switcher
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.portfolio-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Update active button state
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show/Hide relevant portfolio pane
      panes.forEach(pane => {
        if (pane.getAttribute('id') === targetTab) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // 5. Scroll entrance animations (Intersection Observer)
  const animElements = document.querySelectorAll('.fade-up');
  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animElements.forEach(el => animObserver.observe(el));

  // 6. Contact Form submission logic
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Set sending loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending message... <span class="btn-icon">⚡</span>';
      
      // Gather name & email inputs for custom success message
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;

      // Prepare form data
      const data = new FormData(contactForm);

      // Perform AJAX POST request to Formspree
      fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          formStatus.className = 'form-feedback success';
          formStatus.innerHTML = `<strong>Thank you, ${name}!</strong> Your message has been sent successfully. We will get back to you at <strong>${email}</strong> soon.`;
          contactForm.reset();
        } else {
          response.json().then(data => {
            formStatus.className = 'form-feedback error';
            if (Object.hasOwn(data, 'errors')) {
              formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
            } else {
              formStatus.innerHTML = "Oops! There was a problem submitting your form.";
            }
          });
        }
      })
      .catch(error => {
        formStatus.className = 'form-feedback error';
        formStatus.innerHTML = "Oops! There was a problem submitting your form.";
      })
      .finally(() => {
        // Show status block
        formStatus.style.display = 'block';
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Hide status after 8 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 8000);
      });
    });
  }

});

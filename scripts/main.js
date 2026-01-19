document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navOverlay = document.querySelector('.nav__overlay');
    const header = document.querySelector('.header');
    const skipLink = document.querySelector('.skip-link');

    let lastScroll = 0;
    let scrollTimeout;

    const handleNavToggle = () => {
        const isActive = navList.classList.contains('nav__list--active');

        navList.classList.toggle('nav__list--active');
        navOverlay.classList.toggle('nav__overlay--active');
        navToggle.setAttribute('aria-expanded', !isActive);

        document.body.style.overflow = !isActive ? 'hidden' : '';
    };

    if (navToggle && navList && navOverlay) {
        navToggle.addEventListener('click', handleNavToggle);

        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavToggle);
        });

        navOverlay.addEventListener('click', handleNavToggle);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('nav__list--active')) {
                handleNavToggle();
            }
        });
    }

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (skipLink) {
            if (currentScroll > 200) {
                skipLink.style.opacity = '0';
                skipLink.style.pointerEvents = 'none';
            } else {
                skipLink.style.opacity = '1';
                skipLink.style.pointerEvents = 'auto';
            }
        }

        updateActiveNavLink();
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    });

    const updateActiveNavLink = () => {
        const scrollPosition = window.pageYOffset + 100;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav__link').forEach(link => {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    };

    const smoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    setTimeout(() => {
                        target.setAttribute('tabindex', '-1');
                        target.focus({ preventScroll: true });

                        const announcement = document.createElement('div');
                        announcement.setAttribute('aria-live', 'polite');
                        announcement.setAttribute('aria-atomic', 'true');
                        announcement.style.position = 'absolute';
                        announcement.style.left = '-10000px';
                        announcement.textContent = `Navegado para ${target.querySelector('h2')?.textContent || 'seção'}`;
                        document.body.appendChild(announcement);
                        setTimeout(() => document.body.removeChild(announcement), 1000);
                    }, 300);
                }
            });
        });
    };

    smoothScroll();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');

                    const children = entry.target.querySelectorAll('.stack__item, .project, .experience__item, .highlight, .contact__link');
                    children.forEach((child, childIndex) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                            child.style.animationDelay = `${childIndex * 0.1}s`;
                        }, childIndex * 100);
                    });
                }, index * 150);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        let isPressed = false;

        button.addEventListener('mouseenter', () => {
            if (!isPressed) {
                button.style.transform = 'translateY(-3px)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!isPressed) {
                button.style.transform = 'translateY(0)';
            }
        });

        button.addEventListener('mousedown', () => {
            isPressed = true;
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = 'var(--shadow-sm)';
        });

        button.addEventListener('mouseup', () => {
            isPressed = false;
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '';
        });

        button.addEventListener('focus', () => {
            button.style.outline = `2px solid var(--color-primary)`;
            button.style.outlineOffset = '2px';
        });

        button.addEventListener('blur', () => {
            button.style.outline = '';
            button.style.outlineOffset = '';
        });
    });

    const cards = document.querySelectorAll('.project, .stack__item, .experience__item, .contact__link');
    cards.forEach(card => {
        let mouseX = 0;
        let mouseY = 0;
        let cardX = 0;
        let cardY = 0;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            mouseX = e.clientX - rect.left - rect.width / 2;
            mouseY = e.clientY - rect.top - rect.height / 2;

            cardX = mouseX * 0.1;
            cardY = mouseY * 0.1;

            card.style.transform = `translate(${cardX}px, ${cardY - 4}px)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = 'translate(0, 0)';
            cardX = 0;
            cardY = 0;
        };

        card.addEventListener('mouseenter', () => {
            card.addEventListener('mousemove', handleMouseMove);
        });

        card.addEventListener('mouseleave', handleMouseLeave);
    });

    const heroBackground = document.querySelector('.hero__background-image');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                const rate = scrolled * -0.3;
                heroBackground.style.transform = `scale(1.05) translateY(${rate * 0.5}px)`;
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Premium Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('portfolio_theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-mode');
        if(themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-theme');
    }
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-mode');
            if (isLight) {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-theme');
                localStorage.setItem('portfolio_theme', 'dark');
                if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-mode');
                localStorage.setItem('portfolio_theme', 'light');
                if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
            }
        });
    }

    // 2. Navigation Sticky & Mobile Menu
    const navbar = document.getElementById('navbar');
    document.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            const isFlex = navLinks.style.display === 'flex';
            navLinks.style.display = isFlex ? 'none' : 'flex';
            if(!isFlex) {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-navy)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid var(--glass-border)';
            }
        });
    }

    // 3. Scroll Reveal Animations with Premium Stagger
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    
    let revealQueue = [];

    const revealObserver = new IntersectionObserver((entries, observer) => {
        let hasNew = false;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealQueue.push(entry.target);
                observer.unobserve(entry.target);
                hasNew = true;
            }
        });

        if (hasNew) {
            // Sort to ensure top-to-bottom stagger
            revealQueue.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
            revealQueue.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, index * 100);
            });
            revealQueue = [];
        }
    }, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // Number counter animation
    const counters = document.querySelectorAll('.count-up');
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const inc = target / 50; // speed
                const updateCount = () => {
                    count += inc;
                    if (count < target) {
                        entry.target.innerText = Math.ceil(count) + "+";
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.innerText = target + "+";
                    }
                };
                updateCount();
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // 4. Advanced Interaction & Premium Cursor
    const magneticBtns = document.querySelectorAll('.magnetic-btn, .magnetic-pill');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Premium Cursor Glow Logic
    const cursorGlow = document.querySelector('.cursor-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    if (window.matchMedia("(pointer: fine)").matches) {
        if (cursorGlow) {
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                if(cursorGlow.style.opacity === '0' || cursorGlow.style.opacity === '') {
                    cursorGlow.style.opacity = '1';
                }
            });
            
            function animateCursor() {
                glowX += (mouseX - glowX) * 0.08; // smooth lerp execution
                glowY += (mouseY - glowY) * 0.08;
                cursorGlow.style.left = `${glowX}px`;
                cursorGlow.style.top = `${glowY}px`;
                requestAnimationFrame(animateCursor);
            }
            animateCursor();
        }

        // Project card radial glow
        projectCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Magnetic Button effect
        document.addEventListener('mousemove', (e) => {
            magneticBtns.forEach(btn => {
                const rect = btn.getBoundingClientRect();
                const btnX = rect.left + rect.width / 2;
                const btnY = rect.top + rect.height / 2;
                
                const distX = e.clientX - btnX;
                const distY = e.clientY - btnY;
                
                if (Math.abs(distX) < 100 && Math.abs(distY) < 80) {
                    btn.style.transform = `translate(${distX * 0.15}px, ${distY * 0.15}px) scale(1.05)`;
                } else {
                    btn.style.transform = '';
                }
            });
        });
        
        document.addEventListener('mouseleave', () => {
            magneticBtns.forEach(btn => btn.style.transform = '');
        });
    }

    // 5. Typewriter Effect
    const roles = ["AI/ML Engineer", "Full Stack Developer", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayBetween = 2000;
    const typewriterEl = document.getElementById('typewriter');

    function typeWriter() {
        if (!typewriterEl) return;
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = delayBetween;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }

        setTimeout(typeWriter, speed);
    }
    typeWriter();

    // 6. Glass AI Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chatbot-messages');
    
    // Requested exact Q&A mapped
    const kb = {
        "who are you": "I am Karri Punith's AI Assistant. How can I help you today?",
        "skills": "Karri Punith specializes in Machine Learning, Data Structures, and Full Stack Development.",
        "projects": "Punith has built Freshin10 (Full-stack delivery platform), an AI Crop Disease Detection system, and a Java-based DSA Library Book Tracker.",
        "technologies": "His stack includes Java, Python, JavaScript, HTML/CSS, React, NumPy, Pandas, Computer Vision, MySQL, and Git.",
        "experience": "He worked as a Software Engineer Intern at Yuga Yatra Retail where he built modules and optimized the Freshin10 platform.",
        "certifications": "He holds 7 major certifications including Oracle AI/Data Platforms, ChatGPT/LLM, Python/Django, Networking, RWD, and DSA with Java.",
        "resume": "You can view or download his resume from the Hero section at the very top of the page.",
        "contact": "You can reach him at royalpunith778@gmail.com, or through his integrated contact form."
    };

    function processChatbotQuery(query) {
        query = query.toLowerCase().trim().replace(/\?/g, '');
        for (const [key, answer] of Object.entries(kb)) {
            if (query.includes(key.toLowerCase())) return answer;
            // Relaxed keyword mapping for UI quick-chips
            if (key === "who are you" && query.includes("who")) return answer;
        }
        return "Thanks for reaching out! For more detailed inquiries, please send an email to royalpunith778@gmail.com.";
    }

    function addMessageUI(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${isUser ? 'user-msg' : 'ai-msg'}`;
        
        const chips = document.getElementById('suggestion-chips');
        if (chips) chips.style.display = 'none';

        if (isUser) {
            msgDiv.textContent = text;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Add typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'msg ai-msg typing-indicator';
            typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                typingDiv.remove();
                addMessageUI(processChatbotQuery(text), false);
            }, 1000); // 1s typing delay
            
        } else {
            msgDiv.textContent = text;
            chatMessages.appendChild(msgDiv);
            if (chips) {
                chatMessages.appendChild(chips);
                chips.style.display = 'flex';
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function toggleChat() {
        if (!chatbotWindow) return;
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            setTimeout(() => chatInput.focus(), 300);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    if (chatbotToggle) chatbotToggle.addEventListener('click', toggleChat);
    if (chatbotClose) chatbotClose.addEventListener('click', toggleChat);

    function sendMsg() {
        if (!chatInput) return;
        const txt = chatInput.value.trim();
        if(!txt) return;
        chatInput.value = '';
        addMessageUI(txt, true);
    }
    
    if (chatSend) chatSend.addEventListener('click', sendMsg);
    if (chatInput) chatInput.addEventListener('keypress', e => {
        if(e.key === 'Enter') sendMsg();
    });

    document.querySelectorAll('.chip').forEach(c => {
        c.addEventListener('click', () => {
            const query = c.textContent;
            addMessageUI(query, true);
        });
    });

    // 7. Fade-up Animation Logic (Enhancement)
    const fadeElements = document.querySelectorAll('.fade-up');
    window.addEventListener('scroll', () => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('show');
            }
        });
    });

    // 8. Global Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = height > 0 ? (scroll / height) * 100 : 0;
        const scrollBar = document.getElementById('scroll-bar');
        if (scrollBar) scrollBar.style.width = percent + '%';
    });

    // 9. Navbar Active Section Highlight
    const sectionsObj = document.querySelectorAll('section');
    const navLinksObj = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = "";
        sectionsObj.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        navLinksObj.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 10. Image Fade Load
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => img.classList.add('loaded'));
        }
    });

});

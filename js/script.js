document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle toggle icon (if using fontawesome classes)
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Active state for nav links on scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // ---- 3D Tilt Effect for Certifications ----
    const tiltCards = document.querySelectorAll('.cert-photo-card[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            const centerX = cardRect.left + cardWidth / 2;
            const centerY = cardRect.top + cardHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (-1 * (mouseY / (cardHeight / 2)) * 10).toFixed(2); // Max 10 deg
            const rotateY = ((mouseX / (cardWidth / 2)) * 10).toFixed(2); // Max 10 deg
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // =============================
    // Certifications Slider Logic
    // =============================
    const certTrack = document.getElementById('certTrack');
    const certSlides = document.querySelectorAll('.cert-slide');
    const certPrev = document.getElementById('certPrev');
    const certNext = document.getElementById('certNext');
    const certDotsContainer = document.getElementById('certDots');
    
    let currentCert = 0;
    
    // Create dots
    certSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('cert-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToCert(index));
        certDotsContainer.appendChild(dot);
    });
    
    const certDots = document.querySelectorAll('.cert-dot');
    
    function updateDots() {
        certDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentCert);
        });
    }
    
    function goToCert(index) {
        if (index === currentCert) return;
        
        const direction = index > currentCert ? 1 : -1;
        const currentSlide = certSlides[currentCert];
        const nextSlide = certSlides[index];
        
        currentSlide.classList.remove('active');
        currentSlide.classList.add('slide-out');
        
        nextSlide.classList.add('active');
        
        setTimeout(() => {
            currentSlide.classList.remove('slide-out');
        }, 500);
        
        currentCert = index;
        updateDots();
    }
    
    certPrev.addEventListener('click', () => {
        let index = currentCert - 1;
        if (index < 0) index = certSlides.length - 1;
        goToCert(index);
    });
    
    certNext.addEventListener('click', () => {
        let index = currentCert + 1;
        if (index >= certSlides.length) index = 0;
        goToCert(index);
    });

    // =============================
    // Lightbox Logic
    // =============================
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');

    let lightboxGallery = [];
    let lightboxIndex = 0;
    let lightboxCurrentTitle = '';
    let lightboxCurrentIssuer = '';

    window.openLightbox = function(src, title, issuer) {
        // If src is an array, it's a gallery
        if (Array.isArray(src)) {
            lightboxGallery = src;
        } else {
            lightboxGallery = [src];
        }
        
        lightboxIndex = 0;
        lightboxCurrentTitle = title;
        lightboxCurrentIssuer = issuer;
        
        updateLightboxContent();
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Show/hide nav arrows
        const navs = document.querySelectorAll('.lightbox-nav');
        navs.forEach(nav => nav.style.display = lightboxGallery.length > 1 ? 'flex' : 'none');
    };

    function updateLightboxContent() {
        const currentSrc = lightboxGallery[lightboxIndex];
        const isVideo = currentSrc.toLowerCase().endsWith('.mp4');
        
        if (isVideo) {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = currentSrc;
            lightboxVideo.play();
        } else {
            lightboxVideo.style.display = 'none';
            lightboxVideo.pause();
            lightboxImg.style.display = 'block';
            lightboxImg.src = currentSrc;
        }
        
        updateLightboxCaption();
    }

    window.changeLightboxImage = function(direction) {
        lightboxIndex += direction;
        if (lightboxIndex < 0) lightboxIndex = lightboxGallery.length - 1;
        if (lightboxIndex >= lightboxGallery.length) lightboxIndex = 0;
        
        updateLightboxContent();
    };

    function updateLightboxCaption() {
        let countText = lightboxGallery.length > 1 ? ` <span style="font-size: 0.8rem; opacity: 0.6;">(${lightboxIndex + 1}/${lightboxGallery.length})</span>` : '';
        lightboxCaption.innerHTML = `<h3>${lightboxCurrentTitle}${countText}</h3><p>${lightboxCurrentIssuer}</p>`;
    }

    window.closeLightbox = function() {
        lightbox.classList.remove('active');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        document.body.style.overflow = '';
    };

    // =============================
    // Project Detailed Modal Logic
    // =============================
    const projectModal = document.getElementById('project-modal');
    const modalSliderTrack = document.getElementById('modalSliderTrack');
    const modalDots = document.getElementById('modalDots');
    
    window.projectsData = {
        dataops: {
            title: "Serverless DataOps Architecture & Pipeline Orchestration",
            type: "DataOps / TMT Software",
            date: "Jan 2025 - July 2025",
            desc: "Designed and implemented an end-to-end serverless DataOps architecture on GCP, orchestrating the entire data lifecycle from raw ingestion to final visualization. I engineered automated ETL pipelines using Apache Airflow, Dataflow, and Apache Beam, optimizing BigQuery storage through advanced partitioning. By integrating automated quality gates via Cloud Functions and real-time monitoring, I delivered a resilient, production-ready analytics ecosystem.",
            tags: ["ETL / ELT", "Apache Beam", "Apache Airflow", "Dataflow", "PCollection", "Data Validation", "GCP Storage", "BigQuery", "Pub/Sub", "Monitoring", "GCR", "Cloud Build", "Cloud Run", "Looker Studio"],
            images: [
                "images/pipelinedataops1.png", 
                "images/pipelinedataops255.png", 
                "images/pipelinedataops25.png", 
                "images/pipelinedataops36.png", 
                "images/pipelinedataops2.png", 
                "images/pipelinedataops3.png", 
                "images/pipelinedataops4.png", 
                "images/pipelinedataops7.png", 
                "images/pipelinedataops8.png"
            ],
            links: [{ text: "View Repository", url: "https://github.com/Waelbouaouina/Dataops-PFE", icon: "fab fa-github" }]
        },
        elaco: {
            title: "Co-working Space Reservation Platform",
            type: "Full Stack / ELACO DIGITECH",
            date: "2023",
            desc: "Developed a MERN stack platform (MongoDB, Express, React, Node.js) for remote booking of co-working spaces, focusing on real-time availability of rooms and tables. I used the RESTful API and integrated a NoSQL database layer, later enhancing the project through Docker containerization to ensure environment parity and streamlined deployment workflows.",
            tags: ["MERN", "JWT", "ORM", "MongoDB", "MFA", "Docker", "React", "RESTful API"],
            images: ["images/elaco.jpg"],
            links: [{ text: "Live Demo", url: "https://elaco.org/", icon: "fas fa-external-link-alt" }, { text: "GitHub", url: "https://github.com/Waelbouaouina/MERN-ELACO-APP", icon: "fab fa-github" }]
        }
    };
    
    let modalCurrentSlide = 0;
    
    window.openProjectModal = function(projectId) {
        const data = projectsData[projectId];
        if (!data) return;
        
        document.getElementById('modalTitle').innerText = data.title;
        document.getElementById('modalType').innerText = data.type;
        document.getElementById('modalDate').innerText = data.date;
        document.getElementById('modalDesc').innerText = data.desc;
        
        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
        
        const actionsContainer = document.getElementById('modalActions');
        actionsContainer.innerHTML = data.links.map(link => `
            <a href="${link.url}" target="_blank" class="btn btn-primary" style="padding: 0.8rem 1.5rem; text-decoration: none; color: #000; font-weight: 600;">
                <i class="${link.icon}"></i> ${link.text}
            </a>
        `).join('');
        
        // Generate Slides
        modalSliderTrack.innerHTML = data.images.map(img => `
            <div class="modal-slide">
                <img src="${img}" alt="Project View">
            </div>
        `).join('');
        
        // Generate Dots
        modalDots.innerHTML = data.images.map((_, i) => `
            <div class="modal-dot ${i === 0 ? 'active' : ''}" onclick="goToModalSlide(${i})"></div>
        `).join('');
        
        modalCurrentSlide = 0;
        updateModalSlider();
        
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeProjectModal = function() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    window.goToModalSlide = function(index) {
        const slides = document.querySelectorAll('.modal-slide');
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        modalCurrentSlide = index;
        updateModalSlider();
    };
    
    function updateModalSlider() {
        if (!modalSliderTrack) return;
        modalSliderTrack.style.transform = `translateX(-${modalCurrentSlide * 100}%)`;
        const dots = document.querySelectorAll('.modal-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === modalCurrentSlide);
        });
    }
    
    const mPrev = document.getElementById('modalPrev');
    const mNext = document.getElementById('modalNext');
    if (mPrev) mPrev.addEventListener('click', () => goToModalSlide(modalCurrentSlide - 1));
    if (mNext) mNext.addEventListener('click', () => goToModalSlide(modalCurrentSlide + 1));

    // =============================
    // Language Translation Logic
    // =============================
    const langToggle = document.getElementById('langToggle');
    const langText = document.getElementById('langText');
    let currentLang = 'en';

    const translations = {
        en: {
            nav_about: "About",
            nav_skills: "Skills",
            nav_projects: "Projects",
            nav_experience: "Work Experience",
            nav_certifications: "Certifications",
            nav_contact: "Contact",
            skills_subtitle: "My Daily Toolkit",
            // Education
            edu_esprit_title: "Computer Science Engineering Degree",
            edu_esprit_major: "Major: IT Architecture & Cloud Computing (ARCTIC)",
            edu_esprit_honors: "Graduated with Highest Honors (Très Bien)",
            edu_isamm_title: "Bachelor's Degree",
            edu_isamm_honors: "Higher Institute of Arts and Multimedia of Manouba (ISAMM)",
            hero_subtitle: "DevOps, Cloud & DataOps Engineer",
            hero_title: "Hi, I'm Wael Bouaouina",
            hero_desc: "Specializing in Infrastructure Automation, Scalable Cloud Solutions, and the orchestration of <strong>Data & AI</strong> pipelines to drive intelligent business insights.",
            hero_btn_work: "View My Work",
            hero_btn_contact: "Contact Me",
            section_exp: "Work Experience",
            section_projects: "My Projects",
            section_edu: "Education",
            section_certs: "Certifications",
            quick_contact_title: "Let's Connect",
            quick_contact_desc: "I'm currently exploring new opportunities where I can make an impact. If you have a project in mind, a technical question, or just want to connect over a virtual coffee, feel free to reach out! I'll do my best to get back to you quickly 😄",
            quick_input_placeholder: "Got a question or a project?",
            quick_btn_send: "Send <i class='fas fa-paper-plane'></i>",
            footer_rights: "&copy; 2026 Wael Bouaouina. All rights reserved.",
            lang_toggle: "عربي",
            // Projects
            proj_cloud_title: "End-to-End Private Cloud Infrastructure & Full-Stack Web Deployment",
            proj_cloud_desc: "Building a private OpenStack infrastructure for ESPRIT as a foundation, I followed with the end-to-end development of a Spring Boot and Angular full-stack application. I then successfully orchestrated the migration to Azure (AKS), utilizing Kubernetes and Helm to automate the deployment lifecycle while ensuring mission-critical reliability through advanced Grafana observability.",
            proj_devops_title: "Devops",
            proj_devops_desc: "Building a full-scale CI/CD pipeline to automate the software lifecycle from build to artifact storage via Jenkins and Nexus. I containerized a multi-tier Spring Boot architecture using Docker to ensure environment consistency and seamless service integration. By implementing automated testing and Grafana observability, I established a resilient production workflow focused on high code quality and real-time system health.",
            proj_aws_title: "AWS Deployment of a Containerized Node.js Backend",
            proj_aws_desc: "Developed a Node.js backend integrating MongoDB, Mongo-Express, Redis, Nginx, and PostgreSQL, with each service running in a dedicated Docker container. I configured Docker Compose for service orchestration and volume management to ensure data persistence. Finally, I deployed and managed the entire application on an AWS EC2 instance.",
            proj_dc_title: "Tier IV Data Center Architecture & Design for a Call Center",
            proj_dc_desc: "Designed a Tier IV Data Center architecture, ensuring total fault tolerance and high availability for mission-critical services. I engineered the complete ecosystem—from compute and networking to cooling—in compliance with ANSI/TIA-942 and ISO 27001 standards. By implementing strategic capacity planning and centralized backups, I delivered a highly secure, scalable, and resilient foundation for modern business operations.",
            proj_next_title: "Next.js Web Application & OAuth2 Authentication",
            proj_next_desc: "Developed a web application using Next.js featuring a secure OAuth2 authentication system. I implemented a user profile management module (Name, Contact, Address) and integrated the French Government's Address API to validate user locations with a 50km proximity constraint to Paris. The project was successfully deployed on a cloud platform using Vercel.",
            proj_dataops_title: "Serverless DataOps Architecture & Pipeline Orchestration",
            proj_dataops_desc: "Designed and implemented an end-to-end serverless DataOps architecture on GCP, orchestrating the entire data lifecycle from raw ingestion to final visualization. I engineered automated ETL pipelines using Apache Airflow, Dataflow, and Apache Beam, optimizing BigQuery storage through advanced partitioning. By integrating automated quality gates via Cloud Functions and real-time monitoring, I delivered a resilient, production-ready analytics ecosystem.",
            proj_coworking_title: "Co-working Space Reservation Platform",
            proj_coworking_desc: "Developed a MERN stack platform (MongoDB, Express, React, Node.js) for remote booking of co-working spaces, ensuring a seamless user experience and efficient resource management.",
            // Experience
            exp_saad_title: "IT Systems & Data Operations Engineer",
            exp_saad_desc: "Currently managing a catalog of 7,000+ products. I am engineering the integration between this dashboard and the Inventory Management System (IMS). While full pipeline automation is in progress, the demo currently utilizes manual data ingestion to showcase visual intelligence.",
            exp_saad_status: "<strong>Integration Status:</strong> Managing 7,000+ products. While the automated data pipeline for Inventory Management System (IMS) integration is currently in progress, this demo showcases the platform using manual data ingestion to demonstrate real-time visualization capabilities.",
            exp_tmt_dataops_title: "DataOps Engineer",
            exp_tmt_dataops_desc: "Designed and implemented a Serverless DataOps architecture to automate the orchestration of data pipelines. This project focused on building a scalable, cost-effective infrastructure to streamline data workflows, ensuring high reliability and faster delivery of business insights.",
            exp_tmt_devops_title: "DevOps Engineer",
            exp_tmt_devops_desc: "Automated end-to-end delivery using Azure DevOps pipelines and IaC (Bicep, Terraform). Integrated Selenium testing to ensure high-quality deployments and infrastructure reliability.",
            exp_elaco_title: "Full Stack MERN Developer",
            exp_elaco_desc: "Developed a real-time MERN stack booking platform for co-working spaces. Integrated Docker containerization to streamline deployment workflows and ensure environment consistency."
        },
        ar: {
            nav_about: "من أنا",
            nav_skills: "المهارات",
            nav_projects: "المشاريع",
            nav_experience: "الخبرة المهنية",
            nav_certifications: "الشهادات",
            nav_contact: "اتصل بي",
            skills_subtitle: "أدواتي اليومية",
            hero_subtitle: "مهندس DevOps ، سحابي و DataOps",
            hero_title: "مرحباً، أنا وائل بوعوينة",
            hero_desc: "متخصص في أتمتة البنية التحتية، الحلول السحابية القابلة للتطوير، وتنسيق خطوط أنابيب <strong>البيانات والذكاء الاصطناعي</strong> لاستخلاص رؤى أعمال ذكية.",
            hero_btn_work: "رؤية أعمالي",
            hero_btn_contact: "تواصل معي",
            section_exp: "الخبرة المهنية",
            section_projects: "مشاريعي",
            section_edu: "التعليم",
            section_certs: "الشهادات",
            quick_contact_title: "لنبقَ على تواصل",
            quick_contact_desc: "أنا أبحث حاليًا عن فرص جديدة حيث يمكنني إحداث تأثير. إذا كان لديك مشروع في الاعتبار، أو سؤال تقني، أو تريد فقط التواصل، فلا تتردد في التواصل معي! سأبذل قصارى جهدي للرد عليك بسرعة 😄",
            quick_input_placeholder: "هل لديك سؤال أو مشروع؟",
            quick_btn_send: "إرسال <i class='fas fa-paper-plane'></i>",
            footer_rights: "&copy; 2026 وائل بوعوينة. جميع الحقوق محفوظة.",
            lang_toggle: "English",
            // Projects
            proj_cloud_title: "بنية تحتية للسحابة الخاصة وتطوير الويب المتكامل",
            proj_cloud_desc: "بناء بنية تحتية سحابية خاصة باستخدام OpenStack لجامعة ESPRIT كأساس، متبوعاً بالتطوير الكامل لتطبيق Spring Boot و Angular. ثم قمت بنجاح بتنظيم الانتقال إلى Azure (AKS)، باستخدام Kubernetes و Helm لأتمتة دورة حياة النشر مع ضمان الموثوقية العالية من خلال Grafana.",
            proj_devops_title: "Devops (خط أنابيب CI/CD)",
            proj_devops_desc: "بناء خط أنابيب CI/CD كامل لأتمتة دورة حياة البرمجيات من البناء إلى التخزين عبر Jenkins و Nexus. قمت بحاويات بنية Spring Boot متعددة المستويات باستخدام Docker لضمان اتساق البيئة. ومن خلال تنفيذ الاختبارات المؤتمتة والمراقبة عبر Grafana، أنشأت سير عمل إنتاجي مرن يركز على جودة الكود العالية.",
            proj_aws_title: "نشر خلفية Node.js على AWS باستخدام Docker",
            proj_aws_desc: "تطوير خلفية Node.js تدمج MongoDB و Redis و Nginx و PostgreSQL، مع تشغيل كل خدمة في حاوية Docker مخصصة. قمت بتكوين Docker Compose لتنظيم الخدمات وضمان استمرارية البيانات. وأخيراً، قمت بنشر وإدارة التطبيق بالكامل على مثيل AWS EC2.",
            proj_dc_title: "تصميم بنية مركز بيانات Tier IV لمركز اتصال",
            proj_dc_desc: "تصميم بنية مركز بيانات من المستوى الرابع (Tier IV)، مما يضمن التسامح الكامل مع الأخطاء والتوافر العالي للخدمات الحساسة. قمت بهندسة النظام البيئي الكامل - من الحوسبة والشبكات إلى التبريد - بما يتوافق مع معايير ANSI/TIA-942 و ISO 27001.",
            proj_next_title: "تطبيق ويب Next.js ومصادقة OAuth2",
            proj_next_desc: "تطوير تطبيق ويب باستخدام Next.js يتميز بنظام مصادقة OAuth2 آمن. قمت بتنفيذ وحدة إدارة ملف تعريف المستخدم ودمج واجهة برمجة تطبيقات العناوين للحكومة الفرنسية للتحقق من مواقع المستخدمين مع قيود القرب من باريس.",
            proj_dataops_title: "بنية DataOps بدون خادم وتنسيق خطوط الأنابيب",
            proj_dataops_desc: "تصميم وتنفيذ بنية DataOps بدون خادم على GCP، وتنظيم دورة حياة البيانات بالكامل من الاستيعاب الخام إلى التصور النهائي. قمت بهندسة خطوط أنابيب ETL مؤتمتة باستخدام Airflow و Dataflow و Apache Beam.",
            proj_coworking_title: "منصة حجز مساحات العمل المشتركة",
            proj_coworking_desc: "تطوير منصة باستخدام تقنيات MERN stack (MongoDB, Express, React, Node.js) للحجز عن بُعد لمساحات العمل المشتركة، مع ضمان تجربة مستخدم سلسة وإدارة فعالة للموارد.",
            // Experience
            exp_saad_title: "مهندس أنظمة معلومات وعمليات بيانات",
            exp_saad_desc: "أقوم حالياً بإدارة كتالوج يضم أكثر من 7000 منتج. أعمل على هندسة الربط بين لوحة البيانات هذه ونظام إدارة المخزون (IMS). بينما لا يزال العمل على أتمتة خطوط البيانات جارياً، يعتمد العرض التوضيحي حالياً على إدخال البيانات يدوياً لإبراز قدرات التصور الذكي.",
            exp_saad_status: "<strong>حالة التكامل:</strong> إدارة أكثر من 7000 منتج. بينما لا يزال العمل على أتمتة خطوط البيانات لنظام إدارة المخزون (IMS) جارياً، يعرض هذا العرض التوضيحي المنصة باستخدام إدخال البيانات يدوياً لإظهار قدرات التصور في الوقت الفعلي.",
            exp_tmt_dataops_title: "مهندس DataOps",
            exp_tmt_dataops_desc: "تصميم وتنفيذ بنية DataOps بدون خادم لأتمتة تنظيم خطوط أنابيب البيانات. ركز هذا المشروع على بناء بنية تحتية قابلة للتطوير وفعالة من حيث التكلفة لتبسيط سير عمل البيانات.",
            exp_tmt_devops_title: "مهندس DevOps",
            exp_tmt_devops_desc: "أتمتة التسليم الكامل باستخدام خطوط أنابيب Azure DevOps و IaC (Bicep ، Terraform). دمج اختبار Selenium لضمان عمليات نشر عالية الجودة وموثوقية البنية التحتية.",
            exp_elaco_title: "مطور Full Stack MERN",
            exp_elaco_desc: "تطوير منصة حجز في الوقت الفعلي باستخدام MERN stack لمساحات العمل المشتركة. دمج حاويات Docker لتبسيط سير عمل النشر وضمان اتساق البيئة.",
            // Education
            edu_esprit_title: "شهادة مهندس في علوم الكمبيوتر",
            edu_esprit_major: "التخصص: هندسة تكنولوجيا المعلومات والحوسبة السحابية (ARCTIC)",
            edu_esprit_honors: "تخرج بمرتبة الشرف العالية (Très Bien)",
            edu_isamm_title: "شهادة البكالوريوس",
            edu_isamm_honors: "تخرج بمرتبة الشرف العالية (Très Bien)"
        }
    };

    function updateLanguage(lang) {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update Navbar (legacy selectors if not yet tagged)
        document.querySelector('a[href="#about"]').textContent = translations[lang].nav_about;
        document.querySelector('a[href="#skills"]').textContent = translations[lang].nav_skills;
        document.querySelector('a[href="#projects"]').textContent = translations[lang].nav_projects;
        document.querySelector('a[href="#experience"]').textContent = translations[lang].nav_experience;
        document.querySelector('a[href="#certifications"]').textContent = translations[lang].nav_certifications;
        document.querySelector('a[href="#contact"]').textContent = translations[lang].nav_contact;
        
        // Update Hero
        document.querySelector('.hero-subtitle').textContent = translations[lang].hero_subtitle;
        document.querySelector('.hero-title').textContent = translations[lang].hero_title;
        document.querySelector('.hero-description').innerHTML = translations[lang].hero_desc;
        document.querySelectorAll('.hero-btns .btn')[0].textContent = translations[lang].hero_btn_work;
        document.querySelectorAll('.hero-btns .btn')[1].textContent = translations[lang].hero_btn_contact;
        
        // Quick Contact
        const quickTitle = document.querySelector('.quick-contact-container h2');
        if (quickTitle) quickTitle.textContent = translations[lang].quick_contact_title;
        const quickDesc = document.querySelector('.quick-contact-container p');
        if (quickDesc) quickDesc.textContent = translations[lang].quick_contact_desc;

        langText.textContent = translations[lang].lang_toggle;
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            updateLanguage(currentLang);
        });
    }

    // Escape key safety
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeProjectModal();
        }
    });
});

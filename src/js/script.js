window.aarambhaAnimatorConfig = {
    enableParallax: false,      // Disable parallax
    enableVideoTriggers: false, // Disable video controls
    enableNavbarEffects: false  // Disable navbar animations
};
// VIDEO POPUP FUNCTIONALITY
function openPopup(videoSrc) {
    const popup = document.getElementById("videoPopup");
    const popupVideo = document.getElementById("popupVideo");
    popup.style.display = "flex";
    popupVideo.src = videoSrc;
}

function closePopup() {
    const popup = document.getElementById("videoPopup");
    const popupVideo = document.getElementById("popupVideo");
    popup.style.display = "none";
    popupVideo.pause();
    popupVideo.src = "";
}



// Schedule Tabs
const scheduleData = {
    day1: [
        // {time: '6:30 AM - 7:30 AM', title: 'Sports Activities', location: 'Sports Ground'},
        {time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess'},
        {time: '9:30 AM - 10:45 AM', title: 'Registrations', location: 'Respective Institutes'},
        {time: '11:00 AM - 12:30 PM', title: 'Inaugural Ceremony', location: 'IM Amphitheatre (WebCast in IET Amphitheatre)'},
        {time: '12:30 PM - 1:00 PM', title: 'Aarambh Schedule & Rules Breifing', location: 'IM Amphitheatre (Webcast in IET)'},
        {time: '1:00 PM - 2:30 PM', title: 'LUNCH', location: 'Students Mess'},
        {time: '2:30 PM - 5:00 PM', title: 'Ice Breaking Session  by Manish Freeman and Chetan Kanoongo', location: '006 & 001 Design Studio (Tech Block)'},
        {time: '5:00 PM - 6:00 PM', title: 'SNACKS', location: 'Students Mess'},
        {time: '6:00 PM - 8:00 PM', title: 'JKLU Explorer Challenge', location: 'Various Locations'},
        {time: '8:00 PM - 9:30 PM', title: 'DINNER', location: 'Students Mess'},
        {time: '9:30 PM - 11:00 PM', title: 'Kingdom Game Night & Circle time', location: 'Various Locations'},
        {time: '11:00 PM - 11:30 PM', title: 'Introduction Of Team Aarambh', location: 'IM Amphitheatre'}
    ],
    day2: [
        {time: '6:30 AM - 7:30 AM', title: 'Sports Activities', location: 'Sports Ground'},
        {time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess'},
        {time: '9:30 AM - 10:30 AM', title: 'Introduction of UnConference', location: 'Sabrang Ground'},
        {time: '10:30 AM - 1:00 PM', title: 'Youth UnConference', location: 'Sabrang Ground'},
        {time: '1:00 PM - 2:30 PM', title: 'LUNCH', location: 'Students Mess'},
        {time: '2:30 PM - 5:30 PM', title: 'Strategic Thinking Workshop', location: 'IET Amphitheatre & IM Amphitheatre'},
        {time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess'},
        {time: '6:30 PM - 9:00 PM', title: 'Express Yourself', location: 'LRC Stairs'},
        {time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess'},
        {time: '10:30 PM - 11:30 PM', title: 'DanceVerse by Steppers Squad', location: 'IM Amphitheatre'}
    ],
    day3: [
        {time: '6:30 AM - 7:30 AM', title: 'Sports Activities', location: 'Sports Ground'},
        {time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess'},
        {time: '9:30 AM - 10:00 AM', title: 'Hostel / Anti Ragging Session', location: 'IM Amphitheatre'},
        {time: '10:00 AM - 10:30 AM', title: 'Student Affairs Session', location: 'IET Amphitheatre'},
        {time: '10:30 AM - 11:00 AM', title: 'IT/LRC/Accounts Session', location: 'IM Amphitheatre (Webcast in IET Amphitheatre)'},
        {time: '11:00 AM - 1:30 PM', title: 'Anjali Suneja Session', location: 'IM Amphitheatre'},
        {time: '11:00 AM - 1:30 PM', title: 'Mind Hacks Workshop', location: 'IET Amphitheatre'},
        {time: '1:30 PM - 3:00 PM', title: 'LUNCH', location: 'Students Mess'},
        {time: '3:00 PM - 5:30 PM', title: 'Anjali Suneja Session', location: 'IET Amphitheatre'},
        {time: '3:00 PM - 5:30 PM', title: 'Mind Hacks Workshop', location: 'IM Amphitheatre'},
        {time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess'},
        {time: '6:30 PM - 9:00 PM', title: 'Armaan & Band', location: 'LRC Stairs'},
        {time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess'},
        {time: '10:30 PM - 11:30 PM', title: 'Dumb Drama', location: 'IM Amphitheatre'}
    ],
    day4: [
        {time: '6:30 AM - 7:30 AM', title: 'Sports Activities', location: 'Sports Ground'},
        {time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess'},
        {time: '9:30 AM - 10:15 AM', title: 'Examination Cell Session', location: 'IET Amphitheatre (Webcast in IM Amphitheatre)'},
        {time: '10:15 AM - 10:30 AM', title: 'Administration Session', location: 'IM Amphitheatre (Webcast in IET Amphitheatre)'},
        {time: '10:30 AM - 10:45 AM', title: 'Placement Cell Session', location: 'IM Amphitheatre (Webcast in IET Amphitheatre)'},
        {time: '10:45 AM - 11:00 AM', title: 'Wellness Session', location: 'IM Amphitheatre (Webcast in IET Amphitheatre)'},
        {time: '11:00 AM - 1:30 PM', title: 'Anjali Suneja Session', location: 'IET Amphitheatre'},
        {time: '11:00 AM - 1:30 PM  ', title: 'Pottery Session', location: '006 & 001 Design Studio (Tech Block)'},
        {time: '1:30 PM - 3:00 PM', title: 'LUNCH', location: 'Students Mess'},
        {time: '3:00 PM - 5:30 PM', title: 'Anjali Suneja Session', location: 'IET Amphitheatre'},
        {time: '3:00 PM - 5:30 PM', title: 'Pottery Session', location: '006 & 001 Design Studio (Tech Block)'},
        {time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess'},
        {time: '6:30 PM - 9:00 PM', title: 'Brush & Bond', location: 'Tech Lawn'},
        {time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess'},
        {time: '10:30 PM - 11:30 PM', title: 'Brief about Outing', location: 'IM Amphitheatre'}
    ],
    day5: [
        {time: 'All Day', title: 'Outing Day', location: 'Off Campus'}
    ],
    day6: [
        {time: '6:30 AM - 7:30 AM', title: 'Sports Activities', location: 'Sports Ground'},
        {time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess'},
        {time: '9:30 AM - 12:00 PM', title: 'Workshop on GOAL setting', location: 'IM & IET Amphitheatre'},
        {time: '12:00 PM - 1:30 PM', title: 'Session by Amit Sheth', location: 'IM Amphitheatre'},
        {time: '12:00 PM - 1:30 PM', title: 'Art of Living', location: 'IET Amphitheatre'},
        {time: '1:30 PM - 3:00 PM', title: 'LUNCH', location: 'Students Mess'},
        {time: '3:00 PM - 4:30 PM', title: 'Session by Amit Sheth', location: 'IET Amphitheatre'},
        {time: '3:00 PM - 4:30 PM', title: 'Art of Living', location: 'IET Amphitheatre'},
        {time: '4:30 PM - 5:30 PM', title: 'Session by AIC', location: 'IM & IET Amphitheatre'},
        {time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess'},
        {time: '6:30 PM - 9:00 PM', title: 'JKLU Got Latent', location: 'IM Amphitheatre'},
        {time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess'},
        {time: '10:30 PM', title: 'Movie Night', location: 'New Tech Block (001, 006)'}
    ],
    day7: [
        {time: '6:30 AM - 7:30 AM', title: 'Sports Activities', location: 'Sports Ground'},
        {time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess'},
        {time: '9:30 AM - 11:00 AM', title: 'Session by Amit Sheth', location: 'IM Amphitheatre'},
        {time: '9:30 AM - 11:00 AM', title: 'Workshop on Cyber Security', location: 'IET Amphitheatre'},
        {time: '11:00 AM - 12:30 PM', title: 'Session by Amit Sheth', location: 'IET Amphitheatre'},
        {time: '11:00 AM - 12:30 PM', title: 'Workshop on Cyber Security', location: 'IM Amphitheatre'},
        {time: '12:30 PM - 2:00 PM', title: 'LUNCH', location: 'Students Mess'},
        {time: '2:00 PM - 5:30 PM', title: 'Know your Institute', location: 'Respective Institute'},
        {time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess'},
        {time: '6:30 PM - 9:00 PM', title: 'Sports Activity (Cohort Wise Matches)', location: 'Respective Grounds'},
        {time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess'},
        {time: '10:30 PM - 11:30 PM', title: 'Stories Framed', location: 'IM Amphitheatre'}
    ],
    day8: [
        {time: '6:30 AM - 7:30 AM', title: 'REST', location: 'Hostels'},
        {time: '7:30 AM - 9:00 AM', title: 'Breakfast', location: 'Students Mess'},
        {time: '9:30 AM - 1:00 PM', title: 'Workshop by Manzil Mystics', location: 'IM & IET Amphitheatre'},
        {time: '1:00 PM - 2:30 PM', title: 'Lunch', location: 'Students Mess'},
        {time: '2:30 PM - 4:00 PM', title: 'Visit of Music Bus', location: 'LRC Stairs'},
        {time: '4:00 PM - 6:30 PM', title: 'Performance of Manzil Mystics & Closing Ceremony', location: 'LRC Stairs'},
        {time: '6:30 PM', title: 'Departure of Buses', location: 'JKLU Main Gate'}
    ]
};

function createScheduleHTML(day) {
    const scheduleItems = scheduleData[day];
    if (!scheduleItems) return '';
    
    // Use array join instead of string concatenation
    const htmlParts = scheduleItems.map(item => `
        <div class="schedule-item">
            <div class="time">${item.time}</div>
            <div class="event-details">
                <h3>${item.title}</h3>
                <p>${item.location}</p>
            </div>
        </div>
    `);
    
    return htmlParts.join('');
}

// Initialize schedule tabs when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Initially load day 1 schedule
    const day1Content = document.getElementById('day1');
    if (day1Content) {
        day1Content.innerHTML = createScheduleHTML('day1');
    }
    
    // Tab switching
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const day = this.getAttribute('data-day');
                
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                const tabPane = document.getElementById(day);
                if (!tabPane) {
                    const newPane = document.createElement('div');
                    newPane.id = day;
                    newPane.className = 'tab-pane active';
                    newPane.innerHTML = createScheduleHTML(day);
                    document.querySelector('.tab-content').appendChild(newPane);
                } else {
                    tabPane.classList.add('active');
                    if (tabPane.innerHTML.trim() === '') {
                        tabPane.innerHTML = createScheduleHTML(day);
                    }
                }
            });
        });
    }

   // Optimized gallery initialization - use DocumentFragment
function initializeGallery() {
    const gallery = document.querySelector(".gallery-grid");
    if (gallery) {
        const images = Array.from(gallery.children);
        const fragment = document.createDocumentFragment();
        
        images.forEach((img) => {
            const clone = img.cloneNode(true);
            fragment.appendChild(clone);
        });
        
        // Single DOM append instead of multiple
        gallery.appendChild(fragment);
    }
}

// Debounced tab switching to prevent rapid fire events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to tab switching
const debouncedTabSwitch = debounce(function(day) {
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    let tabPane = document.getElementById(day);
    if (!tabPane) {
        tabPane = document.createElement('div');
        tabPane.id = day;
        tabPane.className = 'tab-pane active';
        tabPane.innerHTML = createScheduleHTML(day);
        document.querySelector('.tab-content').appendChild(tabPane);
    } else {
        tabPane.classList.add('active');
        if (tabPane.innerHTML.trim() === '') {
            tabPane.innerHTML = createScheduleHTML(day);
        }
    }
}, 100);



    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Utility functions
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 500);
});


// // Countdown timer
// function updateCountdown() {
//     const targetDate = new Date('July 25, 2025 00:00:00').getTime();

//     const updateTimer = () => {
//         const now = new Date().getTime();
//         const distance = targetDate - now;

//         const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//         const daysEl = document.getElementById('days');
//         const hoursEl = document.getElementById('hours');
//         const minutesEl = document.getElementById('minutes');
//         const secondsEl = document.getElementById('seconds');

//         if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
//         if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
//         if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
//         if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

//         if (distance < 0) {
//             clearInterval(timerInterval);
//             const countdown = document.querySelector('.countdown');
//             if (countdown) {
//                 countdown.innerHTML = '<h2>Event Started!</h2>';
//             }
//         }
//     };

//     updateTimer();
//     const timerInterval = setInterval(updateTimer, 1000);
// }

// updateCountdown();


  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    const heroHeight = document.getElementById("hero-section")?.offsetHeight || 100;

    if (window.scrollY > heroHeight - 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

// Replace all your scroll listeners with this single optimized version
let ticking = false;

function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Navbar scrolled effect
            const navbar = document.querySelector(".navbar");
            const heroHeight = document.getElementById("hero-section")?.offsetHeight || 100;
            
            if (window.scrollY > heroHeight - 50) {
                navbar?.classList.add("scrolled");
            } else {
                navbar?.classList.remove("scrolled");
            }

            // Back to top button
            const backToTopButton = document.getElementById('backToTop');
            if (backToTopButton) {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.add('show');
                } else {
                    backToTopButton.classList.remove('show');
                }
            }

            ticking = false;
        });
        ticking = true;
    }
}

// Single scroll listener with passive option for better performance
window.addEventListener('scroll', handleScroll, { passive: true });

//   mobile navigation toggle
     function toggleDropdown() {
            const dropdown = document.getElementById('dropdownMenu');
            // Add null check
            if (!dropdown) return;
            dropdown.classList.toggle('show');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('dropdownMenu');
            const menuButton = event.target.closest('.menu-button');
            
            // Add null check
            if (!dropdown) return;
            
            if (!menuButton && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });

        // Close dropdown when clicking on a dropdown link
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', function() {
                document.getElementById('dropdownMenu').classList.remove('show');
            });
        });


function toggleFaq(element) {
        const answer = element.nextElementSibling;
        const toggle = element.querySelector('.faq-toggle');

        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            answer.style.padding = '0 25px';
            toggle.textContent = '+';
            element.classList.remove('active');
        } else {
            // Close all other open FAQ answers
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer && item.style.maxHeight) {
                    item.style.maxHeight = null;
                    item.style.padding = '0 25px';
                    item.previousElementSibling.querySelector('.faq-toggle').textContent = '+';
                    item.previousElementSibling.classList.remove('active');
                }
            });

            answer.style.maxHeight = answer.scrollHeight + 30 + "px"; // Add padding
            answer.style.padding = '0 25px 15px'; // Adjust padding after opening
            toggle.textContent = 'x';
            element.classList.add('active');
        }
    }
    // Consolidate all intersection observers into one
function initOptimizedObservers() {
    // Single observer for all scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Handle different types of elements
                if (target.classList.contains('fade-in-element')) {
                    target.classList.add('fade-in-visible');
                }
                
                // Handle lazy loading
                if (target.tagName === 'IMG' && target.dataset.src) {
                    loadImage(target);
                }
                
                if (target.tagName === 'VIDEO' && target.dataset.src) {
                    loadVideo(target);
                }
                
                // Unobserve after activation to improve performance
                observer.unobserve(target);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // Observe all relevant elements
    const elementsToObserve = document.querySelectorAll(`
        .fade-in-element,
        img[data-src],
        video[data-src],
        section,
        .content-section,
        .card,
        .schedule-item
    `);
    
    elementsToObserve.forEach(el => observer.observe(el));
}

// Optimized image loading
function loadImage(img) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease-in-out';
    
    const src = img.dataset.src || img.src;
    const newImg = new Image();
    
    newImg.onload = function() {
        img.src = src;
        img.style.opacity = '1';
        img.classList.add('loaded');
    };
    
    newImg.onerror = function() {
        img.style.opacity = '0.5';
        img.classList.add('error');
    };
    
    newImg.src = src;
}

// Optimized video loading
function loadVideo(video) {
    video.style.opacity = '0';
    video.style.transition = 'opacity 0.8s ease-in-out';
    
    video.src = video.dataset.src;
    video.addEventListener('loadeddata', function() {
        video.style.opacity = '1';
    }, { once: true });
    
    video.load();
}   

    function updateProgress() {
        const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const checkedCount = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
        const totalCount = checkboxes.length;
        const progress = (checkedCount / totalCount) * 100;

        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (progressFill && progressText) {
            progressFill.style.width = progress + '%';
            progressText.textContent = `${Math.round(progress)}% Complete (${checkedCount}/${totalCount} items checked)`;
        }
    }

    // Initial call to set the correct progress on page load
    document.addEventListener('DOMContentLoaded', updateProgress);

    // Basic search functionality for FAQ
    document.getElementById('searchInput').addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question span:first-child').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();

            if (question.includes(searchValue) || answer.includes(searchValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Download Checklist (Placeholder for actual PDF generation)
    function downloadChecklist() {
        alert('Download PDF functionality is a placeholder. You would typically generate a PDF from the checklist items here.');
        // In a real application, you would use a library like jsPDF or send data to a backend to generate a PDF.
    }



// Parallax effect for logo

  const logo = document.querySelector('.logo-image');

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20; // range -10 to +10
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    logo.style.transform = `translate(${x}px, ${y}px)`;
  });

//   custom cursor effect
const cursor = document.querySelector('.cursor-object');

document.addEventListener('mousemove', (e) => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

// Optional click effect
document.addEventListener('mousedown', () => {
  cursor.classList.add('clicked');
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('clicked');
});


// loading animation and progress bar
document.addEventListener('DOMContentLoaded', function () {
    const loadingSection = document.getElementById('loadingSection');
    const loadingVideo = document.getElementById('loadingVideo');
    const skipButton = document.getElementById('skipButton');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const mainContent = document.querySelector('.Main-content');

    let progressInterval;
    let currentProgress = 0;
    let videoStarted = false;
    let loadingComplete = false;
    loadingVideo.muted = true;
    loadingVideo.playsInline = true;
    loadingVideo.play().catch(fallbackToProgressBar);
    const VIDEO_DURATION = 15 * 1000; // 15 seconds
    const PROGRESS_INTERVAL_TIME = VIDEO_DURATION / 100; // 150ms per %

    // Initial state
    loadingSection.style.display = 'block';
    if (mainContent) {
        mainContent.style.display = 'none';
    }

    // Progress bar logic
    function startProgressBar() {
        if (progressInterval) return;

        progressInterval = setInterval(() => {
            if (currentProgress < 100) {
                currentProgress++;
                progressFill.style.width = `${currentProgress}%`;
                loadingPercentage.textContent = `${currentProgress}%`;
            } else {
                clearInterval(progressInterval);
                completeLoading();
            }
        }, PROGRESS_INTERVAL_TIME);
    }

    // Transition to main content
    function completeLoading() {
        if (loadingComplete) return;
        loadingComplete = true;

        loadingSection.style.transition = 'opacity 0.5s ease-out';
        loadingSection.style.opacity = '0';

        setTimeout(() => {
            loadingSection.style.display = 'none';
            if (mainContent) {
                mainContent.style.display = 'block';
                mainContent.style.opacity = '0';
                mainContent.style.transition = 'opacity 0.5s ease-in';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                }, 10);
            }
        }, 500);
    }

    // Video event handlers
    loadingVideo.addEventListener('playing', () => {
        if (!videoStarted) {
            videoStarted = true;
            startProgressBar();
        }
    });

    loadingVideo.addEventListener('ended', () => {
        if (!loadingComplete) {
            currentProgress = 100;
            progressFill.style.width = '100%';
            loadingPercentage.textContent = '100%';
            clearInterval(progressInterval);
            setTimeout(completeLoading, 500);
        }
    });

    loadingVideo.addEventListener('error', (e) => {
        console.error('Video loading error:', e);
        fallbackToProgressBar();
    });

    skipButton.addEventListener('click', () => {
        if (progressInterval) clearInterval(progressInterval);
        completeLoading();
    });

    function fallbackToProgressBar() {
        if (!videoStarted) {
            console.warn('Falling back to progress bar...');
            videoStarted = true;
            startProgressBar();
        }
    }

    // Force progress bar after 5s if video doesn't autoplay
    setTimeout(fallbackToProgressBar, 5000);

    // Autoplay video (required for GitHub Pages where user interaction may not exist)
    loadingVideo.muted = true;
    loadingVideo.playsInline = true;
    const playPromise = loadingVideo.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Autoplay started');
            })
            .catch((error) => {
                console.warn('Autoplay blocked, using fallback:', error);
                fallbackToProgressBar();
            });
    }
});

// SMOOTH SCROLLING ENHANCEMENT
function initSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced smooth scroll for navigation
    const navLinks = document.querySelectorAll('.nav-link, .navbar a, .menu-item a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// SMOOTH MEDIA LOADING WITH LAZY LOADING
function initSmoothMediaLoading() {
    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src || img.src;
                
                // Add loading animation
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease-in-out';
                
                const newImg = new Image();
                newImg.onload = function() {
                    img.src = src;
                    img.style.opacity = '1';
                    img.classList.add('loaded');
                };
                newImg.onerror = function() {
                    img.style.opacity = '0.5';
                    img.classList.add('error');
                };
                newImg.src = src;
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // Observe all images
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
            imageObserver.observe(img);
        }
    });

    // Lazy loading for videos
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.style.opacity = '0';
                    video.style.transition = 'opacity 0.8s ease-in-out';
                    
                    video.addEventListener('loadeddata', function() {
                        video.style.opacity = '1';
                    });
                    
                    video.load();
                }
                observer.unobserve(video);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.1
    });

    // Observe all videos
    document.querySelectorAll('video').forEach(video => {
        videoObserver.observe(video);
    });
}

// SMOOTH PAGE TRANSITIONS
function initSmoothPageTransitions() {
    // Add smooth fade-in for page sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    // Add fade-in class to sections
    document.querySelectorAll('section, .content-section, .card, .schedule-item').forEach(section => {
        section.classList.add('fade-in-element');
        sectionObserver.observe(section);
    });
}

// SMOOTH SCROLL MOMENTUM (for better mobile experience)
function initScrollMomentum() {
    // Add smooth scrolling momentum for iOS
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Custom smooth scroll for better control
    let isScrolling = false;
    let scrollEndTimer = null;

    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            document.body.classList.add('is-scrolling');
            isScrolling = true;
        }

        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(function() {
            document.body.classList.remove('is-scrolling');
            isScrolling = false;
        }, 150);
    }, { passive: true });
}

// PRELOAD CRITICAL MEDIA
function preloadCriticalMedia() {
    // Preload images that are likely to be viewed first
    const criticalImages = document.querySelectorAll('img[data-priority="high"], .hero img, .banner img');
    criticalImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src || img.dataset.src;
        document.head.appendChild(link);
    });

    // Preload critical videos
    const criticalVideos = document.querySelectorAll('video[data-priority="high"], .hero video');
    criticalVideos.forEach(video => {
        if (video.src || video.dataset.src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = video.src || video.dataset.src;
            document.head.appendChild(link);
        }
    });
}

// SMOOTH ANIMATION HELPERS
function addSmoothAnimations() {
    // Add CSS for smooth animations
    const style = document.createElement('style');
    style.textContent = `
        html {
            scroll-behavior: smooth;
        }
        
        .fade-in-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .is-scrolling * {
            pointer-events: none;
        }
        
        img {
            transition: opacity 0.3s ease-in-out;
        }
        
        img.loaded {
            opacity: 1;
        }
        
        img.error {
            opacity: 0.5;
            filter: grayscale(100%);
        }
        
        /* Smooth hover effects */
        a, button, .clickable {
            transition: all 0.3s ease;
        }
        
        /* Smooth focus states */
        *:focus {
            outline: 2px solid #007bff;
            outline-offset: 2px;
            transition: outline 0.2s ease;
        }
        
        /* Mobile scroll improvements */
        body {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
        }
        
        /* Loading spinner for media */
        .media-loading {
            position: relative;
        }
        
        .media-loading::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-radius: 50%;
            border-top: 2px solid #3498db;
            animation: spin 1s linear infinite;
            transform: translate(-50%, -50%);
            z-index: 1;
        }
        
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// OPTIMIZED SCROLL LISTENER
function initOptimizedScrolling() {
    let ticking = false;

    function updateScrollEffects() {
        // Your existing scroll effects here
        const navbar = document.querySelector(".navbar");
        const heroHeight = document.getElementById("hero-section")?.offsetHeight || 100;

        if (window.scrollY > heroHeight - 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }

        // Back to top button
        const backToTopButton = document.getElementById('backToTop');
        if (backToTopButton) {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }

        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// INITIALIZE ALL SMOOTH ENHANCEMENTS
function initAllSmoothEnhancements() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initAllSmoothEnhancements, 100);
        });
        return;
    }

    // Initialize all smooth features
    addSmoothAnimations();
    preloadCriticalMedia();
    initSmoothScrolling();
    initSmoothMediaLoading();
    initSmoothPageTransitions();
    initScrollMomentum();
    initOptimizedScrolling();

    console.log('✅ Smooth enhancements initialized');
}

// AUTO-INITIALIZE
initAllSmoothEnhancements();


   // Simple animation trigger on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Add a small delay then activate all animations
            setTimeout(() => {
                const elements = document.querySelectorAll('.speakers-reveal');
                elements.forEach(element => {
                    element.classList.add('active');
                });
            }, 300);
        });

        // Optional: Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.speakers-reveal').forEach(el => {
            observer.observe(el);
        });




// mobile nav 
    const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('overlay');

        function toggleMenu() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when clicking on a nav link
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
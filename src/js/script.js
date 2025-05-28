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
        {time: '9:00 AM - 10:30 AM', title: 'Registration & Welcome Kit Distribution', location: 'Main Auditorium'},
        {time: '11:00 AM - 12:30 PM', title: 'Inaugural Ceremony', location: 'Main Auditorium'},
        {time: '1:30 PM - 2:30 PM', title: 'Lunch Break', location: 'University Cafeteria'},
        {time: '3:00 PM - 5:00 PM', title: 'Ice Breaking Sessions', location: 'Department-wise Activity Areas'}
    ],
    day2: [
        {time: '9:30 AM - 11:00 AM', title: 'University Tour', location: 'Campus Grounds'},
        {time: '11:30 AM - 1:00 PM', title: 'Department Introduction', location: 'Respective Departments'},
        {time: '1:00 PM - 2:00 PM', title: 'Lunch Break', location: 'University Cafeteria'},
        {time: '2:30 PM - 4:30 PM', title: 'Industry Expert Talk', location: 'Seminar Hall'},
        {time: '5:00 PM - 7:00 PM', title: 'Cultural Activities', location: 'Central Lawn'}
    ],
    day3: [
        {time: '9:30 AM - 11:30 AM', title: 'Workshop: Career Planning', location: 'Lecture Hall 1'},
        {time: '12:00 PM - 1:30 PM', title: 'Alumni Interaction', location: 'Seminar Hall'},
        {time: '1:30 PM - 2:30 PM', title: 'Lunch Break', location: 'University Cafeteria'},
        {time: '3:00 PM - 6:00 PM', title: 'Sports & Games', location: 'Sports Complex'}
    ],
    day4: [
        {time: '9:30 AM - 12:30 PM', title: 'Technical Workshop', location: 'Computer Labs'},
        {time: '12:30 PM - 1:30 PM', title: 'Lunch Break', location: 'University Cafeteria'},
        {time: '2:00 PM - 4:00 PM', title: 'Entrepreneurship Session', location: 'E-Cell Hub'},
        {time: '4:30 PM - 6:30 PM', title: 'Talent Hunt Preliminaries', location: 'Auditorium'}
    ],
    day5: [
        {time: '10:00 AM - 12:00 PM', title: 'Motivational Talk', location: 'Main Auditorium'},
        {time: '12:30 PM - 1:30 PM', title: 'Lunch Break', location: 'University Cafeteria'},
        {time: '2:00 PM - 5:00 PM', title: 'Cultural Night & Talent Hunt Finals', location: 'Main Auditorium'},
        {time: '5:30 PM - 7:00 PM', title: 'Closing Ceremony', location: 'Main Auditorium'}
    ]
};

function createScheduleHTML(day) {
    const scheduleItems = scheduleData[day];
    let html = '';
    
    scheduleItems.forEach(item => {
        html += `
            <div class="schedule-item">
                <div class="time">${item.time}</div>
                <div class="event-details">
                    <h3>${item.title}</h3>
                    <p>${item.location}</p>
                </div>
            </div>
        `;
    });
    
    return html;
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

    // Gallery initialization
    const gallery = document.querySelector(".gallery-grid");
    if (gallery) {
        const images = Array.from(gallery.children);
        images.forEach((img) => {
            const clone = img.cloneNode(true);
            gallery.appendChild(clone);
        });
    }



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


// Countdown timer
function updateCountdown() {
    const targetDate = new Date('July 25, 2025 00:00:00').getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(timerInterval);
            const countdown = document.querySelector('.countdown');
            if (countdown) {
                countdown.innerHTML = '<h2>Event Started!</h2>';
            }
        }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

updateCountdown();


  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    const heroHeight = document.getElementById("hero-section")?.offsetHeight || 100;

    if (window.scrollY > heroHeight - 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });


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
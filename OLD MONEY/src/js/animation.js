  // Particle System
        function createParticles() {
            const container = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                const isStart = Math.random() > 0.7;
                
                particle.className = isStart ? 'particle star' : 'particle';
                
                // Random size
                const size = Math.random() * 4 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Random position
                particle.style.left = Math.random() * 100 + '%';
                
                // Random animation delay and duration
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                
                container.appendChild(particle);
            }
        }

        // Lock Click Animation
        function handleLockClick() {
            const lockContainer = document.getElementById('lockContainer');
            const keyAnimation = document.getElementById('keyAnimation');
            const messageContainer = document.getElementById('messageContainer');

            // Add shaking animation
            lockContainer.classList.add('shaking');
            
            // Show key animation
            keyAnimation.classList.add('active');
            
            // Show message after delay
            setTimeout(() => {
                messageContainer.classList.add('show');
            }, 1000);

            // Remove shaking after animation
            setTimeout(() => {
                lockContainer.classList.remove('shaking');
                keyAnimation.classList.remove('active');
            }, 2000);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            
            const lockContainer = document.getElementById('lockContainer');
            lockContainer.addEventListener('click', handleLockClick);
            
            // Auto-show message after 3 seconds
            setTimeout(() => {
                document.getElementById('messageContainer').classList.add('show');
            }, 3000);
        });
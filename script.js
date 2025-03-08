
window.addEventListener('load', function() {
    // Check if the sessionStorage indicates the animation has already played
    if (!sessionStorage.getItem('animationPlayed')) {
        // Run the GSAP animation
        var tl = gsap.timeline();
        tl.from(".line h1", {
            y: 150,
            stagger: 0.25,
            duration: 0.6,
            delay: 0.5
        });
        tl.from("#line1-part1, .line h2", {
            opacity: 0,
            onStart: function() {
                var h5timer = document.querySelector("#line1-part1 h5");
                var grow = 0;
                var timerInterval = setInterval(function() {
                    if (grow < 100) {
                        h5timer.innerHTML = grow++;
                    } else {
                        clearInterval(timerInterval);
                    }
                }, 35);
            }
        });

        tl.to("#loader", {
            opacity: 0,
            duration: 0.4,
            delay: 3.9,
            onComplete: function() {
                // Hide the loader after animation completes
                document.getElementById('loader').style.display = 'none';
            }
        });
        tl.from(".section-hero", {
            delay: 0.2,
            y: 1200,
            opacity: 0,
            onComplete: function() {
                // Make sure the navbar and three-line button have proper z-index
                document.querySelector('.navbar').style.zIndex = '1000'; // Ensure the navbar is on top
            }
        });

        // Set the flag in sessionStorage to indicate the animation has played
        sessionStorage.setItem('animationPlayed', 'true');
    } else {
        // If the animation has already played, hide the loader immediately
        document.getElementById('loader').style.display = 'none';
        // Ensure the navbar has proper z-index in case the page is loaded without the animation
        document.querySelector('.navbar').style.zIndex = '1000';
    }
});

function toggleMenu() {
    const menuContainer = document.querySelector('.menu-container');
    menuContainer.classList.toggle('active');
}



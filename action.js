document.addEventListener('DOMContentLoaded', function() {
    // Generate RSVP form
    const rsvpSection = document.getElementById('rsvp-form');
    
    const rsvpForm = document.createElement('form');
    rsvpForm.innerHTML = `
        <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label>Will you be attending?</label>
            <div class="radio-group">
                <input type="radio" id="attending-yes" name="attending" value="yes" required>
                <label for="attending-yes">Yes</label>
                <input type="radio" id="attending-no" name="attending" value="no">
                <label for="attending-no">No</label>
            </div>
        </div>
        <div class="form-group">
            <label for="guests">Number of Guests</label>
            <input type="number" id="guests" name="guests" min="0" value="0">
        </div>
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="4"></textarea>
        </div>
        <button type="submit">Submit</button>
    `;
    
    rsvpSection.appendChild(rsvpForm);
    
    // Form submission handler
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Display message on form submission
        const formData = new FormData(rsvpForm);
        let responseMessage = document.createElement('div');
        responseMessage.className = 'response-message';
        responseMessage.innerHTML = `
            <h3>Thank you, ${formData.get('name')}!</h3>
            <p>We have received your RSVP.</p>
        `;
        
        rsvpForm.style.display = 'none';
        rsvpSection.appendChild(responseMessage);
        
        // Here you would typically send data to an external service
        // Example: Using Formspree
        // fetch("https://formspree.io/f/yourFormspreeID", { method: "POST", body: formData });
    });
    
    // Add countdown timer
    const welcomeSection = document.getElementById('welcome');
    
    const countdownDiv = document.createElement('div');
    countdownDiv.className = 'countdown';
    countdownDiv.innerHTML = '<h3>Countdown to our wedding:</h3><div id="timer"></div>';
    welcomeSection.appendChild(countdownDiv);
    
    // Countdown functionality
    const weddingDate = new Date('2025-06-01T14:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;
        
        if (diff <= 0) {
            document.getElementById('timer').innerHTML = "It's our wedding day!";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('timer').innerHTML = `
            <span>${days} days</span> 
            <span>${hours} hours</span> 
            <span>${minutes} minutes</span> 
            <span>${seconds} seconds</span>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
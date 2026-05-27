// Configuration for John Blackmar's website
const config = {
    // Set this to the URL of your PHP contact form handler
    // For example: 'https://yourdomain.com/contact.php'
    // Leave empty for static hosting without backend
    contactPhpUrl: '',
    
    // Analytics ID (if using Google Analytics)
    analyticsId: '',
    
    // Social media links
    socialLinks: {
        linkedin: 'https://linkedin.com/in/johnblackmar',
        github: 'https://github.com/johnblackmar'
    }
};

// Make contactPhpUrl available globally for the form handler
if (config.contactPhpUrl) {
    const contactPhpUrl = config.contactPhpUrl;
} 
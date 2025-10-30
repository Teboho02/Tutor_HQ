import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationLink } from '../types';
import './Contact.css';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'About', href: '/about' },
        { label: 'Tutors', href: '/tutors' },
        { label: 'Contact', href: '/contact' },
    ]; const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create mailto link with form data
        const mailtoLink = `mailto:info@tutorhq.co.za?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        // Open default email client
        window.location.href = mailtoLink;

        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
        });

        alert('Thank you for your message! Your default email client will open.');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="contact-page">
            <Header navigationLinks={navigationLinks} />

            <section className="contact-hero">
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                </div>
            </section>

            <section className="contact-content">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h2>Contact Information</h2>
                            <p className="contact-intro">
                                Have questions? We're here to help. Reach out to us through any of the following channels.
                            </p>

                            <div className="contact-methods">
                                <div className="contact-method">
                                    <span className="method-icon">📧</span>
                                    <div>
                                        <h3>Email</h3>
                                        <p>info@tutorhq.co.za</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <span className="method-icon">📞</span>
                                    <div>
                                        <h3>Phone</h3>
                                        <p>+27 78 600-7737</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <span className="method-icon">📍</span>
                                    <div>
                                        <h3>Address</h3>
                                        <p>28 Wits St<br />Braam City</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <span className="method-icon">⏰</span>
                                    <div>
                                        <h3>Business Hours</h3>
                                        <p>Mon-Fri: 8:00 AM - 8:00 PM<br />Sat-Sun: 10:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-container">
                            <h2>Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
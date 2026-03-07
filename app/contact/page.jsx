'use client';

import { useState } from 'react';
import { createPublicClient } from '@/lib/supabase/public';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    const supabase = createPublicClient();
    const { error } = await supabase.from('contact_submissions').insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      subject: formData.subject.trim(),
      message: formData.message.trim()
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      return;
    }

    setSubmitStatus('success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    setTimeout(() => {
      setSubmitStatus(null);
    }, 5000);
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'EMAIL',
      content: 'retrolouve@gmail.com',
      link: 'mailto:retrolouve@gmail.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'PHONE',
      content: '+91 96507 30525',
      link: 'tel:+919650730525'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'ADDRESS',
      content: 'Delhi, India',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Black Background */}
      <div className="bg-black min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh] justify-center flex items-center pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-wide">
              CONTACT US
            </h1>
            <p className="text-base sm:text-lg text-gray-300 tracking-wide leading-relaxed">
              We&apos;d love to hear from you. Get in touch with us and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <section className="bg-white py-12 sm:py-16 -mt-12 sm:-mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 p-6 sm:p-8 hover:border-brand transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-brand/10 group-hover:bg-brand flex items-center justify-center mb-4 transition-colors">
                  <div className="text-brand group-hover:text-white transition-colors">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide uppercase">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-xs sm:text-sm text-gray-600 hover:text-brand transition-colors block"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {info.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Side - Info */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-wide">
                SEND US A MESSAGE
              </h2>
              <div className="w-20 h-1 bg-brand mb-6"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
                Have a question or feedback? Fill out the form and we&apos;ll get back to you within 24 hours. 
                We&apos;re here to help!
              </p>

              {/* Social Media */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-wide uppercase">
                  FOLLOW US
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/retrolouve?igsh=MTlsZDB2emlkMnllcA%3D%3D"
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-brand flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white p-6 sm:p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                    <p className="font-medium">Thank you for your message!</p>
                    <p className="text-xs mt-1">We&apos;ll get back to you soon.</p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    <p className="font-medium">Something went wrong.</p>
                    <p className="text-xs mt-1">{errorMessage}</p>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs tracking-wider text-gray-900 mb-2 uppercase font-semibold"
                  >
                    NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs tracking-wider text-gray-900 mb-2 uppercase font-semibold"
                  >
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs tracking-wider text-gray-900 mb-2 uppercase font-semibold"
                  >
                    PHONE
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                    placeholder="+91 96507 30525"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs tracking-wider text-gray-900 mb-2 uppercase font-semibold"
                  >
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs tracking-wider text-gray-900 mb-2 uppercase font-semibold"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand text-white text-sm tracking-wider font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: 'success' | 'error' | null; message?: string }>({ type: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null });
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: form
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setStatus({ type: 'success', message: 'Message sent! We will contact you soon.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Visit Our Store
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Come and experience the authentic taste of our fresh sweets. We're always happy to help you find the perfect treats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Address</h3>
            <button 
              onClick={() => window.open('https://www.google.com/maps/search/Milk%20Man%20Dairy%20Sweet%20and%20Bakery/@28.49442128,77.14462781,17z?hl=en', '_blank')}
              className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer group"
            >
              <p className="group-hover:underline">
              Milk man dairy Sweet and bakery Ghitorni <br/>main market near sbi atm<br/>
                New Delhi, Delhi<br />
                India
              </p>
              <p className="text-sm text-orange-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to open in Google Maps →
              </p>
            </button>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">
              +91 98765 43210<br />
              +91 87654 32109
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hours</h3>
            <p className="text-gray-600">
               Everyday :9:00 AM - 9:00 PM
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">
            caremilkman@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              {status.type && (
                <div className={`mb-4 rounded-lg p-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {status.message}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us?</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-orange-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">Fresh sweets made daily with premium ingredients</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-orange-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">Traditional recipes passed down through generations</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-orange-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">Custom orders for special occasions and festivals</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-orange-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">Fast delivery and excellent customer service</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
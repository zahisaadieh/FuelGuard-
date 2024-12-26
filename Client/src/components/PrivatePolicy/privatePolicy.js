import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Privacy Policy</h1>

        <p className="mb-6 text-gray-500 text-center">
          <strong className="text-gray-700">Effective Date:</strong> June 2024
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to <strong className="text-blue-600">FuelGuard</strong>. We are committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-3 pl-4">
            <li>
              <strong className="text-gray-800">Personal Information:</strong> Name, email, phone number, delivery address, and payment info.
            </li>
            <li>
              <strong className="text-gray-800">Account Information:</strong> Email and password.
            </li>
            <li>
              <strong className="text-gray-800">Order Information:</strong> Details of your fuel orders.
            </li>
            <li>
              <strong className="text-gray-800">Technical Information:</strong> IP address, device info, and browser details.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use your information for order processing, customer support, account management, service improvements, and marketing communications (with your consent).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement encryption, access controls, and regular updates to protect your personal data from unauthorized access and breaches.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">5. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed">
            You have the right to access, correct, delete, or withdraw consent for your data. Contact us at{' '}
            <a href="mailto:Fuelguard@example.com" className="text-blue-500 hover:underline">
              Fuelguard@example.com
            </a>{' '}
            to exercise your rights.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">6. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this policy periodically. Please review it regularly for changes. Continued use of our services indicates your acceptance of any updates.
          </p>
        </section>

        <div className="text-center mt-10">
          <p className="text-gray-400">&copy; 2024 <span className="text-gray-700 font-medium">FuelGuard</span>. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;

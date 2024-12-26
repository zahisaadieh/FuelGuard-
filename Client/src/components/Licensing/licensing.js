import React from 'react';

function Licensing() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Licensing</h1>

        <p className="mb-6 text-gray-500 text-center">
          <strong className="text-gray-700">Effective Date:</strong> June 2024
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. License Agreement</h2>
          <p className="text-gray-600 leading-relaxed">
            By using the <strong className="text-blue-600">FuelGuard</strong> platform, you agree to the terms of this license. This software and content are provided for use in accordance with the terms set forth below.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Permitted Use</h2>
          <p className="text-gray-600 leading-relaxed">
            You are permitted to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-3 pl-4 mt-3">
            <li>Use the platform to manage fuel orders and related services.</li>
            <li>Access and interact with the platform’s features as intended.</li>
            <li>Download and use the platform's content for personal or business purposes related to fuel management.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. Restrictions</h2>
          <p className="text-gray-600 leading-relaxed">
            You may not:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-3 pl-4 mt-3">
            <li>Modify, distribute, or resell the platform’s content or code without prior permission.</li>
            <li>Use the platform for any unlawful activities.</li>
            <li>Attempt to reverse-engineer, decompile, or extract the source code.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Ownership</h2>
          <p className="text-gray-600 leading-relaxed">
            All content, trademarks, and intellectual property on <strong className="text-blue-600">FuelGuard</strong> are owned by FuelGuard and protected by applicable laws.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">5. Disclaimer</h2>
          <p className="text-gray-600 leading-relaxed">
            The platform is provided “as is” without any warranties. FuelGuard is not liable for any damages arising from the use of this platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">6. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about this licensing agreement, please contact us at{' '}
            <a href="mailto:Fuelguard@example.com" className="text-blue-500 hover:underline">
              Fuelguard@example.com
            </a>.
          </p>
        </section>

        <div className="text-center mt-10">
          <p className="text-gray-400">&copy; 2024 <span className="text-gray-700 font-medium">FuelGuard</span>. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Licensing;

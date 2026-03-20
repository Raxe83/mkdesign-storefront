'use client'

import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6">Seite nicht gefunden</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">Die gesuchte Seite existiert leider nicht.</p>
      <Link
        href="/"
        className="bg-accent text-white px-6 py-3 rounded-md font-medium  transition-colors"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
};

export default NotFoundPage;

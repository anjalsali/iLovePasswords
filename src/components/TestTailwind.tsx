import React from "react";

const TestTailwind: React.FC = () => {
   return (
      <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
         <h1 className="text-2xl font-bold mb-4">Tailwind Test</h1>
         <p className="text-lg">If you can see this styled properly, Tailwind is working!</p>
         <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">Test Button</button>
      </div>
   );
};

export default TestTailwind;

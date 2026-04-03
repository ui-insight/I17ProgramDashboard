function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {"{{PROJECT_NAME}}"}
        </h1>
        <p className="text-lg text-gray-600">
          Built from the UI-Insight TEMPLATE-app
        </p>
      </div>
    </div>
  );
}

export default HomePage;

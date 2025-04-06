export default function Box({ children }) {
    return (
      <div className="w-full max-w-[500px] bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        {children}
      </div>
    );
  }
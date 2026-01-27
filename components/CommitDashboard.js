import React from 'react';

const CommitDashboard = ({ commits }) => {
  if (!commits || commits.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 text-center text-gray-500">
        No recent activity found. Waiting for webhooks...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold border-b pb-4 mb-4 text-gray-800">
        Latest Repository Activity
      </h2>
      <div className="space-y-4">
        {commits.map((commit, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
            <div>
              <p className="font-semibold text-blue-600">{commit.message}</p>
              <p className="text-sm text-gray-500">
                by <span className="font-medium text-gray-700">{commit.author}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                {commit.timestamp ? new Date(commit.timestamp).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitDashboard;

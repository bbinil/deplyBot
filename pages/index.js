import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CommitDashboard from '../components/CommitDashboard';

export default function Home() {
  const [commits, setCommits] = useState([]);

  const fetchCommits = async () => {
    try {
      const res = await fetch('/api/github-webhook');
      if (res.ok) {
        const data = await res.json();
        setCommits(data.commits || []);
      }
    } catch (error) {
      console.error('Failed to fetch commits:', error);
    }
  };

  useEffect(() => {
    fetchCommits();
    // Poll every 2 seconds for real-time updates
    const interval = setInterval(fetchCommits, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Head>
        <title>GitHub Activity Dashboard</title>
        <meta name="description" content="Live GitHub commits dashboard" />
      </Head>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          🚀 GitHub Activity Live Feed
        </h1>
        <CommitDashboard commits={commits} />
      </div>
    </div>
  );
}

import axios from 'axios';

// In-memory store for latest commits
let recentCommits = [];

export default async function handler(req, res) {
  // Handle GET request to fetch commits for the dashboard
  if (req.method === 'GET') {
    return res.status(200).json({ commits: recentCommits });
  }

  // Handle POST request from GitHub Webhook
  if (req.method === 'POST') {
    const { ref, commits, repository } = req.body;

    if (commits && commits.length > 0) {
      const repoName = repository ? repository.name : 'Unknown Repo';
      const latestCommit = commits[0];

      // Update in-memory store
      const newCommits = commits.map(c => ({
        message: c.message,
        author: c.author.name,
        timestamp: c.timestamp,
        url: c.url,
        id: c.id
      }));

      // Prepend new commits and keep the list size manageable (e.g., last 50)
      recentCommits = [...newCommits, ...recentCommits].slice(0, 50);

      // Prepare Slack Message
      const slackPayload = {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `🚀 *New Code Change in ${repoName}*`
            }
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Author:*\n${latestCommit.author.name}` },
              { type: "mrkdwn", text: `*Commit Message:*\n${latestCommit.message}` }
            ]
          },
          {
            type: "button",
            text: { type: "plain_text", text: "View Commit" },
            url: latestCommit.url
          }
        ]
      };

      try {
        console.log("Sending to Slack URL:", process.env.SLACK_WEBHOOK_URL ? "Defined" : "Undefined");

        // Send to Slack
        if (process.env.SLACK_WEBHOOK_URL) {
          await axios.post(process.env.SLACK_WEBHOOK_URL, slackPayload);
          console.log("Slack notification sent successfully.");
        } else {
          console.error("SLACK_WEBHOOK_URL is missing in environment variables.");
        }
        return res.status(200).json({ status: 'Success', message: 'Slack notified' });
      } catch (err) {
        console.error("Slack API Error:", err.message);
        if (err.response) {
          console.error("Slack Response Data:", err.response.data);
          console.error("Slack Response Status:", err.response.status);
        }
        return res.status(500).json({ status: 'Error', error: err.message, details: err.response?.data });
      }
    }

    return res.status(200).send('Event received, no commits to process.');
  }

  return res.status(405).send('Method Not Allowed');
}

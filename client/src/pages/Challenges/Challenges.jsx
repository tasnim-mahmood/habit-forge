import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Challenges.css";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
  });
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);

  // Simulate fetching user ID (use your authentication logic here)
  const getCurrentUserId = () => {
    // Example: replace this with actual authentication logic
    return localStorage.getItem("userId") || 1; // Default to 1 for testing
  };

  const userId = getCurrentUserId();

  useEffect(() => {
    axios
      .get("http://localhost:8800/challenges")
      .then((response) => {
        setChallenges(response.data);
      })
      .catch((error) => {
        console.error("Error fetching challenges:", error);
      });
  }, []);

  const handleJoinChallenge = (challengeId) => {
    axios
      .post("http://localhost:8800/userChallenges", {
        cha_user_id: userId,
        challenge_id: challengeId,
      })
      .then((response) => {
        alert("Challenge accepted successfully!");
      })
      .catch((error) => {
        console.error("Error accepting challenge:", error.response || error);
        alert("Error accepting challenge.");
      });
  };

  const handleInviteChallenge = (challengeId) => {
    alert(`You invited others to the challenge: ${challengeId}`);
    // Implement invitation logic here, e.g., invite friends via email or notification.
  };

  const handleCreateChallenge = async () => {
    const userId = localStorage.getItem("userId");
    if (newChallenge.name && newChallenge.description) {
      try {
        console.log("Sending data to server:", {
          name: newChallenge.name,
          description: newChallenge.description,
          created_by: userId, // Current user ID
        });

        const response = await axios.post("http://localhost:8800/challenges", {
          name: newChallenge.name,
          description: newChallenge.description,
          created_by: userId, // Current user ID
        });

        setChallenges([...challenges, response.data.challenge]);
        alert("Challenge created successfully!");
        setShowCreateChallenge(false);
      } catch (error) {
        console.error("Error creating challenge:", error.response || error);
        alert("Error creating challenge. Please check the console for more details.");
      }
    } else {
      alert("Please provide both name and description for the challenge.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewChallenge((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="community">
      <h2>Community Challenges</h2>
      <div className="challenge-list">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <h3>{challenge.name}</h3>
            <p>{challenge.description}</p>
            <div className="challenge-actions">
              <button onClick={() => handleJoinChallenge(challenge.id)}>
                Accept
              </button>
              <button onClick={() => handleInviteChallenge(challenge.id)}>
                Invite
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="create-challenge-btn"
        onClick={() => setShowCreateChallenge(true)}
      >
        Create New Challenge
      </button>

      {showCreateChallenge && (
        <div className="create-challenge-form">
          <h3>Create Challenge</h3>
          <input
            type="text"
            name="name"
            placeholder="Challenge Name"
            value={newChallenge.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Challenge Description"
            value={newChallenge.description}
            onChange={handleChange}
          />
          <button onClick={handleCreateChallenge}>Create Challenge</button>
          <button onClick={() => setShowCreateChallenge(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Challenges;

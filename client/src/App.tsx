import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();
    setData(data);
    setHash(hash);
  };

  const updateData = async () => {
    if (!data) {
      alert("Data is empty");
      return;
    }
    
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, hash }), // Sending data and hash to the server
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      await getData(); // Get the updated data and hash
    } else {
      alert("Data tampering detected or invalid update!");
    }
  };

  const verifyData = async () => {
    const storedData = localStorage.getItem("backupData");
    if (storedData && storedData === data) {
      alert("Local data matches server data.");
    } else {
      alert("Local data does not match server data. Fetch fresh data.");
      await getData(); // Refresh the data from server
    }
  };

  // Backup the current data
  const backupData = () => {
    localStorage.setItem("backupData", data || "");
    alert("Data backed up locally.");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={backupData}>
          Backup Data
        </button>
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import crypto from "crypto-js";

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
    const dataHash = crypto.SHA256(data ?? "").toString();
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, hash: dataHash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    const currentHash = crypto.SHA256(data ?? "").toString();
    console.log('hash', hash);
    console.log('currentHash', currentHash);
    if (currentHash === hash) {
      alert("Data is intact.");
    } else {
      alert("Data has been tampered with!");
      // Optionally, restore data from local storage or backup
      const backupData = localStorage.getItem("backupData");
      if (backupData) {
        setData(backupData);
        alert("Restored from backup.");
      } else {
        alert("No backup found.");
      }
    }
  };

  // Backup the current data
  const backupData = () => {
    console.log('data', data);
    localStorage.setItem("backupData", data ?? "");
    alert("Data backed up.");
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

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/f1' : '';

export default function Home() {
  const [driverNumber, setDriverNumber] = useState("");
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!driverNumber) {
      setDriverInfo(null);
      return;
    }

    setLoading(true);
    const fetchDriverInfo = async () => {
      try {
        const response = await fetch(`https://api.openf1.org/v1/drivers?driver_number=${driverNumber}&session_key=latest`);
        const data = await response.json();
        if (data && data.length > 0) {
          setDriverInfo(data[0]);
        } else {
          setDriverInfo(null);
        }
      } catch (error) {
        console.error("Error fetching driver info:", error);
        setDriverInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverInfo();
  }, [driverNumber]);

  return (
    <div className={styles.page}>
      <h1>Home</h1>
      <input
        type="number"
        placeholder="Enter driver number"
        value={driverNumber}
        onChange={(e) => setDriverNumber(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : driverInfo ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{driverInfo.full_name}</td>
              <td>{driverInfo.driver_number}</td>
              <td>{driverInfo.team_name}</td>
            </tr>
          </tbody>
        </table>
      ) : driverNumber ? (
        <p>No driver data found.</p>
      ) : (
        <p>Enter a driver number above.</p>
      )}
    </div>
  );
}

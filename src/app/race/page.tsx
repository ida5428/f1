"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/f1' : '';

export default function Race() {
  const [raceData, setRaceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState<number>(0);

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        if (sessionKey === 0) {
          const latestSessionData = await fetch("https://api.openf1.org/v1/sessions?session_key=latest");
          const latestSessionJson = await latestSessionData.json();
          const latestKey = latestSessionJson[0].session_key;

          setSessionKey(latestKey);
          return;
        }

        setLoading(true);
        setError(null);

        const driverDataResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);
        const driverData = await driverDataResponse.json();

        const driverPositionDataResponse = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`);
        const driverPositionData = await driverPositionDataResponse.json();

        const uniqueDrivers = Array.from(
          new Map(driverPositionData.map((position: any) => [position.driver_number, position])).values()
        );

        uniqueDrivers.sort((a: any, b: any) => a.position - b.position);

        // Combine driver info with position data
        const driverInfoMap = new Map(driverData.map((d: any) => [d.driver_number, d]));

        const combinedData = uniqueDrivers.map((pos: any) => ({
          ...pos,
          ...(driverInfoMap.get(pos.driver_number) || {})
        }));

        setRaceData(combinedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching race data:", err);
        setError("Failed to load race data");
        setLoading(false);
      }
    };

    fetchRaceData();
  }, [sessionKey]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Race Positions</h1>

      {loading && <p className={styles.loading}>Loading race data...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <button onClick={() => {
        setSessionKey(sessionKey-1);
      }}>Previous</button>

      <button onClick={() => {
        setSessionKey(sessionKey+1);
      }}>Next</button>

      {raceData.length > 0 && (
        <p>
          <strong>Session Key: {sessionKey}</strong>
        </p>
      )}

      <table className={styles.table}>
        <tr>
          <td>Position</td>
          <td>Driver Number</td>
          <td>Name</td>
        </tr>
        {raceData.map((driver) => (
          <tr key={driver.driver_number}>
            <td>
              {driver.position}
            </td>
            <td>
              #{driver.driver_number}
            </td>
            <td>
              {driver.first_name} {driver.last_name}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}

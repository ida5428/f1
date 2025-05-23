"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/f1' : '';

export default function Drivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // Using a recent session key for current drivers
        const response = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
        const data = await response.json();

        // Filter out duplicate drivers (by driver_number)
        const uniqueDrivers = Array.from(
          new Map(data.map((driver: any) => [driver.driver_number, driver])).values()
        );

        // Sort by team_name
        uniqueDrivers.sort((a: any, b: any) => a.team_name.localeCompare(b.team_name));

        // Set drivers and set loading to false
        setDrivers(uniqueDrivers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError("Failed to load drivers data");
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>F1 Drivers</h1>

      {loading && <p className={styles.loading}>Loading drivers...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {drivers.map((driver) => (
          <div key={driver.driver_number} className={styles.card}>
            {driver.headshot_url && (
              <div className={styles.imageContainer}>
                <img
                  src={driver.headshot_url}
                  alt={driver.full_name}
                  className={styles.driverImage}
                />
              </div>
            )}
            <div
              className={styles.cardContent}
              style={{ borderTop: `4px solid #${driver.team_colour || '000000'}` }}
            >
              <h2 className={styles.driverName}>{driver.full_name}</h2>
              <div className={styles.driverDetails}>
                <p className={styles.driverNumber}>#{driver.driver_number}</p>
                <p className={styles.team}>{driver.team_name}</p>
                <p className={styles.country}>{driver.country_code}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import styles from "./page.module.css";

interface SystemStatus {
  database: 'connected' | 'disconnected' | 'checking' | 'unknown';
  api: 'healthy' | 'unhealthy' | 'checking';
  timestamp: string;
  version: string;
  environment: string;
  uptime?: number;
  memory?: any;
  nodeVersion?: string;
  platform?: string;
}

export default function Home() {
  const [status, setStatus] = useState<SystemStatus>({
    database: 'checking',
    api: 'checking',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Check API health and database status
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();
        
        setStatus(prev => ({
          ...prev,
          api: healthResponse.ok ? 'healthy' : 'unhealthy',
          database: healthData.database?.status || 'unknown',
          timestamp: healthData.timestamp || new Date().toISOString(),
          version: healthData.version || '1.0.0',
          environment: healthData.environment || process.env.NODE_ENV || 'development',
          uptime: healthData.uptime,
          memory: healthData.memory,
          nodeVersion: healthData.system?.nodeVersion,
          platform: healthData.system?.platform
        }));
      } catch (error) {
        console.error('Error checking system status:', error);
        setStatus(prev => ({
          ...prev,
          api: 'unhealthy',
          database: 'disconnected'
        }));
      } finally {
        setLoading(false);
      }
    };

    checkSystemStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return '#10b981'; // green
      case 'unhealthy':
      case 'disconnected':
        return '#ef4444'; // red
      case 'checking':
        return '#f59e0b'; // yellow
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'connected':
        return 'Connected';
      case 'unhealthy':
        return 'Unhealthy';
      case 'disconnected':
        return 'Disconnected';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>🏥 YAMET Backend API</h1>
          <p className={styles.subtitle}>Sistem Manajemen Anak Terapi - Batam Tiban</p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Checking system status...</p>
          </div>
        ) : (
          <div className={styles.statusContainer}>
            <div className={styles.statusCard}>
              <div className={styles.cardHeader}>
                <h2>System Status</h2>
                <button 
                  onClick={() => window.location.reload()} 
                  className={styles.refreshButton}
                  title="Refresh status"
                >
                  🔄
                </button>
              </div>
              <div className={styles.statusGrid}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Database:</span>
                  <span 
                    className={styles.statusValue}
                    style={{ color: getStatusColor(status.database) }}
                  >
                    {getStatusText(status.database)}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>API:</span>
                  <span 
                    className={styles.statusValue}
                    style={{ color: getStatusColor(status.api) }}
                  >
                    {getStatusText(status.api)}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Environment:</span>
                  <span className={styles.statusValue}>{status.environment}</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Version:</span>
                  <span className={styles.statusValue}>{status.version}</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Last Check:</span>
                  <span className={styles.statusValue}>
                    {new Date(status.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
                {status.uptime && (
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Uptime:</span>
                    <span className={styles.statusValue}>
                      {Math.floor(status.uptime / 3600)}h {Math.floor((status.uptime % 3600) / 60)}m
                    </span>
                  </div>
                )}
                {status.nodeVersion && (
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Node.js:</span>
                    <span className={styles.statusValue}>{status.nodeVersion}</span>
                  </div>
                )}
                {status.platform && (
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Platform:</span>
                    <span className={styles.statusValue}>{status.platform}</span>
                  </div>
                )}
                {status.memory && (
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Memory:</span>
                    <span className={styles.statusValue}>
                      {Math.round(status.memory.heapUsed / 1024 / 1024)}MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h2>API Endpoints</h2>
              <div className={styles.endpoints}>
                <div className={styles.endpoint}>
                  <span className={styles.method}>GET</span>
                  <span className={styles.path}>/api/health</span>
                  <span className={styles.description}>Health check</span>
                </div>
                <div className={styles.endpoint}>
                  <span className={styles.method}>POST</span>
                  <span className={styles.path}>/api/auth/login</span>
                  <span className={styles.description}>User authentication</span>
                </div>
                <div className={styles.endpoint}>
                  <span className={styles.method}>GET</span>
                  <span className={styles.path}>/api/anak</span>
                  <span className={styles.description}>List children data</span>
                </div>
                <div className={styles.endpoint}>
                  <span className={styles.method}>GET</span>
                  <span className={styles.path}>/api/dashboard/stats</span>
                  <span className={styles.description}>Dashboard statistics</span>
                </div>
              </div>
            </div>

            <div className={styles.quickActions}>
              <h2>Quick Actions</h2>
              <div className={styles.actionButtons}>
                <a href="/api/health" className={styles.actionButton} target="_blank">
                  🔍 Health Check
                </a>
                <a href="/api/anak" className={styles.actionButton} target="_blank">
                  👶 Children Data
                </a>
                <a href="/api/dashboard/stats" className={styles.actionButton} target="_blank">
                  📊 Dashboard Stats
                </a>
              </div>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <p>© 2025 YAMET (Yayasan Anak Mandiri Terpadu) Batam Tiban</p>
          <p>Backend API v{status.version} | Environment: {status.environment}</p>
        </div>
      </main>
    </div>
  );
}

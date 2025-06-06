'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import { useTenant } from '../../contexts/TenantContext';

interface SystemMetrics {
  memory_usage: number;
  cpu_usage: number;
  timestamp: string;
}

interface ApplicationMetrics {
  request_rate: number;
  error_rate: number;
  timestamp: string;
}

interface Alert {
  name: string;
  severity: string;
  status: string;
  description: string;
  start_time: string;
}

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  start_time: string;
  end_time?: string;
  root_cause?: string;
  resolution?: string;
}

export default function DevOps() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([]);
  const [applicationMetrics, setApplicationMetrics] = useState<ApplicationMetrics[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tab, setTab] = useState('overview');
  const { tenant } = useTenant();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = `?tenantId=${tenant.id}`;
        const [systemRes, appRes, alertsRes, incidentsRes] = await Promise.all([
          fetch(`/api/v1/devops/metrics/system${q}`),
          fetch(`/api/v1/devops/metrics/application${q}`),
          fetch(`/api/v1/devops/alerts${q}`),
          fetch(`/api/v1/devops/incidents${q}`),
        ]);

        const systemData = await systemRes.json();
        const appData = await appRes.json();
        const alertsData = await alertsRes.json();
        const incidentsData = await incidentsRes.json();

        setSystemMetrics(prev => [...prev, systemData].slice(-20));
        setApplicationMetrics(prev => [...prev, appData].slice(-20));
        setAlerts(alertsData);
        setIncidents(incidentsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch DevOps data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [toast, tenant.id]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">DevOps Dashboard</h1>

      <div>
        <button onClick={() => setTab('overview')}>Overview</button>
        <button onClick={() => setTab('alerts')}>Alerts</button>
        <button onClick={() => setTab('incidents')}>Incidents</button>
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2>System Resources</h2>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={systemMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cpu_usage" stroke="#8884d8" name="CPU Usage (%)" />
                  <Line type="monotone" dataKey="memory_usage" stroke="#82ca9d" name="Memory Usage (bytes)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2>Application Performance</h2>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={applicationMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="request_rate" stroke="#8884d8" name="Request Rate" />
                  <Line type="monotone" dataKey="error_rate" stroke="#ff7300" name="Error Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2>Database Performance</h2>
            <div>Query performance, connection pool, cache hit rate, replication lag (mock data or coming soon)</div>
          </div>

          <div className="card">
            <h2>Infrastructure Health</h2>
            <div>Node status, container health, network/storage metrics (mock data or coming soon)</div>
          </div>

          <div className="card">
            <h2>Security & Compliance</h2>
            <div>Security events, compliance status, audit logs (mock data or coming soon)</div>
          </div>

          <div className="card">
            <h2>Business Intelligence & Analytics</h2>
            <div>Analytics, BI, data science insights (mock data or coming soon)</div>
          </div>

          <div className="card">
            <h2>Documentation & Technical Writing</h2>
            <div>Documentation status, agent output (mock data or coming soon)</div>
          </div>
        </div>
      )}

      {tab === 'alerts' && (
        <div>
          {alerts.map((alert) => (
            <div key={alert.name} className={getSeverityColor(alert.severity)}>
              <strong>{alert.name}</strong>
              <div>
                <span>{alert.description}</span>
                <span style={{ border: '1px solid #ccc', padding: '2px 6px', marginLeft: 8 }}>{alert.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'incidents' && (
        <div>
          {incidents.map((incident) => (
            <div key={incident.id} className="card">
              <div className="flex justify-between items-center">
                <strong>{incident.title}</strong>
                <span className={getSeverityColor(incident.severity)}>{incident.severity}</span>
              </div>
              <div>
                <p><strong>Status:</strong> {incident.status}</p>
                <p><strong>Start Time:</strong> {new Date(incident.start_time).toLocaleString()}</p>
                {incident.end_time && (
                  <p><strong>End Time:</strong> {new Date(incident.end_time).toLocaleString()}</p>
                )}
                {incident.root_cause && (
                  <p><strong>Root Cause:</strong> {incident.root_cause}</p>
                )}
                {incident.resolution && (
                  <p><strong>Resolution:</strong> {incident.resolution}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
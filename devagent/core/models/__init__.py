# This file makes the 'models' directory a Python package

"""
Initializes the models package and makes model classes available.
"""

from .user_model import User
from .tenant_model import Tenant, TenantCreate, TenantResponse, ResourceQuota
from .agent_model import Agent, AgentCreate, AgentResponse
# Remove problematic import of non-existent models
# from .monitoring_model import MonitoringData, MonitoringDataCreate, MonitoringDataResponse, Metric, MetricCreate, MetricResponse
from .monitoring_model import SystemMetrics, Alert, CostMetrics # Import existing models
from .audit_log_model import AuditLog

__all__ = [
    "User",
    "Tenant",
    "TenantCreate",
    "TenantResponse",
    "ResourceQuota",
    "Agent",
    "AgentCreate",
    "AgentResponse",
    # Remove non-existent models from __all__
    # "MonitoringData",
    # "MonitoringDataCreate",
    # "MonitoringDataResponse",
    # "Metric",
    # "MetricCreate",
    # "MetricResponse",
    "SystemMetrics", # Add existing models
    "Alert",
    "CostMetrics",
    "AuditLog",
]

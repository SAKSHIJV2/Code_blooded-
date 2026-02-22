[
  {
    "id": "L3-SIM-1",
    "company_context": {
      "company": "RideWave Mobility",
      "domain": "Ride Sharing",
      "environment": "Production",
      "your_role": "Platform Engineer"
    },
    "incident": {
      "reported_by": "Monitoring System",
      "issue": "Ride booking sometimes completes but payment fails.",
      "impact": "Revenue leakage and inconsistent system state.",
      "urgency": "Critical",
      "deadline_hours": 12
    },
    "architecture": {
      "services": ["booking_service", "payment_service"],
      "communication": "Synchronous API calls"
    },
    "files": [
      {
        "file_name": "booking_service.py",
        "content": "from payment_service import process_payment\n\ndef book_ride(user_id, amount):\n    payment_status = process_payment(user_id, amount)\n    return \"Ride Confirmed\""
      },
      {
        "file_name": "payment_service.py",
        "content": "def process_payment(user_id, amount):\n    import random\n    if random.choice([True, False]):\n        return True\n    return False"
      }
    ],
    "business_expectation": "Ride must only be confirmed after successful and verified payment processing.",
    "evaluation_metadata": {
      "task_type": "distributed_consistency",
      "skills": [
        "microservice_logic",
        "transaction_flow_validation",
        "reliability_design"
      ],
      "performance_sensitive": true
    }
  },

  {
    "id": "L3-SIM-2",
    "company_context": {
      "company": "DataNest Analytics",
      "domain": "SaaS Platform",
      "environment": "Production",
      "your_role": "Backend Engineer"
    },
    "incident": {
      "reported_by": "DevOps",
      "issue": "Dashboard crashes when analytics service times out.",
      "impact": "Enterprise dashboards unavailable.",
      "urgency": "Critical",
      "deadline_hours": 10
    },
    "architecture": {
      "services": ["dashboard_service", "analytics_service"],
      "communication": "HTTP API call"
    },
    "files": [
      {
        "file_name": "dashboard_service.py",
        "content": "import requests\n\ndef get_dashboard(user_id):\n    response = requests.get(f\"http://analytics/user/{user_id}\")\n    return response.json()"
      }
    ],
    "business_expectation": "System must handle timeouts, retries, or fallback logic when analytics service is unavailable.",
    "evaluation_metadata": {
      "task_type": "service_timeout_handling",
      "skills": [
        "resilience_design",
        "exception_management",
        "fallback_strategy"
      ],
      "performance_sensitive": true
    }
  },

  {
    "id": "L3-SIM-3",
    "company_context": {
      "company": "PayFlow Labs",
      "domain": "FinTech",
      "environment": "Production",
      "your_role": "Platform Reliability Engineer"
    },
    "incident": {
      "reported_by": "Customer Support",
      "issue": "Users charged twice during payment retry.",
      "impact": "Double charge complaints and refund overhead.",
      "urgency": "Critical",
      "deadline_hours": 14
    },
    "architecture": {
      "services": ["payment_gateway", "retry_handler"],
      "communication": "Internal retry mechanism"
    },
    "files": [
      {
        "file_name": "payment_gateway.py",
        "content": "def charge(user, amount, gateway):\n    try:\n        gateway.pay(user, amount)\n    except Exception:\n        gateway.pay(user, amount)"
      }
    ],
    "business_expectation": "Payment retries must be idempotent to prevent double charges.",
    "evaluation_metadata": {
      "task_type": "idempotency_issue",
      "skills": [
        "distributed_safety",
        "retry_mechanism_design",
        "financial_integrity"
      ],
      "performance_sensitive": true
    }
  },

  {
    "id": "L3-SIM-4",
    "company_context": {
      "company": "ShopSphere",
      "domain": "E-Commerce",
      "environment": "Production",
      "your_role": "Backend Engineer"
    },
    "incident": {
      "reported_by": "Monitoring Alerts",
      "issue": "Inventory overselling during flash sale.",
      "impact": "Negative stock and order cancellations.",
      "urgency": "Critical",
      "deadline_hours": 16
    },
    "architecture": {
      "services": ["order_service", "inventory_service"],
      "communication": "Concurrent requests"
    },
    "files": [
      {
        "file_name": "inventory_service.py",
        "content": "def reduce_stock(item_id, db):\n    stock = db[item_id]\n    if stock > 0:\n        db[item_id] = stock - 1"
      }
    ],
    "business_expectation": "Inventory updates must be safe under concurrent requests and prevent overselling.",
    "evaluation_metadata": {
      "task_type": "race_condition",
      "skills": ["concurrency_handling", "atomic_operations", "system_safety"],
      "performance_sensitive": true
    }
  },

  {
    "id": "L3-SIM-5",
    "company_context": {
      "company": "EduCore Systems",
      "domain": "EdTech",
      "environment": "Production",
      "your_role": "Platform Engineer"
    },
    "incident": {
      "reported_by": "DevOps",
      "issue": "Report generation fails when storage service is temporarily unavailable.",
      "impact": "Schools unable to download results.",
      "urgency": "High",
      "deadline_hours": 10
    },
    "architecture": {
      "services": ["report_service", "storage_service"],
      "communication": "External dependency call"
    },
    "files": [
      {
        "file_name": "report_service.py",
        "content": "def generate_report(user_id, storage):\n    data = storage.fetch(user_id)\n    return data"
      }
    ],
    "business_expectation": "System must handle storage failures gracefully and implement retry or fallback logic.",
    "evaluation_metadata": {
      "task_type": "service_dependency_failure",
      "skills": [
        "fault_tolerance",
        "dependency_management",
        "graceful_degradation"
      ],
      "performance_sensitive": true
    }
  }
]

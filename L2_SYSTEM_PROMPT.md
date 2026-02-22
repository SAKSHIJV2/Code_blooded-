[
  {
    "id": "L2-SIM-1",
    "company_context": {
      "company": "PayFlow Labs",
      "domain": "FinTech",
      "environment": "Production",
      "your_role": "Backend Engineer"
    },
    "incident": {
      "reported_by": "QA Team",
      "issue": "Refund API not updating wallet balance correctly.",
      "impact": "Customers receiving incorrect wallet credits.",
      "urgency": "High",
      "deadline_hours": 6
    },
    "internal_chat": [
      "QA: Refund succeeds but wallet balance remains unchanged.",
      "Senior Dev: Check refund flow between refund_service.py and wallet_service.py."
    ],
    "files": [
      {
        "file_name": "refund_service.py",
        "content": "from wallet_service import update_wallet\n\ndef process_refund(user_id, amount):\n    # refund processed successfully\n    return True"
      },
      {
        "file_name": "wallet_service.py",
        "content": "wallet_db = {}\n\ndef update_wallet(user_id, amount):\n    if user_id in wallet_db:\n        wallet_db[user_id] += amount\n    else:\n        wallet_db[user_id] = amount"
      }
    ],
    "business_expectation": "Refund must credit the user's wallet balance after successful processing.",
    "evaluation_metadata": {
      "task_type": "integration_bug",
      "skills": ["cross_file_analysis", "function_flow_understanding"],
      "performance_sensitive": false
    }
  },

  {
    "id": "L2-SIM-2",
    "company_context": {
      "company": "ShopSphere",
      "domain": "E-Commerce",
      "environment": "Production",
      "your_role": "Backend Developer"
    },
    "incident": {
      "reported_by": "DevOps",
      "issue": "Order history API latency high for users with many orders.",
      "impact": "Slow dashboard loading for power users.",
      "urgency": "High",
      "deadline_hours": 8
    },
    "internal_chat": [
      "DevOps: Observed N+1 query pattern.",
      "Senior Dev: Check order_service and user_service interaction."
    ],
    "files": [
      {
        "file_name": "order_service.py",
        "content": "def get_user_orders(user_id, db):\n    orders = db.get_orders(user_id)\n    result = []\n    for order in orders:\n        user = db.get_user(user_id)\n        result.append({\"order\": order, \"user\": user})\n    return result"
      }
    ],
    "business_expectation": "Order API must avoid redundant database calls and scale efficiently.",
    "evaluation_metadata": {
      "task_type": "n_plus_one_problem",
      "skills": ["performance_analysis", "db_call_optimization"],
      "performance_sensitive": true
    }
  },

  {
    "id": "L2-SIM-3",
    "company_context": {
      "company": "EduCore Systems",
      "domain": "EdTech",
      "environment": "Staging",
      "your_role": "Backend Engineer"
    },
    "incident": {
      "reported_by": "Product Manager",
      "issue": "Add grading scale feature without breaking existing average logic.",
      "impact": "Feature requested by partner schools.",
      "urgency": "Medium",
      "deadline_hours": 10
    },
    "internal_chat": [
      "PM: We need grade labels (A/B/C) along with numeric average.",
      "Senior Dev: Ensure backward compatibility."
    ],
    "files": [
      {
        "file_name": "result_service.py",
        "content": "def calculate_average(marks):\n    return sum(marks) / len(marks)"
      }
    ],
    "business_expectation": "System must return both average and grade label without breaking existing API structure.",
    "evaluation_metadata": {
      "task_type": "feature_addition",
      "skills": ["backward_compatibility", "feature_extension"],
      "performance_sensitive": false
    }
  },

  {
    "id": "L2-SIM-4",
    "company_context": {
      "company": "DataNest Analytics",
      "domain": "SaaS Platform",
      "environment": "Production",
      "your_role": "Backend Engineer"
    },
    "incident": {
      "reported_by": "Support Team",
      "issue": "User profile updates are not persisting in database.",
      "impact": "Enterprise clients unable to update account details.",
      "urgency": "High",
      "deadline_hours": 7
    },
    "internal_chat": [
      "Support: Profile changes revert after refresh.",
      "Senior Dev: Inspect update_profile logic in profile_service.py."
    ],
    "files": [
      {
        "file_name": "profile_service.py",
        "content": "def update_profile(user_id, new_data, db):\n    profile = db.get(user_id)\n    profile = new_data\n    return profile"
      }
    ],
    "business_expectation": "Updated profile data must persist in the database correctly.",
    "evaluation_metadata": {
      "task_type": "state_persistence_bug",
      "skills": ["data_mutation", "reference_handling"],
      "performance_sensitive": false
    }
  },

  {
    "id": "L2-SIM-5",
    "company_context": {
      "company": "RideWave Mobility",
      "domain": "Ride Sharing",
      "environment": "Production",
      "your_role": "Backend Engineer"
    },
    "incident": {
      "reported_by": "Operations Team",
      "issue": "Ride status updates are not reflected in billing module.",
      "impact": "Incorrect billing for completed rides.",
      "urgency": "High",
      "deadline_hours": 9
    },
    "internal_chat": [
      "Ops: Completed rides still showing as 'ongoing' in billing dashboard.",
      "Senior Dev: Check ride_service and billing_service flow."
    ],
    "files": [
      {
        "file_name": "ride_service.py",
        "content": "from billing_service import update_bill\n\ndef complete_ride(ride_id, db):\n    ride = db.get(ride_id)\n    ride['status'] = 'completed'\n    return ride"
      },
      {
        "file_name": "billing_service.py",
        "content": "def update_bill(ride_id, db):\n    ride = db.get(ride_id)\n    if ride['status'] == 'completed':\n        ride['billed'] = True"
      }
    ],
    "business_expectation": "When a ride is completed, billing module must update billing status accordingly.",
    "evaluation_metadata": {
      "task_type": "cross_module_sync_issue",
      "skills": ["module_integration", "workflow_understanding"],
      "performance_sensitive": false
    }
  }
]

# backend/services/graph_service.py

from services.dna_service import generate_fraud_dna


def build_fraud_network(phone, upi, transcript):

    dna = generate_fraud_dna(
        phone,
        upi,
        transcript
    )

    return {
        "fraud_dna": dna["dna_id"],
        "cluster": dna["cluster"],
        "network_risk": dna["network_risk"],
        "nodes": [
            {
                "id": phone,
                "type": "Phone"
            },
            {
                "id": upi,
                "type": "UPI"
            },
            {
                "id": dna["cluster"],
                "type": "FraudCluster"
            }
        ],
        "edges": [
            {
                "source": phone,
                "target": upi
            },
            {
                "source": upi,
                "target": dna["cluster"]
            }
        ]
    }
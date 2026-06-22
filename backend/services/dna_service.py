import hashlib

from datetime import datetime

from services.intelligence_service import (
    detect_fraud_patterns
)


def generate_fraud_dna(
    phone,
    upi,
    transcript
):

    analysis = detect_fraud_patterns(
        transcript
    )

    authority_score = (
        analysis["authority_score"]
    )

    urgency_score = (
        analysis["urgency_score"]
    )

    payment_score = (
        analysis["payment_score"]
    )

    confidence_score = (
        analysis["confidence_score"]
    )

    summary = (
        analysis["indicators"]
    )

    risk_total = (
        authority_score +
        urgency_score +
        payment_score
    )

    if risk_total >= 80:

        network_risk = "HIGH"

    elif risk_total >= 40:

        network_risk = "MEDIUM"

    else:

        network_risk = "LOW"

    combined = (
        f"{phone}{upi}{transcript}"
    )

    dna_hash = hashlib.sha256(
        combined.encode()
    ).hexdigest()

    dna_id = (
        "DNA-" +
        dna_hash[:8].upper()
    )

    cluster = (
        dna_hash[:4].upper()
    )

    return {

        "dna_id":
        dna_id,

        "fraud_type":
        "Digital Arrest",

        "authority_score":
        authority_score,

        "urgency_score":
        urgency_score,

        "payment_score":
        payment_score,

        "confidence_score":
        confidence_score,

        "network_risk":
        network_risk,

        "cluster":
        cluster,

        "generated_at":
        datetime.now().isoformat(),

        "intelligence_summary":
        summary
    }
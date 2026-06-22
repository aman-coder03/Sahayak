from services.intelligence_service import (
    detect_fraud_patterns
)


def analyze_scam(transcript):

    analysis = detect_fraud_patterns(
        transcript
    )

    risk_score = min(
        int(
            analysis["confidence_score"] * 1.5
        ),
        100
    )

    if risk_score >= 80:

        verdict = (
            "HIGH RISK DIGITAL ARREST SCAM"
        )

    elif risk_score >= 50:

        verdict = (
            "SUSPICIOUS"
        )

    else:

        verdict = (
            "LOW RISK"
        )

    return {

        "risk_score":
        risk_score,

        "verdict":
        verdict,

        "indicators":
        analysis["indicators"]
    }
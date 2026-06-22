from services.scam_service import (
    analyze_scam
)

from services.dna_service import (
    generate_fraud_dna
)


def analyze_citizen_risk(message):

    scam_result = analyze_scam(
        message
    )

    dna_result = generate_fraud_dna(
        phone="N/A",
        upi="N/A",
        transcript=message
    )

    return {

        "risk_score":
        scam_result["risk_score"],

        "verdict":
        scam_result["verdict"],

        "fraud_dna":
        dna_result["dna_id"],

        "reasons":
        dna_result[
            "intelligence_summary"
        ],

        "advisory": [

            "Do not transfer money.",

            "Do not share OTPs.",

            "Verify through official channels.",

            "Report suspicious activity."
        ]
    }
from sqlalchemy import text

from database.session import SessionLocal

from services.pdf_service import (
    create_evidence_pdf
)


def generate_evidence_package(case_id):

    db = SessionLocal()

    try:

        result = db.execute(
            text("""
                SELECT *
                FROM fraud_cases
                WHERE id = :case_id
            """),
            {
                "case_id": case_id
            }
        )

        row = result.fetchone()

        if not row:

            return {
                "error": "Case not found"
            }

        evidence = {

            "case_id": row.id,

            "dna_id": row.dna_id,

            "cluster": row.cluster_id,

            "fraud_type": row.fraud_type,

            "risk": row.network_risk,

            "phone": row.phone,

            "upi": row.upi,

            "created_at": str(row.created_at),

            "investigator_notes": [

                "Authority Impersonation Detected",

                "Urgency/Fear Tactics Observed",

                "Payment Request Detected"

            ],

            "recommended_actions": [

                "Freeze linked UPI accounts",

                "Escalate to Cyber Crime Cell",

                "Preserve communication records"

            ]
        }

        # Generate PDF
        pdf_file = create_evidence_pdf(
            evidence
        )

        evidence["pdf_file"] = pdf_file

        evidence["report_status"] = (
            "Generated Successfully"
        )

        return evidence

    finally:

        db.close()
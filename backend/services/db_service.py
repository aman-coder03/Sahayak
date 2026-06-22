from database.session import SessionLocal

from models.fraud_case import FraudCase


def save_case(data, result):

    db = SessionLocal()

    try:

        case = FraudCase(

            phone=data.phone,
            upi=data.upi,
            transcript=data.transcript,

            dna_id=result["dna_id"],
            cluster_id=result["cluster"],

            authority_score=result["authority_score"],
            urgency_score=result["urgency_score"],
            payment_score=result["payment_score"],

            confidence_score=result["confidence_score"],

            network_risk=result["network_risk"],

            fraud_type=result["fraud_type"],
            
            city=data.city,
            state=data.state,
            latitude=data.latitude,
            longitude=data.longitude,
        )

        db.add(case)

        db.commit()

        db.refresh(case)

        return case.id

    finally:

        db.close()
from sqlalchemy import text

from database.session import SessionLocal


def dashboard_summary():

    db = SessionLocal()

    try:

        total_cases = db.execute(
            text(
                "SELECT COUNT(*) FROM fraud_cases"
            )
        ).scalar()

        high_risk = db.execute(
            text("""
                SELECT COUNT(*)
                FROM fraud_cases
                WHERE network_risk='HIGH'
            """)
        ).scalar()

        return {

            "total_cases":
            total_cases,

            "high_risk_cases":
            high_risk,

            "threat_level":
            "SEVERE"
            if high_risk > 5
            else "MODERATE"
        }

    finally:

        db.close()
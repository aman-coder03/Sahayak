from sqlalchemy import text
from database.session import SessionLocal


def investigator_query(query: str):

    db = SessionLocal()

    try:

        query = query.lower()

        if "high risk" in query:

            sql = """
            SELECT *
            FROM fraud_cases
            WHERE network_risk='HIGH'
            """

            result = db.execute(text(sql))

        elif "digital arrest" in query:

            sql = """
            SELECT *
            FROM fraud_cases
            WHERE fraud_type='Digital Arrest'
            """

            result = db.execute(text(sql))

        elif "cluster" in query:

            cluster = query.split()[-1].upper()

            result = db.execute(
                text("""
                SELECT *
                FROM fraud_cases
                WHERE cluster_id=:cluster
                """),
                {"cluster": cluster}
            )

        else:

            result = db.execute(
                text("""
                SELECT *
                FROM fraud_cases
                ORDER BY created_at DESC
                LIMIT 20
                """)
            )

        rows = result.fetchall()

        matches = []

        for row in rows:

            matches.append(
                {
                    "case_id": row.id,
                    "cluster": row.cluster_id,
                    "dna_id": row.dna_id,
                    "risk": row.network_risk,
                    "phone": row.phone,
                    "upi": row.upi,
                    "fraud_type": row.fraud_type
                }
            )

        return {
            "total_cases_found": len(matches),
            "matches": matches
        }

    finally:
        db.close()
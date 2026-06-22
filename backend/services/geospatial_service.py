from sqlalchemy import text

from database.session import SessionLocal


def get_crime_hotspots():

    db = SessionLocal()

    try:

        result = db.execute(
            text("""
                SELECT
                    city,
                    COUNT(*) as total_cases
                    FROM fraud_cases
                    WHERE city IS NOT NULL
                    GROUP BY city
                    ORDER BY total_cases DESC
            """)
        )

        rows = result.fetchall()

        hotspots = []

        for row in rows:

            hotspots.append(
                {
                    "city": row.city,
                    "cases": row.total_cases
                }
            )

        return {
            "hotspots": hotspots
        }

    finally:

        db.close()